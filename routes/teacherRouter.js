import express from 'express';
import { getTeacher, getTeachers, createTeacherHandler, updateTeacherHandler, deleteTeacherHandler } from '../controllers/teacherController.js';


const router = express.Router();

// GET 
router.get('/', getTeachers);

// GET avec id 
router.get('/:id', getTeacher);

// POST 
router.post('/', createTeacherHandler);

// PUT 
router.put('/:id', updateTeacherHandler);

// DELETE 
router.delete('/:id', deleteTeacherHandler);

export default router;