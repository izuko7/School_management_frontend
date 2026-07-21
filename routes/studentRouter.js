import express from 'express';
import { getStudents, getStudent, createStudentHandler } from '../controllers/studentController.js';


// Conteneur de route 
const router = express.Router();

// méthode GET 
router.get('/', getStudents);

// méthode GET avec id
router.get('/:id', getStudent);

// méthode POST 
router.post('/', createStudentHandler);


export default router;