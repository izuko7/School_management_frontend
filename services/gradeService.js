import db from "../db/database.js";
import Grade from "../models/gradeModel.js";
import { dayjs } from "../config/date.js";

// Créer une nouvelle note
const createGrade = async (student_id, subject_id, note, date, type) => {

    if (!dayjs(date, "DD/MM/YYYY", true).isValid()) {
        throw new Error(`Date invalide : ${date}`);
    }

    // Vérifier si l'étudiant existe
    const studentStmt = await db.prepare(`SELECT * FROM students WHERE id = ?`);
    const student = await studentStmt.get([student_id]);
    if (!student) {
        throw new Error(`L'etuiant avec l'identifiant ${student_id} est introuvable`);
    }

    // Vérifier si la matière existe
    const subjectStmt = await db.prepare(`SELECT * FROM subjects WHERE id = ?`);
    const subject = await subjectStmt.get([subject_id]);
    if (!subject) {
        throw new Error(`La matière n'existe pas identifiant ${subject_id}`);
    }

    // Création de la note
    const grade = new Grade(student_id, subject_id, note, date, type);
    const insertGrade = await db.prepare(`
            INSERT INTO grades(student_id, subject_id, note, date, type) 
            VALUES(?, ?, ?, ?, ?)
        `);
    const result = await insertGrade.run([
        grade.student_id, grade.subject_id, grade.note,
        grade.date, grade.type
    ]);

    // if(result.changes === 0){
    //     throw new Error(`Note ${note} déjà existante.`);
    // }
    return result;
};

// Afficher toute les notes
const getAllGrades = async () => {
    const stmt = await db.prepare(`SELECT * FROM grades`);
    return await stmt.all();
};

// Rechercher une note par ??? je ne sais pas ID
const getGradeById = async (id) => {
    const stmt = await db.prepare(`SELECT * FROM grades WHERE id = ?`);
    return await stmt.get([id]);
};

// Modifier une note
const updateGrade = async (id, data) => {
    const currentGrade = await getGradeById(id);

    const note = data.note ?? currentGrade.note;
    const date = data.date ?? currentGrade.date;

    if (!dayjs(date, "DD/MM/YYYY", true).isValid()) {
        throw new Error(`Date invalide : ${date}`);
    }

    const stmt = await db.prepare(`
            UPDATE grades SET note = ?, date = ?
            WHERE id = ?
        `);
    const result = await stmt.run([note, date, id]);
    return result;
};

// Supprimer un étudiant
const deleteGrade = async (id) => {
    const current = await getGradeById(id);
    if (!current) {
        throw new Error(`Note introuvable`);
    }
    const stmt = await db.prepare(`DELETE FROM grades WHERE id = ?`);
    const result = await stmt.run([id]);
    return result;
};

export { createGrade, getAllGrades, getGradeById, updateGrade, deleteGrade };