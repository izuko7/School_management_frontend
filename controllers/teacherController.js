import { getAllTeachers, getTeacherById, createTeacher, updateTeacher, deleteTeacher } from "../services/teacherService.js";

// Contrôller Student 

// avoir tout les enseignants 
const getTeachers = (req, res) => {
    try {
        const teachers = (getAllTeachers());
        res.json(teachers)
    } catch (error) {
        res.status(500).json({error: `Une erreur est survenue`})
    }
};

// avoir un seul enseignant 
const getTeacher = (req, res) => {
    try {
        const id = req.params.id;
        const teacher = getTeacherById(id);

        if(!teacher){
            return res.status(404).json({error: `Enseinant avec id :${id} introuvable`})
        }

        res.json(teacher);

    } catch (error) {
        res.status(500).json({error: 'Une erreur est survenue'});
    }
};


// créer un enseignant 
const createTeacherHandler = (req, res)=> {
    try {
        const { matricule, nom, prenom, user_id } = req.body;
        const result = createTeacher(matricule, nom, prenom, user_id);
        res.status(201).json({ message: `Enseignant créer avec succès`, result});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

// modifier un enseignant 
const updateTeacherHandler = (req, res)=> {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = updateTeacher(id, data);
        res.json({ message: "Étudiant modifié avec succès", result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// supprimer un enseignant 
const deleteTeacherHandler = (req, res) => {
    try {
        const id = req.params.id;
        const result = deleteTeacher(id);
        res.json({message : `Enseignant supprimé avec succès`, result});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};


export { getTeachers, getTeacher, createTeacherHandler, updateTeacherHandler, deleteTeacherHandler }