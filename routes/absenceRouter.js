import express from 'express';
import { getAbsence, getAbsences, createAbsenceHandler, updateAbsenceHandler, deleteAbsenceHandler } from '../controllers/absenceController.js';
import { verifyToken } from '../middleware/authVerify.js';
import { checkRole } from '../middleware/roleCheck.js';


const router = express.Router();

// GET 
router.get('/', verifyToken, getAbsences);

// GET with id 
router.get('/:id', verifyToken, getAbsence);

// POST 
router.post('/', verifyToken, checkRole('prof'), createAbsenceHandler);

// PUT 
router.put('/:id', verifyToken, checkRole('admin'), updateAbsenceHandler);

// DELETE 
router.delete('/:id', verifyToken, deleteAbsenceHandler);


export default router;