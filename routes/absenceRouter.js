import express from 'express';
import { getAbsence, getAbsences, createAbsenceHandler, updateAbsenceHandler, deleteAbsenceHandler } from '../controllers/absenceController.js';


const router = express.Router();

// GET 
router.get('/',getAbsences);

// GET with id 
router.get('/:id', getAbsence);

// POST 
router.post('/', createAbsenceHandler);

// PUT 
router.put('/:id', updateAbsenceHandler);

// DELETE 
router.delete('/:id', deleteAbsenceHandler);


export default router;