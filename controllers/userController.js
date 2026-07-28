import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../services/userService.js";
import { logSuccess, logWarn, logError } from "../utils/logger.js";

// Contrôlleur utilisateur 

// avoir tout les utilisateurs 
const getUsers = (req, res) =>{
    try {
        const users = (getAllUsers());
        const usersSansMotDePasse = users.map(({motdepasse, ...rest}) => (rest));
        res.json(usersSansMotDePasse);
    } catch (error) {
        logError(`Erreur lors de la récupération des utilisateurs : ${error.message}`);
        res.status(500).json({error: `Une erreur est survenue`});
    }
};


// avoir un utilisateur grâce à son id 
const getUser = (req, res) => {
    try {
        const id = req.params.id;
        const user = getUserById(id);

        if(!user){
            logWarn(`Utilisateur introuvable`);
            return res.status(404).json({error: `L'utilisateur avec id ${id} introuvable`});
        }

        const {motdepasse, ...userSansMotDePasse} = user

        res.json(userSansMotDePasse);
    } catch (error) {
        logError(`Erreur lors de la récupération de l'utilisateur`);
        res.status(500).json({message: error.message});
    }
};


// créer un utilisateur 
const createUserHandler = (req, res) => {
    try {
        const { name, role, pseudoname, motdepasse } = req.body;
        const result = createUser(name, role, pseudoname, motdepasse);
        logSuccess(`Utilisateur créé : ${pseudoname}`);
        res.status(201).json({message: `Ùtilisateur créer avec succès`});
    } catch (error) {
        logWarn(`Échec de création d'un utilisateur : ${error.message}`);
        res.status(400).json({message: error.message});
    }
};


// modifier un utilisateur 
const updateUserHandler = (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = updateUser(id, data);
        logSuccess(`Utilisateur modifié`);
        res.json({message: `Utilisateur modifié avec succès`, result});
    } catch (error) {
        logWarn(`Échec de modification de l'utilisateur`);
        res.status(400).json({message: error.message});
    }
};


// supprimer un utilisateur 
const deleteUserHandler = (req, res) => {
    try {
        const id = req.params.id;
        const result = deleteUser(id);
        logSuccess(`Utilisateur supprimé`);
        res.json({message: `Utilisateur supprimé avec succès`, result});
    } catch (error) {
        logWarn(`Échec de suppression de l'utilisateur`);
        res.status(400).json({message: error.message});
    }
};



export { getUser, getUsers, createUserHandler, updateUserHandler, deleteUserHandler }