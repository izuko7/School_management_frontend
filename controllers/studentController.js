import { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent } from "../services/studentService.js";
import { creerActivite } from "../services/activiteService.js";
import { logSuccess, logWarn, logError } from "../utils/logger.js";

// Contrôller étudiant 

// avoir tout les étuidiants 
const getStudents = (req, res) => {
    try {
        const students = (getAllStudents());
        res.json(students);
    } catch (error) {
        logError(`Erreur lors de la récupération des étudiants : ${error.message}`);
        res.status(500).json({ error: "Une erreur est survenue" });
    }
};

// avoir un seul étudiant 
const getStudent = (req, res) =>  {
    try {
        const id = req.params.id;
        const student = getStudentById(id);
        
        if(!student){
            logWarn(`Étudiant introuvable`);
           return res.status(404).json({ error: `Etuidant avec id : ${id}  introuvable `});
        }

        if(req.user.role === 'etudiant' && student.user_id !== req.user.id){
            logWarn(`Accès refusé : l'utilisateur (id: ${req.user.id}) a tenté de consulter le profil de l'étudiant (id: ${id})`);
            return res.status(403).json({error: 'Vous ne pouvez consulter que votre propre profil'});
        }

        res.json(student);

    } catch (error) {
        logError(`Erreur lors de la récupération de l'étudiant (id: ${req.params.id}) : ${error.message}`);
        res.status(500).json({ error: "Une erreur est survenue"});
    }
};


// créer un étudiant 
const createStudentHandler = (req, res) => {

    try {
        const { matricule, nom, prenom, date_naissance, classe_id, user_id } = req.body;
        const result = createStudent(matricule, nom, prenom, date_naissance, classe_id, user_id);
        logSuccess(`Étudiant créé : ${nom} ${prenom} (matricule: ${matricule})`);

        creerActivite(`${nom} ${prenom} a été inscrit(e)`, "inscription");

        res.status(201).json({ message: "Élève créé avec succès", result });

    } catch (error) {
        logWarn(`Échec de création d'un étudiant : ${error.message}`);
        res.status(400).json({message: error.message});
    }
};

// mettre à jour un étudiant 
const updateStudentHandler =(req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = updateStudent(id, data);
        logSuccess(`Étudiant modifié`);
        res.json({ message: "Étudiant modifié avec succès", result });
    } catch (error) {
        logWarn(`Échec de modification de l'étudiant (id: ${req.params.id}) : ${error.message}`);
        res.status(400).json({error: error.message});
    }
};

// supprimer un étudiant 
const deleteStudentHandler = (req, res) => {
   try {
     const id = req.params.id;
     const result = deleteStudent(id);
     logSuccess(`Étudiant supprimé (id: ${id})`);
     res.json({message: `Étudiant supprimé avec succès`, result})
   } catch (error) {
    logWarn(`Échec de suppression de l'étudiant (id: ${req.params.id}) : ${error.message}`);
    res.status(400).json({error: error.message});
   }
};

export { getStudents, getStudent, createStudentHandler, updateStudentHandler, deleteStudentHandler };