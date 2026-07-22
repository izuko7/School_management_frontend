import { getAllSubject, getSubjectById, createSubject, updateSubject, deleteSubject } from "../services/subjectService.js";

// Contrôlleur matière

// avoir toutes les matières
const getSubjects = (req, res) => {
    try {
        const subjects = (getAllSubject());
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ error : `Une erreur est survenue`})
    }
};


// avoir une seule matière grâce à son id
const getSubject = (req, res) => {
    try {
        const id = req.params.id;
        const subject = getSubjectById(id);

        if(!subject){
            return res.status(404).json({ error: `Matière avec id ${id} introuvable` });
        }

        res.json(subject);
    } catch (error) {
        res.status(500).json({ error: `Une erreur est survenue` });
    }
};


// créer une matière 
const createSubjectHandler = (req, res) => {
    try {
        const { nom, classe_id, teacher_id } = req.body;
        const result = createSubject(nom, classe_id, teacher_id);
        res.status(201).json({ message: `Matière créer avec succès`, result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// modifier une matière
const updateSubjectHandler = (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = updateSubject(id, data);
        res.json({message : `Matière modifié avec succès`, result});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// supprimer une matière
const deleteSubjectHandler = (req, res) => {
    try {
        const id = req.params.id;
        const result = deleteSubject(id);
        res.json({message: `Matière supprimeé avec succès`});
    } catch (error) {
        res.status(400).json({message : error.message});
    }
};


export { getSubject, getSubjects, createSubjectHandler, updateSubjectHandler, deleteSubjectHandler }