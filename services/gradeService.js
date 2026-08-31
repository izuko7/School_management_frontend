import db from "../db/database.js";
import Grade from "../models/gradeModel.js";
import dayjs from "dayjs";


// Créer une nouvelle note
const createGrade = async (student_id, subject_id, note, date, type) => {

    if (!dayjs(date, "DD/MM/YYYY", true).isValid()) {
        throw new Error(`Date invalide : ${date}`);
    }

    // Vérifier si l'étudiant existe
    const student = (await db.prepare(`SELECT * FROM students WHERE id = ?`)).get(student_id);
    if (!student) {
        throw new Error(`L'etuiant avec l'identifiant ${student_id} est introuvable`);
    }

    // Vérifier si la matière existe
    const subject = (await db.prepare(`SELECT * FROM subjects WHERE id = ?`)).get(subject_id);
    if (!subject) {
        throw new Error(`La matière n'existe pas identifiant ${subject_id}`);
    }

    // Création de la note
    const grade = new Grade(student_id, subject_id, note, date, type);
    const insertGrade = await db.prepare(`
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
const getAllGrades = async () => {
    const result = await db.prepare(`SELECT * FROM grades`);
    return result.all();
};

// Rechercher une note par ??? je ne sais pas ID
const getGradeById = async (id) => {
    const student = (await db.prepare(`SELECT * FROM grades WHERE id = ?`)).get(id);
    return student;
};

// Modifier une note
const updateGrade = async (id, data) => {
    const currentGrade = await getGradeById(id);

    const note = data.note ?? currentGrade.note;
    const date = data.date ?? currentGrade.date;

    if (!dayjs(date, "DD/MM/YYYY", true).isValid()) {
        throw new Error(`Date invalide : ${date}`);
    }

    const result = (await db.prepare(`
            UPDATE grades SET note = ?, date = ?
            WHERE id = ?
        `)).run(note, date, id);
    return result;
};

// Supprimer une note
const deleteGrade = async (id) => {
    const current = await getGradeById(id);
    if (!current) {
        throw new Error(`Note introuvable`);
    }
    const result = (await db.prepare(`DELETE FROM grades WHERE id = ?`)).run(id);
    return result;
};

export { createGrade, getAllGrades, getGradeById, updateGrade, deleteGrade };