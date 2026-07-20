import express from 'express';
import { getAllStudents  } from '../services/studentService.js';


// Conteneur de route 
const router = express.Router();

// méthode GET 
router.get('/', (req, res) => {
    console.log(`Succès`)
    res.json(getAllStudents());
})