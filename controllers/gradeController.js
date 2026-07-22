import { getAllGrades, getGradeById, createGrade, updateGrade, deleteGrade } from "../services/gradeService.js";

// Controlleurs notes 

// avoir toutes les notes 
const getGrades = (req,res) => {
    try {
        const grades = (getAllGrades());
        res.json(grades);
    } catch (error) {
        res.status(500).json({error: `Une erreur est survenue`});
    }
};

// avoir une note grâce à son id 
const getGrade = (req,res) => {
    try {
        const id = req.params.id;
        const grade = getGradeById(id);
        
        if(!grade){
            return res.status(404).json({error: `Note avec id ${id} introuvable`});
        }

        res.json(grade);
    } catch (error) {
        res.status(500).json({error: `Une erreur est survenue`});
    }
};

// créer une note 
const createGradeHandler = (req,res) => {
    try {
        const { student_id, subject_id, note, date, type } = req.body;
        const result = createGrade(student_id, subject_id, note, date, type);
        res.status(201).json({message: `Note créer avec succès`});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};


// modifier une note 
const updateGradeHandler = (req,res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = updateGrade(id, data);
        res.json({message:  'Note modifié avec succès'});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

// supprimer une note 
const deleteGradeHandler = (req,res) => {
    try {
        const id = req.params.id;
        const result = deleteGrade(id);
        res.json({message: `Note supprimé avec succès`});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

export { getGrades, getGrade, createGradeHandler, updateGradeHandler, deleteGradeHandler };