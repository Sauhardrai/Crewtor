import express from 'express';
import { login, sendOtp, signup, verifyOtp } from '../controller/auth.js';
const routes = express.Router();


routes.post('/login',login);

routes.post('/sendotp',sendOtp);

routes.post('/verifyotp',verifyOtp);

routes.post('/signup', signup);




export default routes ;