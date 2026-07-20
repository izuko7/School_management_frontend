import db from "../db/database.js";
import Grade from "../models/gradeModel.js";


// Créer une nouvelle note 
const createGrade = (student_id, subject_id, note, date, type) => {

    // Vérifier si l'étudiant existe 
    const student = db.prepare(`SELECT * FROM students WHERE id = ?`).get(student_id);
    if(!student){
        throw new Error(`L'etuiant avec l'identifiant ${student_id} est introuvable`);
    }

    // Vérifier si la matière existe 
    const subject = db.prepare(`SELECT * FROM subjects WHERE id = ?`).get(subject_id);
    if(!subject){
        throw new Error(`La matière n'existe pas identifiant ${subject_id}`);
    }

    // Création de la note 
    const grade = new Grade(student_id, subject_id, note, date, type);
    const insertGrade = db.prepare(`
            INSERT INTO grades(student_id, subject_id, note, date, type) 
            VALUES(?, ?, ?, ?, ?)
        `);
    const result = insertGrade.run(
        grade.student_id, grade.subject_id, grade.note, 
        grade.date, grade.type
    );

    // if(result.changes === 0){
    //     throw new Error(`Note ${note} déjà existante.`);
    // }
    return result;
};


// Afficher toute les notes 
const getAllGrades = ()=> {
    return db.prepare(`SELECT * FROM grades`).all();
}

// Rechercher une note par ??? je ne sais pas ID
const getGradeById = (id)=>{
    const student = db.prepare(`SELECT * FROM grades WHERE id = ?`).get(id);
    return student
}

// Modifier une note 
const updateGrade = (id, data) => {
    const currentGrade = getGradeById(id);

    const note = data.note ?? currentGrade.note;
    const date = data.date ?? currentGrade.date;

    const result = db.prepare(`
            UPDATE grades SET note = ?, date = ?
            WHERE id = ?
        `).run(note, date, id);
    return result;
};

// Supprimer un étudiant 
const deleteGrade = (id) => {
    const current = getGradeById(id);
    if(!current){
        throw new Error(`Note introuvable`);
    }
    const result = db.prepare(`DELETE FROM grades WHERE id = ?`).run(id);
    return result;
}

export { createGrade, getAllGrades, getGradeById, updateGrade, deleteGrade }