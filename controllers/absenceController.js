import { getAbsenceById, getAllAbsences, createAbsence, updateAbsence, deleteAbsence } from "../services/absenceService.js";
import { getStudentById } from "../services/studentService.js";
import { logSuccess, logWarn, logError } from '../utils/logger.js';

// Contrôlleurs absences

// avoir toute les absences
const getAbsences = async (req, res) => {
    try {
        const absences = await getAllAbsences();
        res.json(absences);
    } catch (error) {
        logError(`Erreur lors de la récupération des absences : ${error.message}`);
        res.status(500).json({ error: 'une erreur est survenue' });
    }
};

// avoir une absence grâce à son id
const getAbsence = async (req, res) => {
    try {
        const id = req.params.id;
        const absence = await getAbsenceById(id);

        if (!absence) {
            logWarn(`Absence introuvable (id: ${id})`);
            return res.status(404).json({ error: `Absence avec id ${id} introuvable` });
        }

        const student = await getStudentById(absence.student_id);

        if (!student) {
            logWarn(`Étudiant introuvable pour l'absence (id: ${id}, student_id: ${absence.student_id})`);
            return res.status(500).json({ error: 'une erreur est survenue' });
        }

        if (req.user.role === 'etudiant' && student.user_id !== req.user.id) {
            logWarn(`Accès refusé : l'utilisateur (id: ${req.user.id}) a tenté de consulter l'absence (id: ${id}) d'un autre étudiant`);
            return res.status(403).json({ error: 'Vous ne pouvez consulter que votre propre profil' });
        }

        res.json(absence);
    } catch (error) {
        logError(`Erreur lors de la récupération de l'absence (id: ${req.params.id}) : ${error.message}`);
        res.status(500).json({ error: 'une erreur est survenue' });
    }
};

// créer d'une absence
const createAbsenceHandler = async (req, res) => {
    try {
        const { student_id, date, status, justifie, motif } = req.body;
        const result = await createAbsence(student_id, date, status, justifie, motif);
        logSuccess(`Absence créée (student_id: ${student_id}, date: ${date}, status: ${status})`);
        res.status(201).json({ message: `Absence créer avec succès` });
    } catch (error) {
        logWarn(`Échec de création d'une absence : ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

// modifier une absence
const updateAbsenceHandler = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = await updateAbsence(id, data);
        logSuccess(`Absence modifiée (id: ${id})`);
        res.json({ message: `Absence modifiée avec succès`, result });
    } catch (error) {
        logWarn(`Échec de modification de l'absence (id: ${req.params.id}) : ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

// supprimer une absence
const deleteAbsenceHandler = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await deleteAbsence(id);
        logSuccess(`Absence supprimée (id: ${id})`);
        res.json({ message: 'Absence supprimée avec succès', result });
    } catch (error) {
        logWarn(`Échec de suppression de l'absence (id: ${req.params.id}) : ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

export { getAbsence, getAbsences, createAbsenceHandler, updateAbsenceHandler, deleteAbsenceHandler };