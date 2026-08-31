import db from "../db/database.js";
import Subject from "../models/subjectModel.js";

// Créer une matière
const createSubject = async (nom, classe_id, teacher_id) => {

    // Vérifier si le prof existe
    const teacher = (await db.prepare(`SELECT * FROM teachers WHERE id = ?`)).get(teacher_id);
    if (!teacher) {
        throw new Error(`Professeur avec le matricule ${teacher_id} est introuvable`);
    }

    const classe = (await db.prepare(`SELECT * FROM classes WHERE id = ?`)).get(classe_id);
    if (!classe) {
        throw new Error(`Classe avec id : ${classe_id} introuvable`);
    }

    const subject = new Subject(nom, classe_id, teacher_id);
    const result = (await db.prepare(`
            INSERT INTO subjects(nom, classe_id, teacher_id)
            VALUES (?, ?, ?)
        `)).run(subject.nom, subject.classe_id, subject.teacher_id);
    return result;
};

// Afficher toutes les matières
const getAllSubject = async () => {
    const result = await db.prepare(`SELECT * FROM subjects`);
    return result.all();
};

// Chercher une matière grâce a l'id
const getSubjectById = async (id) => {
    const subject = (await db.prepare(`SELECT * FROM subjects WHERE id = ?`)).get(id);
    return subject;
};

// Modifier une matière
const updateSubject = async (id, data) => {
    const currentSubject = await getSubjectById(id);
    if (!currentSubject) throw new Error(`Matière introuvable`);

    const newNom = data.nom ?? currentSubject.nom;

    const result = (await db.prepare(`
            UPDATE subjects SET nom = ?
            WHERE id = ?
        `)).run(newNom, id);
    return result;
};

// Supprimer une matière
const deleteSubject = async (id) => {
    const current = await getSubjectById(id);
    if (!current) throw new Error(`Matière avec l'id ${id} introuvable.`);

    const result = (await db.prepare(`DELETE FROM subjects WHERE id = ?`)).run(id);
    return result;
};

export { createSubject, getAllSubject, getSubjectById, updateSubject, deleteSubject };