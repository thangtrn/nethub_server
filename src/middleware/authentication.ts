import jwt from 'jsonwebtoken';
import {Request, Response, NextFunction} from 'express';
import {UnauthorizedException} from '~/response';
import {IPayloadToken} from '~/interface';
import {RoleName} from '~/enum';

export const generateToken = (
   payload: IPayloadToken,
   expiresIn: string | number = '30m'
): string => {
   return jwt.sign(payload, process.env.JWT_ACCESSTOKEN as string, {expiresIn});
};

export const generateRefreshToken = (
   payload: IPayloadToken,
   expiresIn: string | number = '7d'
): string => {
   return jwt.sign(payload, process.env.JWT_REFRESHTOKEN as string, {expiresIn});
};

const authentication = (req: Request, res: Response, next: NextFunction) => {
   const authenticationToken: string = req.headers.authorization || '';

   if (!authenticationToken || !authenticationToken.startsWith('Bearer')) {
      throw new UnauthorizedException("Authentication invalid with 'Bearer'!");
   }

   const token = authenticationToken.split(' ')[1];

   jwt.verify(token, process.env.JWT_ACCESSTOKEN as string, (err, decoded: any) => {
      if (err) {
         throw new UnauthorizedException(
            `Authentication was forbidden with error: ${err.message}!`
         );
      }
      req.jwt = decoded;
      next();
   });
};

export default authentication;
