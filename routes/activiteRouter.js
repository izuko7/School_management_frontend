import express from 'express';
import { getactivites } from '../controllers/activiteController.js';
import { checkRole } from '../middleware/roleCheck.js';
import { verifyToken } from '../middleware/authVerify.js';  


const router = express.Router();


router.get('/', verifyToken, checkRole('admin'), getactivites);


export default router