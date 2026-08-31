import { getAllGrades, getGradeById, createGrade, updateGrade, deleteGrade } from "../services/gradeService.js";
import { getStudentById } from "../services/studentService.js";
import { logSuccess, logWarn, logError } from '../utils/logger.js';

// Contrôleurs notes

// avoir toutes les notes
const getGrades = async (req, res) => {
    try {
        const grades = await getAllGrades();
        res.json(grades);
    } catch (error) {
        logError(`Erreur lors de la récupération des notes : ${error.message}`);
        res.status(500).json({ error: `Une erreur est survenue` });
    }
};

// avoir une note grâce à son id
const getGrade = async (req, res) => {
    try {
        const id = req.params.id;
        const grade = await getGradeById(id);

        if (!grade) {
            logWarn(`Note introuvable (id: ${id})`);
            return res.status(404).json({ error: `Note avec id ${id} introuvable` });
        }

        const student = await getStudentById(grade.student_id);

        if (!student) {
            logWarn(`Étudiant introuvable pour la note (id: ${id}, student_id: ${grade.student_id})`);
            return res.status(500).json({ error: `Une erreur est survenue` });
        }

        if (req.user.role === 'etudiant' && student.user_id !== req.user.id) {
            logWarn(`Accès refusé : l'utilisateur (id: ${req.user.id}) a tenté de consulter la note (id: ${id}) d'un autre étudiant`);
            return res.status(403).json({ error: 'Vous ne pouvez consulter que votre propre profil' });
        }

        res.json(grade);
    } catch (error) {
        logError(`Erreur lors de la récupération de la note (id: ${req.params.id}) : ${error.message}`);
        res.status(500).json({ error: `Une erreur est survenue` });
    }
};

// créer une note
const createGradeHandler = async (req, res) => {
    try {
        const { student_id, subject_id, note, date, type } = req.body;
        const result = await createGrade(student_id, subject_id, note, date, type);
        logSuccess(`Note créée (student_id: ${student_id}, subject_id: ${subject_id}, note: ${note})`);
        res.status(201).json({ message: `Note créée avec succès` });
    } catch (error) {
        logWarn(`Échec de création d'une note : ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

// modifier une note
const updateGradeHandler = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = await updateGrade(id, data);
        logSuccess(`Note modifiée (id: ${id})`);
        res.json({ message: 'Note modifiée avec succès' });
    } catch (error) {
        logWarn(`Échec de modification de la note (id: ${req.params.id}) : ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

// supprimer une note
const deleteGradeHandler = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await deleteGrade(id);
        logSuccess(`Note supprimée (id: ${id})`);
        res.json({ message: `Note supprimée avec succès` });
    } catch (error) {
        logWarn(`Échec de suppression de la note (id: ${req.params.id}) : ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

export { getGrades, getGrade, createGradeHandler, updateGradeHandler, deleteGradeHandler };