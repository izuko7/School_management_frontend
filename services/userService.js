import db from "../db/database.js";
import User from "../models/userModel.js";

// Créer un utilisateur

const createUser = (name, role, pseudoname, motdepasse) => {
    const user = new User(name, role, pseudoname, motdepasse);
    const insertUser = db.prepare(`
            INSERT INTO users(name, role, pseudoname, motdepasse)
            VALUES(?, ?, ?, ?)
        `);
    const result = insertUser.run(user.name, user.role, user.pseudoname, user.motdepasse);
    return result
};


// Afficher tout les utilisateurs

const getAllUsers = () => {
    return db.prepare('SELECT * FROM users').all();
};


// Rechercher un Utilisateur grâce à son pseudo

const getUserByPseudo = (pseudoname) => {
    const user = db.prepare('SELECT * FROM users WHERE pseudoname = ?').get(pseudoname);
    return user;
};


// Modifier un utilisateur

const updateUser = (pseudoname, data) => {
    const currentUser = getUserByPseudo(pseudoname);

    const name = data.name ?? currentUser.name;
    const role = data.role ?? currentUser.role;
    const newPseudoname = data.pseudoname ?? currentUser.pseudoname;
    const motdepasse = data.motdepasse ?? currentUser.motdepasse;

    const result = db.prepare(`
            UPDATE users SET name = ?, role = ?, pseudoname = ?, motdepasse = ?
            WHERE id = ?
        `).run(name, role, newPseudoname, motdepasse, currentUser.id);
        return result;
};


// Supprimer un utilisateur

const deleteUser = (pseudoname) => {
    const curent = getUserByPseudo(pseudoname);
    if(!curent){
        throw new Error(`Utilisateur avec le pseudo ${pseudoname} introuvable`);
    }
    const result = db.prepare(`DELETE FROM users WHERE pseudoname = ?`).run(pseudoname);
    return result;
}

export { createUser, getAllUsers, getUserByPseudo, updateUser, deleteUser }