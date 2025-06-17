import { Request,NextFunction,Response, Router } from 'express';
import { registerController, loginController, meController, logoutController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = Router(); 

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/logout',logoutController);
router.get('/me', [authenticate], meController)
router.get('/authorize', [authenticate], authorize("DEV") ,meController)

  

export default router;
