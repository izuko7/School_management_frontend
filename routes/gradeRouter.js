import express from 'express';
import { getGrade, getGrades, createGradeHandler, updateGradeHandler, deleteGradeHandler } from '../controllers/gradeController.js';

const router = express.Router();

// GET 
router.get('/', getGrades);

// GET with id 
router.get('/:id', getGrade);

// POST 
router.post('/', createGradeHandler);

// PUT 
router.put('/:id', updateGradeHandler);

// DELETE 
router.delete('/:id', deleteGradeHandler);


export default router;