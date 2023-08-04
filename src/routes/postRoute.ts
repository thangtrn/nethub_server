import {Router} from 'express';
import {postController} from '~/controllers';
import {authentication} from '~/middleware';
import {canCreate, canUpdateOrDeletePost} from '~/middleware';
import upload from '~/middleware/multer';

const router: Router = Router();

router.use(authentication);

router.get('/newsfeed', postController.getNewsFeed);

router.post(
   '/posts',

   upload.array('media', 5),
   canCreate(),
   postController.createPost
);

router.delete('/posts/:id', canUpdateOrDeletePost, postController.deletePost);

router.post('/posts/like', canCreate(), postController.likePost);

router.post('/posts/unlike', canCreate(), postController.unlikePost);

router.get('/posts/:id/comment', postController.getCommentByPost);

router.post(
   '/posts/comment',

   upload.single('media'),
   canCreate(),
   postController.commentPost
);

router.post(
   '/posts/reply-comment',

   upload.single('media'),
   canCreate(),
   postController.replyComment
);

export default router;
