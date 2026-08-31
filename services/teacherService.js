import db from "../db/database.js";
import Teacher from "../models/teacherModel.js";

// Créer un enseignant
const createTeacher = async (matricule, nom, prenom, user_id) => {

    // Vérifier que l'utilisateur avec le rôle prof
    const user = await (await db.prepare(`SELECT * FROM users WHERE id = ?`)).get(user_id);
    if (!user) {
        throw new Error(`Aucun utilisateur trouvé id : ${user_id}`);
    }

    if (user.role !== 'prof') {
        throw new Error(`L'utilisateur avec l'id ${user_id} n'a pas le rôle "proffeseur"`);
    }

    // Vérifier que l'uilisateur n'est pas déjà lié à un professeur
    const dejaLie = await (await db.prepare(`SELECT * FROM teachers WHERE user_id = ?`)).get(user_id);
    if (dejaLie) {
        throw new Error(`Ce compte est déjà lie à l'enseignant ${dejaLie.nom}`);
    }

    const teacher = new Teacher(matricule, nom, prenom, user_id);
    const insertTeacher = await db.prepare(`
            INSERT OR IGNORE INTO teachers (matricule, nom, prenom, user_id)
            VALUES(?, ?, ?, ?)
        `);
    const result = insertTeacher.run(teacher.matricule, teacher.nom, teacher.prenom, teacher.user_id);

    if (result.changes === 0) {
        throw new Error(`L'enseignant ${nom} n'a pas pu être créer`);
    }

    return result;
};

// Afficher tout les enseignants
const getAllTeachers = async () => {
    const result = await db.prepare(`SELECT * FROM teachers`);
    return result.all();
};

// Afficher un enseignant grâce à son matricule
const getTeacherByMatricule = async (matricule) => {
    const teacher = (await db.prepare(`SELECT * FROM teachers WHERE matricule = ?`)).get(matricule);
    return teacher;
};

// Afficher un enseignant grâce à son id
const getTeacherById = async (id) => {
    const teacher = (await db.prepare(`SELECT * FROM teachers WHERE id = ?`)).get(id);
    return teacher;
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

    const result = (await db.prepare(`
            UPDATE teachers SET nom = ?, prenom = ?
            WHERE id = ?
        `)).run(nom, prenom, id);
    return result;
};

// Supprimer un enseignant
const deleteTeacher = async (id) => {
    const current = await getTeacherById(id);
    if (!current) {
        throw new Error(`Enseignant avec l'id ${id} introuvable`);
    }
    const result = (await db.prepare(`DELETE FROM teachers WHERE id = ?`)).run(id);
    await (await db.prepare(`DELETE FROM users WHERE id = ?`)).run(current.user_id);

    return result;
};

export { createTeacher, getAllTeachers, getTeacherByMatricule, getTeacherById, updateTeacher, deleteTeacher };