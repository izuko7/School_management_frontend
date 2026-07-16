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


// Afficher une classe grâce à son nom
const getClasseByNom = (nom)=> {
    const classe = db.prepare(`SELECT * FROM classes WHERE nom = ?`).get(nom);
    return classe;
}


// Modifier une classe
const updateClasse = (nom, data) =>{
    const currentClasse = getClasseByNom(nom);

    const niveau = data.niveau ?? currentClasse.niveau;
    const capacite = data.capacite ?? currentClasse.capacite;

    const result = db.prepare(`
            UPDATE classes SET niveau = ?, capacite = ?
            WHERE id = ?
        `).run(niveau, capacite, currentClasse.id);
    return result;
}


// Supprimer une classe 
const deleteClasse = (nom)=> {
    const current = getClasseByNom(nom);
    if(!current){
        throw new Error(`Classe avec le nom ${nom} introuvable`);
    }
    const result = db.prepare(`DELETE FROM classes WHERE nom = ?`).run(nom);
    return result;
};


export { createClasse, getAllClasses, getClasseByNom, updateClasse, deleteClasse }