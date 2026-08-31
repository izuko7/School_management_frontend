import dayjs from "dayjs";
import db from "../db/database.js";
import Absence from "../models/absenceModel.js";

// Créer une nouvelle absence
const createAbsence = async (student_id, date, status, justifie, motif) => {

    if (!dayjs(date, "DD/MM/YYYY", true).isValid()) {
        throw new Error(`Date invalide : ${date}`);
    }

    // Vérifier si l'utilisateur existe
    const studentStmt = await db.prepare(`SELECT * FROM students WHERE id = ?`);
    const student = await studentStmt.get([student_id]);
    if (!student) {
        throw new Error(`L'étudiant avec identifiant ${student_id} introuvable`);
    }

    const absence = new Absence(student_id, date, status, justifie, motif);
    const insertAbsence = await db.prepare(`
            INSERT INTO absences(student_id, date, status, justifie, motif)
            VALUES(?, ?, ?, ?, ?)
        `);
    const result = await insertAbsence.run([absence.student_id, absence.date, absence.status, absence.justifie, absence.motif]);

    return result;
};

// Afficher toute les absences
const getAllAbsences = async () => {
    const stmt = await db.prepare(`SELECT * FROM absences`);
    return await stmt.all();
};

// Afficher une absence grâce à son identifiant
const getAbsenceById = async (id) => {
    const stmt = await db.prepare(`SELECT * FROM absences WHERE id = ?`);
    return await stmt.get([id]);
};

// Modifier une absence
const updateAbsence = async (id, data) => {
    const currentAbsence = await getAbsenceById(id);

    const student_id = data.student_id ?? currentAbsence.student_id;
    const date = data.date ?? currentAbsence.date;

    if (!dayjs(date, "DD/MM/YYYY", true).isValid()) {
        throw new Error(`Date invalide : ${date}`);
    }

    const status = data.status ?? currentAbsence.status;
    const justifie = data.justifie ?? currentAbsence.justifie;
    const motif = data.motif ?? currentAbsence.motif;

    const stmt = await db.prepare(`
            UPDATE absences SET student_id = ?, date = ?, 
            status = ?, justifie = ?, motif = ?
            WHERE id = ?
        `);
    const result = await stmt.run([student_id, date, status, justifie, motif, id]);
    return result;
};

// Supprimer une absence
const deleteAbsence = async (id) => {
    const current = await getAbsenceById(id);
    if (!current) {
        throw new Error(`Absence avec l'id ${id} introuvable`);
    }
    const stmt = await db.prepare(`DELETE FROM absences WHERE id = ?`);
    const result = await stmt.run([id]);
    return result;
};

export { createAbsence, getAllAbsences, getAbsenceById, updateAbsence, deleteAbsence };