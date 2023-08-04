import {Request, Response, NextFunction} from 'express';
import {RoleName} from '~/enum';
import {ForbiddenException, NotFoundException} from '~/response';
import {postService} from '~/services';

const canUpdateOrDeletePost = async (req: Request, res: Response, next: NextFunction) => {
   const jwt = req.jwt;
   const postId: number = Number(req.params.id);
   if (!(await postService.isExistPost(postId))) {
      throw new NotFoundException(`Not found post with id = '${postId}!'`);
   } else if ((await postService.isAuthor(postId, jwt.userId)) || jwt.role === RoleName.ADMIN) {
      return next();
   }
   throw new ForbiddenException("You don't have permission to access");
};
export default canUpdateOrDeletePost;
