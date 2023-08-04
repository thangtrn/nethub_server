import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import dataSource from '~/config/data-source';
import Role from '~/models/Role';
import User from '~/models/User';
import {ConflictException, UnauthorizedException} from '~/response';
import {generateRefreshToken, generateToken} from '~/middleware/authentication';
import RefreshToken from '~/models/RefreshToken';
import {authSelection} from './Selections';
import {ILogin, IRegister} from '~/interface';
import {RoleName} from '~/enum';
import {userRepo as authRepo, refreshTokenRepo} from '~/reposistory';
// repository

export default class authService {
   // register
   public static register = async (value: IRegister): Promise<any> => {
      const isExist = await authRepo.findOneBy({email: value.email});
      console.log('is ex: ', isExist);
      if (isExist) {
         throw new ConflictException(`${value.email} is already exists.`);
      } else {
         const {email, password, name, gender, birthday} = value;

         // find role
         const roleUser: any = await dataSource.manager.findOne(Role, {
            where: {role: RoleName.USER},
         });

         // hash password
         const hashPwd = await bcrypt.hash(password, Number(process.env.SALT));

         // save user to db
         const {id} = await authRepo.save(
            new User(email, hashPwd, name, birthday, gender, roleUser.id)
         );

         // select all info of user
         const newUser = await authRepo.findOne({
            where: {
               id: id,
            },
            relations: {
               role: true,
            },
            select: authSelection,
         });

         return newUser;
      }
   };

   // login
   public static login = async (value: ILogin) => {
      // check exist email
      const isExist = await authRepo.findOne({
         where: {email: value.email},
         relations: {
            role: true,
         },
         select: {...authSelection, password: true},
      });

      if (!isExist) {
         throw new UnauthorizedException('Email or password incorrect.');
      }

      // check match password
      const isMatch = await bcrypt.compare(value.password, isExist.password);
      if (!isMatch) {
         throw new UnauthorizedException('Email or password incorrect.');
      }

      const payloadForToken = {
         userId: isExist.id,
         // email: isExist.email,
         role: isExist.role.role,
         roleId: isExist.role.id,
      };

      const accessToken = generateToken(payloadForToken);

      const refreshToken = generateRefreshToken(payloadForToken);

      // save rf to db
      await refreshTokenRepo.save(new RefreshToken(refreshToken, isExist.id));

      // remove the password column before returning it to the user
      const {password, ...user} = isExist;

      return {
         user: user,
         token: {
            accessToken,
            refreshToken,
         },
      };
   };

   public static logout = async (userId: number, refreshToken: string) => {
      const refreshItem: RefreshToken | undefined = await findRefreshTokenByUserId(
         userId,
         refreshToken
      );

      if (!refreshItem) {
         return false;
      }

      await refreshTokenRepo.delete(refreshItem.id);

      return true;
   };

   public static getAccessToken = async (refreshToken: string) => {
      const isExist = await refreshTokenRepo.findOne({where: {token: refreshToken}});

      if (!isExist) {
         throw new UnauthorizedException();
      }
      let accessToken = '';

      try {
         const decoded: any = jwt.verify(refreshToken, process.env.JWT_REFRESHTOKEN as string);

         accessToken = generateToken({
            userId: decoded.userId,
            role: decoded.role,
            roleId: decoded.roleId,
         });
      } catch (error: any) {
         await refreshTokenRepo.delete(isExist.id);
         throw new UnauthorizedException('Unauthorized because ' + error.message);
      }

      return accessToken;
   };
}

const findRefreshTokenByUserId = async (
   userId: number,
   refreshToken: string
): Promise<RefreshToken | undefined> => {
   const isExist = await authRepo.findOne({
      where: {
         id: userId,
      },
      relations: {refreshTokens: true},
   });

   const refreshItem = isExist?.refreshTokens.find((item) => item.token === refreshToken);
   return refreshItem;
};
