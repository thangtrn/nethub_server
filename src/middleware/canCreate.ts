import {Request, Response, NextFunction} from 'express';
import {ForbiddenException} from '~/response';

const canCreate = (target: string = 'userId') => {
   return async (req: Request, res: Response, next: NextFunction) => {
      const jwt = req.jwt;
      const userId = Number(req.body[target]);
      console.log('CREATE: ', userId, jwt.userId, target);
      if (Number(jwt.userId) === userId) {
         return next();
      }
      throw new ForbiddenException("You don't have permission to access");
   };
};

export default canCreate;
