import db from "../db/database.js";
import Teacher from "../models/teacherModel.js";

// Créer un enseignant
const createTeacher = (matricule, nom, prenom, user_id) => {
    
    // Vérifier que l'utilisateur avec le rôle prof
    const user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(user_id)
    if(!user){
        throw new Error(`Aucun utilisateur trouvé id : ${user_id}`);
    }

    if(user.role !== 'prof'){
        throw new Error(`L'utilisateur avec l'id ${user_id} n'a pas le rôle "proffeseur"`);
    }

    // Vérifier que l'uilisateur n'est pas déjà lié à un professeur
    const dejaLie = db.prepare(`SELECT * FROM teachers WHERE user_id = ?`).get(user_id);
    if(dejaLie){
        throw new Error(`Ce compte est déjà lie à l'enseignant ${dejaLie.nom}`);
    }

    const teacher = new Teacher(matricule, nom, prenom, user_id);
    const insertTeacher = db.prepare(`
            INSERT OR IGNORE INTO teachers(matricule, nom, prenom, user_id)
            VALUES(?, ?, ?, ?)
        `);
    const result = insertTeacher.run(teacher.matricule, teacher.nom, teacher.prenom, teacher.user_id);

    if(result.changes === 0){
        throw new Error(`L'enseignant ${nom} n'a pas pu être créer`);
    }

    return result;
};


// Afficher tout les enseignants
const getAllTeachers = ()=> {
    return db.prepare(`SELECT * FROM  teachers`).all();
};

// Afficher un enseignant grâce à son matricule

const getTeacherByMatricule = (matricule)=> {
    const teacher = db.prepare(`SELECT * FROM teachers WHERE matricule = ?`).get(matricule);
    return teacher;
};

// Modifier un enseignant
const upadateTeacher = (matricule, data) =>{
    const currentTeacher = getTeacherByMatricule(matricule);

    const nom = data.nom ?? currentTeacher.nom;
    const prenom = data.prenom ?? currentTeacher.prenom;

    const result = db.prepare(`
            UPDATE teachers SET nom = ?, prenom = ?
            WHERE id = ?
        `).run(nom, prenom, currentTeacher.id);
    return result;
};

// Supprimer un enseignant
const deleteTeacher = (matricule)=> {
    const current = getTeacherByMatricule(matricule);
    if(!current){
        throw new Error(`Enseignant avec le matricule ${matricule} introuvable`);
    }
    const result = db.prepare(`DELETE FROM teachers WHERE matricule = ?`).run(matricule);
    return result;
};


export{ createTeacher, getAllTeachers, getTeacherByMatricule, upadateTeacher, deleteTeacher}  