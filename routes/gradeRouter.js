import express from 'express';
import { getGrade, getGrades, createGradeHandler, updateGradeHandler, deleteGradeHandler } from '../controllers/gradeController.js';
import { verifyToken } from '../middleware/authVerify.js';

const router = express.Router();

// GET 
router.get('/', verifyToken, getGrades);

// GET with id 
router.get('/:id', verifyToken, getGrade);

// POST 
router.post('/', verifyToken, createGradeHandler);

// PUT 
router.put('/:id', verifyToken, updateGradeHandler);

// DELETE 
router.delete('/:id', verifyToken, deleteGradeHandler);


export default router;