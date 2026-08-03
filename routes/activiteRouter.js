import express from 'express';
import { getactivites } from '../controllers/activiteController.js';
import { verifyToken } from '../middleware/authVerify.js';  


const router = express.Router();


router.get('/', verifyToken, getactivites);


export default router