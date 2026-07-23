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

// Rechercher un utilisateur grâce à son id 
const getUserById = (id) => {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    return user;
}

// Rechercher un Utilisateur grâce à son pseudo

const getUserByPseudo = (pseudoname) => {
    const user = db.prepare('SELECT * FROM users WHERE pseudoname = ?').get(pseudoname);
    return user;
};


// Modifier un utilisateur

const updateUser = (id, data) => {
    const currentUser = getUserById(id);

    const name = data.name ?? currentUser.name;
    const role = data.role ?? currentUser.role;
    const newPseudoname = data.pseudoname ?? currentUser.pseudoname;
    const motdepasse = data.motdepasse ?? currentUser.motdepasse;

    const result = db.prepare(`
            UPDATE users SET name = ?, role = ?, pseudoname = ?, motdepasse = ?
            WHERE id = ?
        `).run(name, role, newPseudoname, motdepasse, id);
        return result;
};


// Supprimer un utilisateur

const deleteUser = (id) => {
    const curent = getUserById(id);
    if(!curent){
        throw new Error(`Utilisateur avec l'id ${id} introuvable`);
    }
    const result = db.prepare(`DELETE FROM users WHERE id = ?`).run(id);
    return result;
}

export { createUser, getAllUsers, getUserById, getUserByPseudo, updateUser, deleteUser }