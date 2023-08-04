import {Router} from 'express';
import {authController} from '~/controllers';
import {authentication} from '~/middleware';

const router: Router = Router();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/logout', authentication, authController.logout);
router.get('/auth/refresh-token', authController.refreshToken);

export default router;
