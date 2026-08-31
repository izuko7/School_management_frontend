import db from "../db/database.js";
import Student from "../models/studentModel.js";
import { dayjs } from "../config/date.js";

// Créer un étudiant
const createStudent = async (matricule, nom, prenom, date_naissance, classe_id, user_id) => {

    if (!dayjs(date_naissance, "DD/MM/YYYY", true).isValid()) {
        throw new Error(`Date de naissance invalide : ${date_naissance}`);
    }

    // Vérifier si l'utilisateur avec le rôle étudiant existe
    const userStmt = await db.prepare(`SELECT * FROM users WHERE id = ?`);
    const user = await userStmt.get([user_id]);
    if (!user) {
        throw new Error(`Identifiant utilisateeur ${user_id} introuvable`);
    }
    if (user.role !== 'etudiant') {
        throw new Error(`L'utilisateur ${user_id} n'a pas le rôle 'etudiant'`);
    }

    // Vérifier si cet utilisateur n'est pas déjà lié à un étudiant
    const dejaLieStmt = await db.prepare(`SELECT * FROM students WHERE user_id = ?`);
    const dejaLie = await dejaLieStmt.get([user_id]);
    if (dejaLie) {
        throw new Error(`Ce compte est lié à l'étudiant`);
    }

    const student = new Student(matricule, nom, prenom, date_naissance, classe_id, user_id);
    const insertStmt = await db.prepare(`
            INSERT OR IGNORE INTO students(matricule, nom, prenom, date_naissance, classe_id, user_id)
            VALUES(?, ?, ?, ?, ?, ?)
        `);
    const result = await insertStmt.run([
        student.matricule, student.nom, student.prenom,
        student.date_naissance, student.classe_id, student.user_id
    ]);

    if (result.changes === 0) {
        throw new Error(`Matricule ${matricule} déjà existant.`);
    }
    return result;
};

// Afficher tous les étudiants
const getAllStudents = async () => {
    const stmt = await db.prepare(`SELECT * FROM students`);
    return await stmt.all();
};

// Afficher les étudiants récents
const getStudentsRecents = async (limite = 5) => {
    const stmt = await db.prepare(`
        SELECT * FROM students
        ORDER BY id DESC
        LIMIT ?
    `);
    return await stmt.all([limite]);
};

// Afficher un étudiant grâce a son id
const getStudentById = async (id) => {
    const stmt = await db.prepare(`SELECT * FROM students WHERE id = ?`);
    return await stmt.get([id]);
};

// Afficher un étudiant grâce à son matricule
const getStudentByMatricule = async (matricule) => {
    const stmt = await db.prepare(`SELECT * FROM students WHERE matricule = ?`);
    return await stmt.get([matricule]);
};

// Modifier un étudiant
const updateStudent = async (id, data) => {
    const currentStudent = await getStudentById(id);

    const nom = data.nom ?? currentStudent.nom;
    const prenom = data.prenom ?? currentStudent.prenom;
    const date_naissance = data.date_naissance ?? currentStudent.date_naissance;
    if (!dayjs(date_naissance, "DD/MM/YYYY", true).isValid()) {
        throw new Error(`Date de naissance invalide : ${date_naissance}`);
    }

    const stmt = await db.prepare(`
            UPDATE students SET nom = ?, prenom = ?, date_naissance = ?
            WHERE id = ?
        `);
    const result = await stmt.run([nom, prenom, date_naissance, id]);
    return result;
};

// Supprimer un étudiant
const deleteStudent = async (id) => {
    const current = await getStudentById(id);
    if (!current) {
        throw new Error(`Etudiant avec l'id ${id} introuvable`);
    }
    const deleteStudentStmt = await db.prepare(`DELETE FROM students WHERE id = ?`);
    const result = await deleteStudentStmt.run([id]);

    const deleteUserStmt = await db.prepare(`DELETE FROM users WHERE id = ?`);
    await deleteUserStmt.run([current.user_id]);

    return result;
};

export { createStudent, getAllStudents, getStudentById, getStudentsRecents, getStudentByMatricule, updateStudent, deleteStudent };