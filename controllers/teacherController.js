import { getAllTeachers, getTeacherById, createTeacher, updateTeacher, deleteTeacher } from "../services/teacherService.js";
import { creerActivite } from "../services/activiteService.js";
import { logInfo, logSuccess, logWarn, logError } from "../utils/logger.js";

// Contrôller teacher

// avoir tout les enseignants
const getTeachers = async (req, res) => {
    try {
        const teachers = await getAllTeachers();
        res.json(teachers);
    } catch (error) {
        logError(`Erreur lors de la récupération des enseignants : ${error.message}`);
        res.status(500).json({ error: `Une erreur est survenue` });
    }
};

// avoir un seul enseignant
const getTeacher = async (req, res) => {
    try {
        const id = req.params.id;
        const teacher = await getTeacherById(id);

        if (!teacher) {
            logWarn(`Enseignant introuvable`);
            return res.status(404).json({ error: `Enseignant avec id :${id} introuvable` });
        }

        res.json(teacher);

    } catch (error) {
        logError(`Erreur lors de la récupération de l'enseignant`);
        res.status(500).json({ error: 'Une erreur est survenue' });
    }
};

// créer un enseignant
const createTeacherHandler = async (req, res) => {
    try {
        const { matricule, nom, prenom, user_id } = req.body;
        const result = await createTeacher(matricule, nom, prenom, user_id);
        logSuccess(`Enseignant créé : ${nom}, ${prenom}, ${matricule}`);

        await creerActivite(`${nom} ${prenom} a été inscrit(e)`, "inscription");

        res.status(201).json({ message: `Enseignant créer avec succès`, result });
    } catch (error) {
        logWarn(`Echec de création d'un enseignant : ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

// modifier un enseignant
const updateTeacherHandler = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = await updateTeacher(id, data);
        logSuccess(`Enseignant modifié`);
        res.json({ message: "Étudiant modifié avec succès", result });
    } catch (error) {
        logWarn(`Échec de modification de l'enseignant (id: ${req.params.id}) : ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

// supprimer un enseignant
const deleteTeacherHandler = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await deleteTeacher(id);
        logSuccess(`Enseignant supprimé`);
        res.json({ message: `Enseignant supprimé avec succès`, result });
    } catch (error) {
        logWarn(`Échec de suppression de l'enseignant (id: ${req.params.id}) : ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

export { getTeachers, getTeacher, createTeacherHandler, updateTeacherHandler, deleteTeacherHandler };