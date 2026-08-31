import db from "../db/database.js";
import Classe from "../models/classeModel.js";

// Créer une nouvelle classe
const createClasse = async (nom, niveau, capacite) => {

    const classe = new Classe(nom, niveau, capacite);
    const insertClasse = await db.prepare(`
            INSERT OR IGNORE INTO classes(nom, niveau, capacite)
            VALUES(?, ?, ?)
        `);
    const result = await insertClasse.run([classe.nom, classe.niveau, classe.capacite]);

    if (result.changes === 0) {
        throw new Error(`La classe ${nom} existe déjà`);
    }

    return result;
};

// Afficher toutes les classe
const getAllClasses = async () => {
    const stmt = await db.prepare(`SELECT * FROM classes`);
    return await stmt.all();
};

// Afficher la classe grâce à l'id
const getClasseById = async (id) => {
    const stmt = await db.prepare(`SELECT * FROM classes WHERE id = ?`);
    return await stmt.get([id]);
};

// Afficher une classe grâce à son nom
const getClasseByNom = async (nom) => {
    const stmt = await db.prepare(`SELECT * FROM classes WHERE nom = ?`);
    return await stmt.get([nom]);
};

// Modifier une classe
const updateClasse = async (id, data) => {
    const currentClasse = await getClasseById(id);

    // Sécurité : vérifier si la classe existe
    if (!currentClasse) {
        throw new Error(`Classe avec l'id ${id} introuvable`);
    }

    const nom = data.nom ?? currentClasse.nom;
    const niveau = data.niveau ?? currentClasse.niveau;
    const capacite = data.capacite ?? currentClasse.capacite;

    const stmt = await db.prepare(`
            UPDATE classes SET nom = ?, niveau = ?, capacite = ?
            WHERE id = ?
        `);
    const result = await stmt.run([nom, niveau, capacite, id]);
    return result;
};

// Supprimer une classe
const deleteClasse = async (id) => {
    const current = await getClasseById(id);
    if (!current) {
        throw new Error(`Classe avec l'id ${id} introuvable`);
    }
    const stmt = await db.prepare(`DELETE FROM classes WHERE id = ?`);
    const result = await stmt.run([id]);
    return result;
};

export { createClasse, getAllClasses, getClasseById, getClasseByNom, updateClasse, deleteClasse };