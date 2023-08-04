import {commentSelection, createPostSelection, postSelection} from './Selections';
import {Post, Comment, PostMedia, Like} from '~/models';
import {IPage, INewsFeed, IPost, IComment, IReply, IGetComment} from '~/interface';
import {ConflictException, NotFoundException} from '~/response';
import {
   commentRepo,
   followerRepo,
   likeRepo,
   postMediaRepo,
   postRepo,
   userRepo,
} from '~/reposistory';
import {MediaType} from '~/enum';
import {IsNull, In} from 'typeorm';

export default class postService {
   public static createPost = async ({userId, content, isGlobal, media = []}: IPost) => {
      const post = new Post(userId, content, isGlobal);

      const {id} = await postRepo.save(post);

      if (media.length > 0) {
         const postMedia: PostMedia[] = media.map(
            (item) => new PostMedia(id, item.cloudinaryId, item.mediaUrl, item.type)
         );
         await postMediaRepo.save(postMedia);
      }

      const newPost = await postRepo.findOne({
         where: {id},
         relations: {user: true, postMedia: true, likes: true},
         select: createPostSelection,
      });

      return newPost;
   };

   public static isExistPost = async (postId: number): Promise<boolean> => {
      return (await postRepo.findOne({where: {id: postId}})) !== null;
   };

   public static isExistLikePost = async (userId: number, postId: number): Promise<boolean> => {
      return (await likeRepo.findOneBy({userId: userId, postId: postId})) !== null;
   };

   public static isAuthor = async (postId: number, userId: number): Promise<boolean> => {
      return (await postRepo.findOne({where: {id: postId}}))?.userId === userId;
   };

   public static deletePost = async (postId: number) => {
      await postRepo.delete(postId);
   };

   public static likePost = async (userId: number, postId: number) => {
      if (!(await this.isExistPost(postId))) {
         throw new NotFoundException(`Not found post with id = ${postId}.`);
      }

      if (await this.isExistLikePost(userId, postId)) {
         throw new ConflictException(`Post with id = ${postId} has been liked.`);
      }

      await likeRepo.save(new Like(userId, postId));
   };

   public static unlikePost = async (userId: number, postId: number) => {
      if (!(await this.isExistPost(postId))) {
         throw new NotFoundException(`Not found post with id = ${postId}.`);
      }

      if (!(await this.isExistLikePost(userId, postId))) {
         throw new ConflictException(`Post with id id = ${postId} hasn't been liked.`);
      }

      await likeRepo.delete({userId: userId, postId: postId});
   };

   private static formatGetPosts = (posts: Post[]) => {
      return posts.map((item) => ({
         ...item,
         likes: item.likes.map((like) => ({...like.user})),
      }));
   };

   // continue
   public static getNewsFeed = async ({page, limit}: IPage): Promise<INewsFeed | any> => {
      const userFollowers = await followerRepo.findBy({followerId: 1});
      const userIds: number[] = userFollowers.map((item) => item.userId);
      const [posts, total] = await postRepo.findAndCount({
         where: [
            {
               userId: In<number>(userIds),
            },
            {isGlobal: true},
            {userId: 1},
         ],
         relations: ['user', 'postMedia', 'likes', 'likes.user'],
         select: postSelection,
         order: {
            createdAt: 'DESC',
         },
         skip: (page - 1) * limit,
         take: limit,
      });

      return {
         posts: this.formatGetPosts(posts),
         pagination: {
            page: page,
            limit: limit,
            total: Math.ceil(total / limit),
         },
      };
   };

   public static commentPost = async ({
      userId,
      postId,
      content,
      type = MediaType.NON,
      cloudinaryId,
      mediaUrl,
   }: IComment): Promise<IComment> => {
      const newComment = await commentRepo.save(
         new Comment(userId, postId, content, undefined, type, cloudinaryId, mediaUrl)
      );

      return newComment;
   };

   public static isValidComment = async (commentId: number): Promise<boolean> => {
      console.log(commentId);
      return (await commentRepo.findOneBy({id: commentId, parentId: IsNull()})) === null;
   };

   public static replyComment = async ({
      userId,
      postId,
      content,
      parentId,
      type = MediaType.NON,
      cloudinaryId,
      mediaUrl,
   }: IReply): Promise<IComment> => {
      const replyComment = await commentRepo.save(
         new Comment(userId, postId, content, parentId, type, cloudinaryId, mediaUrl)
      );

      return replyComment;
   };

   public static getCommentByPost = async (
      postId: number,
      {page, limit}: IPage
   ): Promise<IGetComment> => {
      const [comments, total] = await commentRepo.findAndCount({
         where: {postId: postId},
         relations: ['replies', 'user', 'replies.user'],
         select: commentSelection,
         skip: (page - 1) * limit,
         take: limit,
      });

      return {
         comments: comments,
         pagination: {
            page: page,
            limit: limit,
            total: Math.ceil(total / limit),
         },
      };
   };
}
