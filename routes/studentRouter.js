import express from 'express';
import { getStudents, getStudent, getStudentsRecentHandler, createStudentHandler, updateStudentHandler, deleteStudentHandler } from '../controllers/studentController.js';
import { verifyToken } from '../middleware/authVerify.js';


// Conteneur de route 
const router = express.Router();

// méthode GET 
router.get('/', verifyToken, getStudents);

router.get('/recents', verifyToken, getStudentsRecentHandler);

// méthode GET avec id
router.get('/:id', verifyToken, getStudent);

// méthode POST 
router.post('/', verifyToken, createStudentHandler);

// méthode put 
router.put('/:id', verifyToken, updateStudentHandler);

// méthode delete 
router.delete('/:id', verifyToken, deleteStudentHandler);

export default router;