import { getAllClasses, getClasseById, createClasse, updateClasse, deleteClasse } from "../services/classeService.js";
import { logSuccess, logWarn, logError } from '../utils/logger.js';


// Contrôleur Classes 

// avoir toutes les classes 
const getClasses = (req, res) => {
    try {
        const classes = (getAllClasses());
        res.json(classes);
    } catch (error) {
        logError(`Erreur lors de la récupération des classes : ${error.message}`);
        res.status(500).json({ error : `Une erreur est survenue` });
    }
};


// avoir une seule classe 
const getclasse = (req, res) => {
    try {
        const id = req.params.id;
        const classe = getClasseById(id);

        if(!classe){
            logWarn(`Classe introuvable (id: ${id})`);
            return res.status(404).json({ error: `Classe avec id ${id} introuvable` });
        }

        res.json(classe)

    } catch (error) {
        logError(`Erreur lors de la récupération de la classe (id: ${req.params.id}) : ${error.message}`);
        res.status(500).json({ error : `Une erreur est survenue` });
    }
};


// créer une classe 
const createClasseHandler = (req, res) => {
    try {
        const { nom, niveau, capacite } = req.body;
        const result = createClasse(nom, niveau, capacite);
        logSuccess(`Classe créée : ${nom} (niveau: ${niveau}, capacité: ${capacite})`);
        res.status(201).json({ message: `Classe créée avec succès`, result});
    } catch (error) {
        logWarn(`Échec de création d'une classe : ${error.message}`);
        res.status(400).json({message : error.message});
    }
};


// modifier une classe 
const updateClasseHandler = (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = updateClasse(id, data);
        logSuccess(`Classe modifiée (id: ${id})`);
        res.json({message: "Classe modifiée avec succès", result})
    } catch (error) {
        logWarn(`Échec de modification de la classe (id: ${req.params.id}) : ${error.message}`);
        res.status(400).json({message: error.message});
    }
};


// supprimer une classe 
const deleteClasseHandler  = (req, res) => {
    try {
        const id = req.params.id;
        const result= deleteClasse(id);
        logSuccess(`Classe supprimée (id: ${id})`);
        res.json({message: `Classe supprimée avec succès`});
    } catch (error) {
        logWarn(`Échec de suppression de la classe (id: ${req.params.id}) : ${error.message}`);
        res.status(400).json({message: error.message});
    }
};


export { getClasses, getclasse, updateClasseHandler, createClasseHandler, deleteClasseHandler }