import db from "../db/database.js";
import User from "../models/userModel.js";

// Créer un utilisateur

const createUser = async (name, role, pseudoname, motdepasse) => {
    const user = new User(name, role, pseudoname, motdepasse);
    const insertUser = await db.prepare(`
            INSERT INTO users(name, role, pseudoname, motdepasse)
            VALUES(?, ?, ?, ?)
        `);
    const result = insertUser.run(user.name, user.role, user.pseudoname, user.motdepasse);
    return result
};


// Afficher tout les utilisateurs

const getAllUsers = async () => {
    const result = await db.prepare('SELECT * FROM users')
    return result.all();
};

// Rechercher un utilisateur grâce à son id 
const getUserById = async (id) => {
    const user = (await db.prepare('SELECT * FROM users WHERE id = ?')).get(id);
    return user;
}

// Rechercher un Utilisateur grâce à son pseudo

const getUserByPseudo = async (pseudoname) => {
    const user = (await db.prepare('SELECT * FROM users WHERE pseudoname = ?')).get(pseudoname);
    return user;
};


// Modifier un utilisateur

const updateUser = async (id, data) => {
    const currentUser = await getUserById(id);

    const name = data.name ?? currentUser.name;
    const role = data.role ?? currentUser.role;
    const newPseudoname = data.pseudoname ?? currentUser.pseudoname;
    const motdepasse = data.motdepasse ?? currentUser.motdepasse;

    const result = (await db.prepare(`
            UPDATE users SET name = ?, role = ?, pseudoname = ?, motdepasse = ?
            WHERE id = ?
        `)).run(name, role, newPseudoname, motdepasse, id);
        return result;
};


// Supprimer un utilisateur

const deleteUser = async (id) => {
    const curent = await getUserById(id);
    if(!curent){
        throw new Error(`Utilisateur avec l'id ${id} introuvable`);
    }
    const result = (await db.prepare(`DELETE FROM users WHERE id = ?`)).run(id);
    return result;
}

export { createUser, getAllUsers, getUserById, getUserByPseudo, updateUser, deleteUser }