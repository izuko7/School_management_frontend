import express from 'express';
import { getClasses, getclasse, createClasseHandler, updateClasseHandler, deleteClasseHandler } from '../controllers/classesController.js';


const router = express.Router();

// GET 
router.get('/', getClasses);


// GET avec id 
router.get('/:id', getclasse);

// POST 
router.post('/', createClasseHandler);


// PUT 
router.put('/:id', updateClasseHandler);

// DELETE 
router.delete('/:id', deleteClasseHandler);


export default router;