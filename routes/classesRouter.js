import express from 'express';
import { getClasses, getclasse, createClasseHandler, updateClasseHandler, deleteClasseHandler } from '../controllers/classesController.js';
import { verifyToken } from '../middleware/authVerify.js';


const router = express.Router();

// GET 
router.get('/', verifyToken, getClasses);


// GET avec id 
router.get('/:id', verifyToken, getclasse);

// POST 
router.post('/', verifyToken, createClasseHandler);


// PUT 
router.put('/:id', verifyToken, updateClasseHandler);

// DELETE 
router.delete('/:id', verifyToken, deleteClasseHandler);


export default router;