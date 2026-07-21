import express from 'express';
import { getStudents, getStudent } from '../controllers/studentController.js';


// Conteneur de route 
const router = express.Router();

// méthode GET 
router.get('/', getStudents);

router.get('/:id', getStudent)


export default router;