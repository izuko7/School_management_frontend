import db from "../db/database.js";
import Student from "../models/studentModel.js";


// Créer un étudiant
const createStudent = (matricule, nom, prenom, date_naissance, classe_id, user_id) => {

    // Vérifier si l'utilisateur avec le rôle étudiant existe
    const user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(user_id);
    if(!user){
        throw new Error(`Identifiant utilisateeur ${user_id} introuvable`);
    }
    if(user.role !== 'etudiant') {
        throw new Error(`L'utilisateur ${user_id} n'a pas le rôle 'etudiant'`);
    }

    // Vérifier si cet utilisateur n'est pas déjà lié à un étudiant
    const dejaLie = db.prepare(`SELECT * FROM students WHERE user_id = ?`).get(user_id);
    if(dejaLie){
        throw new Error(`Ce compte est lié à l'étudiant`);
    }

    const student = new Student(matricule, nom, prenom, date_naissance, classe_id, user_id);
    const insertStudent = db.prepare(`
            INSERT OR IGNORE INTO students(matricule, nom, prenom, date_naissance, classe_id, user_id)
            VALUES(?, ?, ?, ?, ?, ?)
        `);
    const result = insertStudent.run(
        student.matricule, student.nom, student.prenom, 
        student.date_naissance, student.classe_id, student.user_id
    );

    if(result.changes === 0) {
        throw new Error(`Matricule ${matricule} déjà existant.`);
    }
    return result;
};

// Afficher tous les étudiants

const getAllStudents = () => {
    return db.prepare(`SELECT * FROM students`).all();
};

// Afficher un étudiant grâce a son id 

const getStudentById = (id) => {
    const student = db.prepare(`SELECT * FROM students WHERE id = ?`).get(id);
    return student;
};

// Afficher un étudiant grâce à son matricule

const getStudentByMatricule = (matricule)=> {
    const student = db.prepare(`SELECT * FROM students WHERE matricule = ?`).get(matricule);
    return student;
};


// Modifier un étudiant

const updateStudent = (matricule, data) => {
    const currentStudent = getStudentByMatricule(matricule);

    const nom = data.nom ?? currentStudent.nom;
    const prenom = data.prenom ?? currentStudent.prenom;
    const date_naissance = data.date_naissance ?? currentStudent.date_naissance;

    const result = db.prepare(`
            UPDATE students SET nom = ?, prenom = ?, date_naissance = ?
            WHERE id = ?
        `).run(nom, prenom, date_naissance, currentStudent.id);
    return result;
};

// Supprimer un étudiant

const deleteStudent = (matricule) =>{
    const current = getStudentByMatricule(matricule);
    if(!current){
        throw new Error(`Etudiant avec le matricule ${matricule} introuvable`);
    }
    const result = db.prepare(`DELETE FROM students WHERE matricule = ?`).run(matricule);
    return result;
};

export { createStudent, getAllStudents, getStudentById, getStudentByMatricule, updateStudent, deleteStudent }