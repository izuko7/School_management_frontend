import db from "../db/database.js";
import Teacher from "../models/teacherModel.js";

// Créer un enseignant
const createTeacher = async (matricule, nom, prenom, user_id) => {

    // Vérifier que l'utilisateur avec le rôle prof
    const userStmt = await db.prepare(`SELECT * FROM users WHERE id = ?`);
    const user = await userStmt.get([user_id]);
    if (!user) {
        throw new Error(`Aucun utilisateur trouvé id : ${user_id}`);
    }

    if (user.role !== 'prof') {
        throw new Error(`L'utilisateur avec l'id ${user_id} n'a pas le rôle "proffeseur"`);
    }

    // Vérifier que l'uilisateur n'est pas déjà lié à un professeur
    const dejaLieStmt = await db.prepare(`SELECT * FROM teachers WHERE user_id = ?`);
    const dejaLie = await dejaLieStmt.get([user_id]);
    if (dejaLie) {
        throw new Error(`Ce compte est déjà lie à l'enseignant ${dejaLie.nom}`);
    }

    const teacher = new Teacher(matricule, nom, prenom, user_id);
    const insertTeacher = await db.prepare(`
            INSERT OR IGNORE INTO teachers (matricule, nom, prenom, user_id)
            VALUES(?, ?, ?, ?)
        `);
    const result = await insertTeacher.run([teacher.matricule, teacher.nom, teacher.prenom, teacher.user_id]);

    if (result.changes === 0) {
        throw new Error(`L'enseignant ${nom} n'a pas pu être créer`);
    }

    return result;
};

// Afficher tout les enseignants
const getAllTeachers = async () => {
    const stmt = await db.prepare(`SELECT * FROM  teachers`);
    return await stmt.all();
};

// Afficher un enseignant grâce à son matricule
const getTeacherByMatricule = async (matricule) => {
    const stmt = await db.prepare(`SELECT * FROM teachers WHERE matricule = ?`);
    return await stmt.get([matricule]);
};

// afficher un enseignant grâce à son id
const getTeacherById = async (id) => {
    const stmt = await db.prepare(`SELECT * FROM teachers WHERE id = ?`);
    return await stmt.get([id]);
};

// Modifier un enseignant
const updateTeacher = async (id, data) => {
    const currentTeacher = await getTeacherById(id);

    // Sécurité : vérifier si l'enseignant existe
    if (!currentTeacher) {
        throw new Error(`Enseignant avec l'id ${id} introuvable`);
    }

    const nom = data.nom ?? currentTeacher.nom;
    const prenom = data.prenom ?? currentTeacher.prenom;

    const stmt = await db.prepare(`
            UPDATE teachers SET nom = ?, prenom = ?
            WHERE id = ?
        `);
    const result = await stmt.run([nom, prenom, id]);
    return result;
};

// Supprimer un enseignant
const deleteTeacher = async (id) => {
    const current = await getTeacherById(id);
    if (!current) {
        throw new Error(`Enseignant avec l'id ${id} introuvable`);
    }
    const deleteTeacherStmt = await db.prepare(`DELETE FROM teachers WHERE id = ?`);
    const result = await deleteTeacherStmt.run([id]);

    const deleteUserStmt = await db.prepare(`DELETE FROM users WHERE id = ?`);
    await deleteUserStmt.run([current.user_id]);

    return result;
};

export { createTeacher, getAllTeachers, getTeacherByMatricule, getTeacherById, updateTeacher, deleteTeacher };