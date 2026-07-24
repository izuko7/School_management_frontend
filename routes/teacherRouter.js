import express from 'express';
import { getTeacher, getTeachers, createTeacherHandler, updateTeacherHandler, deleteTeacherHandler } from '../controllers/teacherController.js';
import { verifyToken } from '../middleware/authVerify.js';


const router = express.Router();

// GET 
router.get('/', verifyToken, getTeachers);

// GET avec id 
router.get('/:id', verifyToken, getTeacher);

// POST 
router.post('/', verifyToken, createTeacherHandler);

// PUT 
router.put('/:id', verifyToken, updateTeacherHandler);

// DELETE 
router.delete('/:id', verifyToken, deleteTeacherHandler);

export default router;