import db from "../db/database.js";
import Subject from "../models/subjectModel.js";

// Créer une matière
const createSubject = (nom, classe_id, teacher_id) => {

    // Vérifier si le prof existe
    const teacher = db.prepare(`SELECT * FROM teachers WHERE id = ?`).get(teacher_id);
    if(!teacher){
        throw new Error (`Professeur avec le matricule ${teacher_id} est introuvable`);
    }

    const classe = db.prepare(`SELECT * FROM classes WHERE id = ?`).get(classe_id);
    if(!classe) {
        throw new Error(`Classe avec id : ${classe_id} introuvable`);
    }

    const subject = new Subject(nom, classe_id, teacher_id);
    const result = db.prepare(`
            INSERT INTO subjects(nom, classe_id, teacher_id)
            VALUES (?, ?, ?)
        `).run(subject.nom, subject.classe_id, subject.teacher_id);
    return result;
};


// Afficher toutes les matières

const getAllSubject = () => {
    return db.prepare(`SELECT * FROM subjects`).all();
};


// Chercher une matière grâce a l'id 

const getSubjectById = (id) =>{
    const subject = db.prepare(`SELECT * FROM subjects WHERE id = ?`).get(id);
    return subject
};


// Modifier une matière
const updateSubject = (id, data)=>{
    const currentSubject = getSubjectById(id);
    if(!currentSubject) throw new Error(`Matière introuvable`);

    const newNom = data.nom ?? currentSubject.nom;

    const result = db.prepare(`
            UPDATE subjects SET nom = ?
            WHERE id = ?
        `).run(newNom, id);
        return result;
};

// Supprimer une matière
const deleteSubject = (id) => {
    const current = getSubjectById(id);
    if (!current) throw new Error(`Matière avec l'id ${id} introuvable.`);

    const result = db.prepare(`DELETE FROM subjects WHERE id = ?`).run(id);
    return result;
}

export { createSubject, getAllSubject, getSubjectById, updateSubject, deleteSubject }