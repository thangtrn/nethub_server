import {Request, Response} from 'express';
import {loginSchema, registerSchema, validator} from '~/utils';
import User from '~/models/User';
import {ForbiddenException, UnauthorizedException, UnprocessableException} from '~/response';
import OkResponse from '~/response/okResponse';
import {authService} from '~/services';

export default class authCtl {
   public static register = async (req: Request, res: Response) => {
      const {value, errors} = validator(req.body, registerSchema);
      if (errors) {
         throw new UnprocessableException(errors);
      }

      const result: User = await authService.register(value);

      return new OkResponse(res, 'Register successful.', result);
   };

   public static login = async (req: Request, res: Response) => {
      const {value, errors} = validator(req.body, loginSchema);

      if (errors) {
         throw new UnprocessableException(errors);
      }
      res.clearCookie('refreshToken');
      const {user, token} = await authService.login(value);

      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      const expirationDate = new Date(Date.now() + sevenDays);
      res.cookie('refreshToken', token.refreshToken, {
         path: '/',
         httpOnly: true,
         sameSite: 'strict',
         expires: expirationDate,
      });

      return new OkResponse(res, 'Login successful.', user, token.accessToken);
   };

   public static logout = async (req: Request, res: Response) => {
      const refreshToken: string = req.cookies.refreshToken;
      if (!refreshToken) {
         throw new ForbiddenException('Forbidden to logout.');
      }

      const isLogoutSuccess: boolean = await authService.logout(req.jwt.userId, refreshToken);

      if (!isLogoutSuccess) {
         throw new ForbiddenException('Forbidden to logout.');
      }

      res.clearCookie('refreshToken');

      return new OkResponse(res, 'Logout successful.');
   };

   public static refreshToken = async (req: Request, res: Response) => {
      // const authenticationToken: string = req.headers.authorization || '';

      // if (!authenticationToken || !authenticationToken.startsWith('Bearer')) {
      //    throw new UnauthorizedException("Authentication invalid with 'Bearer'!");
      // }

      // const refreshToken = authenticationToken.split(' ')[1];
      const refreshToken: string = req.cookies.refreshToken;

      console.log(refreshToken);

      if (!refreshToken) {
         throw new UnauthorizedException('Login to perform this function.');
      }

      const accessToken = await authService.getAccessToken(refreshToken);

      return new OkResponse(res, 'Get new access token successful.', null, accessToken);
   };
}
