import {Request, Response} from 'express';
import {INewsFeed, IPost, IPostMedia} from '~/interface';
import {
   validator,
   postSchema,
   postQuerySchema,
   likeSchema,
   commentSchema,
   uploadSingle,
   replySchema,
} from '~/utils';
import {ConflictException, NotFoundException, UnprocessableException} from '~/response';
import {postService} from '~/services';
import {uploadMultiple} from '~/utils';
import {OkResponse} from '~/response';
import {MediaType} from '~/enum';

export default class postCtl {
   public static getNewsFeed = async (req: Request, res: Response) => {
      const {value, errors} = validator(req.query, postQuerySchema);

      if (errors) {
         throw new UnprocessableException(errors);
      }

      const result: INewsFeed = await postService.getNewsFeed(value);

      return new OkResponse(res, 'Get newsfeed successful.', result.posts, null, result.pagination);
   };

   public static createPost = async (req: Request, res: Response) => {
      const {media, ...rest}: IPost = req.body;
      const {value, errors} = validator(rest, postSchema);
      if (errors) {
         throw new UnprocessableException(errors);
      }

      // upload to cloudinary
      const files = req.files as Express.Multer.File[];
      let mediaList: IPostMedia[] = [];
      if (files.length > 0) {
         mediaList = await uploadMultiple(files);
      }
      // services
      const result = await postService.createPost({...value, media: mediaList});

      return new OkResponse(res, 'Create post successful.', result);
   };

   public static deletePost = async (req: Request, res: Response) => {
      const postId: number = Number(req.params.id);
      console.log(postId);
      await postService.deletePost(postId);

      return new OkResponse(res, 'Delete post succesful.');
   };

   public static likePost = async (req: Request, res: Response) => {
      const {value, errors} = validator(req.body, likeSchema);
      if (errors) {
         throw new UnprocessableException(errors);
      }

      await postService.likePost(value.userId, value.postId);

      return new OkResponse(res, `Like post with id = ${value.postId} successful.`);
   };

   public static unlikePost = async (req: Request, res: Response) => {
      const {value, errors} = validator(req.body, likeSchema);
      if (errors) {
         throw new UnprocessableException(errors);
      }

      await postService.unlikePost(value.userId, value.postId);

      return new OkResponse(res, `Unlike post with id = ${value.postId} successful.`);
   };

   public static commentPost = async (req: Request, res: Response) => {
      const {media, ...rest} = req.body;
      const {value, errors} = validator(rest, commentSchema);
      if (errors) {
         throw new UnprocessableException(errors);
      }

      if (!(await postService.isExistPost(value.postId))) {
         throw new NotFoundException(`Not found post with id = ${value.postId}.`);
      }

      // upload Image
      const file = req.file as Express.Multer.File;
      let mediaUpload: IPostMedia | null = null;
      if (file) {
         const type = file.mimetype === 'video/mp4' ? MediaType.VIDEO : MediaType.IMAGE;
         mediaUpload = await uploadSingle(file.path, type);
      }

      const result = await postService.commentPost({...value, ...mediaUpload});

      return new OkResponse(res, 'Create new comment successful.', result);
   };

   public static replyComment = async (req: Request, res: Response) => {
      const {media, ...rest} = req.body;
      const {value, errors} = validator(rest, replySchema);
      if (errors) {
         throw new UnprocessableException(errors);
      }

      if (!(await postService.isExistPost(value.postId))) {
         throw new NotFoundException(`Not found post with id = ${value.postId}.`);
      }

      if (await postService.isValidComment(value.parentId)) {
         throw new ConflictException();
      }

      // upload Image
      const file = req.file as Express.Multer.File;
      let mediaUpload: IPostMedia | null = null;
      if (file) {
         const type = file.mimetype === 'video/mp4' ? MediaType.VIDEO : MediaType.IMAGE;
         mediaUpload = await uploadSingle(file.path, type);
      }

      const result = await postService.replyComment({...value, ...mediaUpload});

      return new OkResponse(res, 'Create new comment successful.', result);
   };

   public static getCommentByPost = async (req: Request, res: Response) => {
      const postId: number = Number(req.params.id);
      if (!(await postService.isExistPost(postId))) {
         throw new NotFoundException(`Not found post with id = '${postId}!'`);
      }

      const {value, errors} = validator(req.query, postQuerySchema);

      if (errors) {
         throw new UnprocessableException(errors);
      }

      const result = await postService.getCommentByPost(postId, value);

      return new OkResponse(
         res,
         `Get comment from post with id = ${postId} successful`,
         result.comments,
         null,
         result.pagination
      );
   };
}
