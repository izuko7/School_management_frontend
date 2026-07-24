import express from 'express';
import { getSubject, getSubjects, createSubjectHandler, updateSubjectHandler, deleteSubjectHandler } from '../controllers/subjectController.js';
import { verifyToken } from '../middleware/authVerify.js';

// conteneur de router 
const router = express.Router();

// GET 
router.get('/', verifyToken, getSubjects);

// GET avec un id 
router.get('/:id', verifyToken, getSubject);

// POST 
router.post('/', verifyToken, createSubjectHandler);

// PUT 
router.put('/:id', verifyToken, updateSubjectHandler);

// DELETE 
router.delete('/:id', verifyToken, deleteSubjectHandler);


export default router;