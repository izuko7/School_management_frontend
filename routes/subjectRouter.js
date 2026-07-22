import express from 'express';
import { getSubject, getSubjects, createSubjectHandler, updateSubjectHandler, deleteSubjectHandler } from '../controllers/subjectController.js';

// conteneur de router 
const router = express.Router();

// GET 
router.get('/', getSubjects);

// GET avec un id 
router.get('/:id', getSubject);

// POST 
router.post('/', createSubjectHandler);

// PUT 
router.put('/:id', updateSubjectHandler);

// DELETE 
router.delete('/:id', deleteSubjectHandler);


export default router;