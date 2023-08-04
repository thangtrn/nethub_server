import {Request, Response} from 'express';
import {OkResponse, UnprocessableException} from '~/response';
import {userService} from '~/services';
import {followSchemal, validator} from '~/utils';

export default class userCtl {
   public static addFollow = async (req: Request, res: Response) => {
      const {value, errors} = validator(req.body, followSchemal);

      if (errors) {
         throw new UnprocessableException(errors);
      }

      await userService.addFollow(value.userId, value.followerId);

      return new OkResponse(res, `Follow user with id = ${value.userId} successful.`);
   };

   public static unfollow = async (req: Request, res: Response) => {
      const {value, errors} = validator(req.body, followSchemal);

      if (errors) {
         throw new UnprocessableException(errors);
      }

      await userService.unfollow(value.userId, value.followerId);

      return new OkResponse(res, `Unfollow user with id = ${value.userId} successful.`);
   };
}
