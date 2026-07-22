import { getAllClasses, getClasseById, createClasse, updateClasse, deleteClasse } from "../services/classeService.js";


// Contrôller Classes 

// avoir toutes les classes 
const getClasses = (req, res) => {
    try {
        const classes = (getAllClasses());
        res.json(classes);
    } catch (error) {
        res.status(500).json({ error : `Une erreur est survenue` });
    }
};


// avoir une seul classe 
const getclasse = (req, res) => {
    try {
        const id = req.params.id;
        const classe = getClasseById(id);

        if(!classe){
            return res.status(404).json({ error: `Classe avec id ${id} introuvable` });
        }

        res.json(classe)

    } catch (error) {
        res.status(500).json({ error : `Une erreur est survenue` });
    }
};


// creér une classe 
const createClasseHandler = (req, res) => {
    try {
        const { nom, niveau, capacite } = req.body;
        const result = createClasse(nom, niveau, capacite);
        res.status(201).json({ message: `Classe créer avec succès`, result});
    } catch (error) {
        res.status(400).json({message : error.message});
    }
};


// modifier une classe 
const updateClasseHandler = (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = updateClasse(id, data);
        res.json({message: "Classe modifié avec succès", result})
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};


// supprimer une classe 
const deleteClasseHandler  = (req, res) => {
    try {
        const id = req.params.id;
        const result= deleteClasse(id);
        res.json({message: `Classe supprimée avec succès`});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};


export { getClasses, getclasse, updateClasseHandler, createClasseHandler, deleteClasseHandler } 