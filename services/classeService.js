import db from "../db/database.js";
import Classe from "../models/classeModel.js";

// Créer une nouvelle classe
const createClasse = (nom, niveau, capacite) => {

    const classe = new Classe(nom, niveau, capacite);
    const insertClasse = db.prepare(`
            INSERT OR IGNORE INTO classes(nom, niveau, capacite)
            VALUES(?, ?, ?)
        `);
    const result = insertClasse.run(classe.nom, classe.niveau, classe.capacite);

    if(result.changes === 0){
        throw new Error(`La classe ${nom} existe déjà`);
    }

    return result
};

// Afficher toutes les classe
const getAllClasses = () => {
    return db.prepare(`SELECT * FROM classes`).all();
};

// Afficher la classe grâce à l'id 
const getClasseById = (id) => {
    const classe = db.prepare(`SELECT * FROM classes WHERE id = ?`).get(id);
    return classe;
}


// Afficher une classe grâce à son nom
const getClasseByNom = (nom)=> {
    const classe = db.prepare(`SELECT * FROM classes WHERE nom = ?`).get(nom);
    return classe;
}


// Modifier une classe
const updateClasse = (id, data) =>{
    const currentClasse = getClasseById(id);

    // Sécurité : vérifier si la classe existe
    if (!currentClasse) {
        throw new Error(`Classe avec l'id ${id} introuvable`);
    }

    const nom = data.nom ?? currentClasse.nom;
    const niveau = data.niveau ?? currentClasse.niveau;
    const capacite = data.capacite ?? currentClasse.capacite;

    const result = db.prepare(`
            UPDATE classes SET nom = ?, niveau = ?, capacite = ?
            WHERE id = ?
        `).run(nom, niveau, capacite, id);
    return result;
}


// Supprimer une classe 
const deleteClasse = (id)=> {
    const current = getClasseById(id);
    if(!current){
        throw new Error(`Classe avec l'id ${id} introuvable`);
    }
    const result = db.prepare(`DELETE FROM classes WHERE id = ?`).run(id);
    return result;
};


export { createClasse, getAllClasses, getClasseById, getClasseByNom, updateClasse, deleteClasse }