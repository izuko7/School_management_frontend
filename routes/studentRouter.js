import express from 'express';
import { getAllStudents  } from '../services/studentService.js';


// Conteneur de route 
const router = express.Router();

// méthode GET 
router.get('/', (req, res) => {
    res.json(getAllStudents());
})


export default router;