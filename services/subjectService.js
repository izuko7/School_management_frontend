import db from "../db/database.js";
import Subject from "../models/subjectModel.js";

// Créer une matière
const createSubject = async (nom, classe_id, teacher_id) => {

    // Vérifier si le prof existe
    const teacherStmt = await db.prepare(`SELECT * FROM teachers WHERE id = ?`);
    const teacher = await teacherStmt.get([teacher_id]);
    if (!teacher) {
        throw new Error(`Professeur avec le matricule ${teacher_id} est introuvable`);
    }

    const classeStmt = await db.prepare(`SELECT * FROM classes WHERE id = ?`);
    const classe = await classeStmt.get([classe_id]);
    if (!classe) {
        throw new Error(`Classe avec id : ${classe_id} introuvable`);
    }

    const subject = new Subject(nom, classe_id, teacher_id);
    const insertStmt = await db.prepare(`
            INSERT INTO subjects(nom, classe_id, teacher_id)
            VALUES (?, ?, ?)
        `);
    const result = await insertStmt.run([subject.nom, subject.classe_id, subject.teacher_id]);
    return result;
};

// Afficher toutes les matières
const getAllSubject = async () => {
    const stmt = await db.prepare(`SELECT * FROM subjects`);
    return await stmt.all();
};

// Chercher une matière grâce a l'id
const getSubjectById = async (id) => {
    const stmt = await db.prepare(`SELECT * FROM subjects WHERE id = ?`);
    return await stmt.get([id]);
};

// Modifier une matière
const updateSubject = async (id, data) => {
    const currentSubject = await getSubjectById(id);
    if (!currentSubject) throw new Error(`Matière introuvable`);

    const newNom = data.nom ?? currentSubject.nom;

    const stmt = await db.prepare(`
            UPDATE subjects SET nom = ?
            WHERE id = ?
        `);
    const result = await stmt.run([newNom, id]);
    return result;
};

// Supprimer une matière
const deleteSubject = async (id) => {
    const current = await getSubjectById(id);
    if (!current) throw new Error(`Matière avec l'id ${id} introuvable.`);

    const stmt = await db.prepare(`DELETE FROM subjects WHERE id = ?`);
    const result = await stmt.run([id]);
    return result;
};

export { createSubject, getAllSubject, getSubjectById, updateSubject, deleteSubject };