import expess from 'express';
import { login, logout, register } from '../controller/authController.js';

const authRouter = expess.Router();

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',logout);

export default authRouter;