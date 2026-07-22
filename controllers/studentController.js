import { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent } from "../services/studentService.js";

// Contrôller étudiant 

// avoir tout les étuidiants 
const getStudents = (req, res) => {
    try {
        const students = (getAllStudents());
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue" });
    }
};

// avoir un seul étudiant 
const getStudent = (req, res) =>  {
    try {
        const id = req.params.id;
        const student = getStudentById(id);
        
        if(!student){
           return res.status(404).json({ error: `Etuidant avec id : ${id}  introuvable `});
        }

        res.json(student);

    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue"});
    }
};


// créer un étudiant 
const createStudentHandler = (req, res) => {

    try {
        const { matricule, nom, prenom, date_naissance, classe_id, user_id } = req.body;
        const result = createStudent(matricule, nom, prenom, date_naissance, classe_id, user_id);
        res.status(201).json({ message: "Élève créé avec succès", result });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

// mettre à jour un étudiant 
const updateStudentHandler =(req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = updateStudent(id, data);
        res.json({ message: "Étudiant modifié avec succès", result });
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

// supprimer un étudiant 
const deleteStudentHandler = (req, res) => {
   try {
     const id = req.params.id;
     const result = deleteStudent(id);
     res.json({message: `Étudiant supprimé avec succès`, result})
   } catch (error) {
    res.status(400).json({error: error.message});
   };
}

export { getStudents, getStudent, createStudentHandler, updateStudentHandler, deleteStudentHandler };