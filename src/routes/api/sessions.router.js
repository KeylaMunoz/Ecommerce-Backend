import { Router } from 'express';
import passport from 'passport';
import { failLogin, failRegister, login, logout, register } from '../../controllers/session.controller.js';
// import { passportCall } from '../../utils.js';

const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: 'failregister' }), register);

router.get('/failregister', failRegister)

router.post('/login',  passport.authenticate('login', { failureRedirect: 'faillogin' }), login);

router.get('/faillogin', failLogin)

router.post('/logout', logout);

export default router;
