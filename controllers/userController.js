import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../services/userService.js";

// Contrôlleur utilisateur 

// avoir tout les utilisateurs 
const getUsers = (req, res) =>{
    try {
        const {motdepasse, ...userSansMotDePasse} = users
        const users = (getAllUsers());
        res.json(users);
    } catch (error) {
        res.status(500).json({error: `Une erreur est survenue`});
    }
};


// avoir un utilisateur grâce à son id 
const getUser = (req, res) => {
    try {
        const {motdepasse, ...userSansMotDePasse} = user
        const id = req.params.id;
        const user = getUserById(id);

        if(!user){
            return res.status(404).json({error: `L'utilisateur avec id ${id} introuvable`});
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


// créer un utilisateur 
const createUserHandler = (req, res) => {
    try {
        const { name, role, pseudoname, motdepasse } = req.body;
        const result = createUser(name, role, pseudoname, motdepasse);
        res.status(201).json({message: `Ùtilisateur créer avec succès`});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};


// modifier un utilisateur 
const updateUserHandler = (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = updateUser(id, data);
        res.json({message: `Utilisateur modifié avec succès`, result});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};


// supprimer un utilisateur 
const deleteUserHandler = (req, res) => {
    try {
        const id = req.params.id;
        const result = deleteUser(id);
        res.json({message: `Absence supprimé avec succès`, result});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};



export { getUser, getUsers, createUserHandler, updateUserHandler, deleteUserHandler }