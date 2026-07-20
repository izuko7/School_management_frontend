import db from "../db/database.js";
import Absence from "../models/absenceModel.js";

// Créer une nouvelle absence 
const createAbsence = (student_id, date, status, justifie, motif) =>{

    // Vérifier si l'utilisateur existe 
    const student = db.prepare(`SELECT * FROM students WHERE id = ?`).get(student_id);
    if(!student){
        throw new Error(`L'étudiant avec identifiant ${student_id} introuvable`);
    }

    const absence = new Absence(student_id, date, status, justifie, motif);
    const insertAbsence = db.prepare(`
            INSERT INTO absences(student_id, date, status, justifie, motif)
            VALUES(?, ?, ?, ?, ?)
        `);
    const result = insertAbsence.run(absence.student_id, absence.date, absence.status, absence.justifie, absence.motif);
    
    return result;
};


// Afficher toute les absences
const getAllAbsences = () => {
    return db.prepare(`SELECT * FROM absences`).all();
}


// Afficher une absence grâce à son identifiant 
const getAbsenceById = (id)=> {
    const absence = db.prepare(`SELECT * FROM absences WHERE id = ?`).get(id);
    return absence;
};

// Modifier une absence 
const updateAbsence = (id, data) => {
    const currentAbsence = getAbsenceById(id);

    const student_id = data.student_id ?? currentAbsence.student_id;
    const date = data.date ?? currentAbsence.date;
    const status = data.status ?? currentAbsence.status;
    const justifie = data.justifie ?? currentAbsence.justifie;
    const motif = data.motif ?? currentAbsence.motif;

    const result = db.prepare(`
            UPDATE absences SET student_id = ?, date = ?, 
            status = ?, justifie = ?, motif = ?
            WHERE id = ?
        `).run(student_id, date, status, justifie, motif, id);
    return result;
};

// Supprimer une absence 
const deleteAbsence = (id) =>{
    const current = getAbsenceById(id);
    if(!current){
        throw new Error(`Absence avec l'id ${id} introuvable`);
    }
    const result = db.prepare(`DELETE FROM absences WHERE id = ?`).run(id);
    return result;
};

export { createAbsence, getAllAbsences, getAbsenceById, updateAbsence, deleteAbsence }