import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { capdash, sessionCreate, profileUpdate ,crewDash , crewProfileUpdate, fetchCaptain, editSession, deleteSession } from '../controller/dashboard.js';

const router = express.Router()


router.get('/cap' , verifyToken , capdash);

router.put('/cap/session',verifyToken,sessionCreate);

router.put('/cap/session/edit',verifyToken, editSession);

router.delete('/cap/session/delete',verifyToken,deleteSession)

router.put('/cap/profile' , verifyToken ,profileUpdate);

router.get('/crew',verifyToken,crewDash);

router.put('/crew/profile' , verifyToken ,crewProfileUpdate);

router.get('/crew/captain/:id', fetchCaptain);



export default router;