import {Router} from 'express';
import {userController} from '~/controllers';
import {authentication, canCreate} from '~/middleware';

const router: Router = Router();

router.post('/user/follow', authentication, canCreate('followerId'), userController.addFollow);
router.post('/user/unfollow', authentication, canCreate('followerId'), userController.unfollow);

export default router;
