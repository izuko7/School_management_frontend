import { getAbsenceById, getAllAbsences, createAbsence, updateAbsence, deleteAbsence } from "../services/absenceService.js";

// Contrôlleurs absences 


// avoir toute les absences 
const getAbsences = (req, res) => {
    try {
        const absences = (getAllAbsences());
        res.json(absences);
    } catch (error) {
        res.status(500).json({error: 'une erreur est survenue'});
    }
};


// avoir une absence grâce à son id 
const getAbsence = (req, res) => {
    try {
        const id = req.params.id;
        const absence = getAbsenceById(id);

        if(!absence){
            return res.status(404).json({error: `Absence avec id ${id} introuvable`});
        }

        res.json(absence)
    } catch (error) {
        res.status(500).json({error: 'une erreur est survenue'});
    }
};

// créer d'une absence 
const createAbsenceHandler = (req, res) => {
    try {
        const { student_id, date, status, justifie, motif } = req.body;
        const result = createAbsence(student_id, date, status, justifie, motif);
        res.status(201).json({message: `Absence créer avec succès`});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};


// modifier une absence
const updateAbsenceHandler = (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = updateAbsence(id, data);
        res.json({message: `Absence modifié avec succès`, result});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

// supprimer une absence 
const deleteAbsenceHandler = (req, res) =>{
    try {
        const id = req.params.id;
        const result = deleteAbsence(id);
        res.json({message: 'Absence supprimé avec succès', result});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

export { getAbsence, getAbsences, createAbsenceHandler, updateAbsenceHandler, deleteAbsenceHandler }