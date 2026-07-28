import { getAllSubject, getSubjectById, createSubject, updateSubject, deleteSubject } from "../services/subjectService.js";
import { logSuccess, logWarn, logError } from "../utils/logger.js";

// Contrôlleur matière

// avoir toutes les matières
const getSubjects = (req, res) => {
    try {
        const subjects = (getAllSubject());
        res.json(subjects);
    } catch (error) {
        logError(`Erreur lors de la récupération des matières : ${error.message}`);
        res.status(500).json({ error : `Une erreur est survenue`})
    }
};


// avoir une seule matière grâce à son id
const getSubject = (req, res) => {
    try {
        const id = req.params.id;
        const subject = getSubjectById(id);

        if(!subject){
            logWarn(`Matière introuvable`);
            return res.status(404).json({ error: `Matière avec id ${id} introuvable` });
        }

        res.json(subject);
    } catch (error) {
        logError(`Erreur lors de la récupération de la matière`);
        res.status(500).json({ error: `Une erreur est survenue` });
    }
};


// créer une matière 
const createSubjectHandler = (req, res) => {
    try {
        const { nom, classe_id, teacher_id } = req.body;
        const result = createSubject(nom, classe_id, teacher_id);
        logSuccess(`Matière créée : ${nom}`);
        res.status(201).json({ message: `Matière créer avec succès`, result });
    } catch (error) {
        logWarn(`Échec de création d'une matière : ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

// modifier une matière
const updateSubjectHandler = (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = updateSubject(id, data);
        logSuccess(`Matière modifiée`);
        res.json({message : `Matière modifié avec succès`, result});
    } catch (error) {
        logWarn(`Échec de modification de la matière (id: ${req.params.id}) : ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};


// supprimer une matière
const deleteSubjectHandler = (req, res) => {
    try {
        const id = req.params.id;
        const result = deleteSubject(id);
        logSuccess(`Matière supprimée`);
        res.json({message: `Matière supprimée avec succès`, result});
    } catch (error) {
        logWarn(`Échec de suppression de la matière (id: ${req.params.id}) : ${error.message}`);
        res.status(400).json({message : error.message});
    }
};


export { getSubject, getSubjects, createSubjectHandler, updateSubjectHandler, deleteSubjectHandler }