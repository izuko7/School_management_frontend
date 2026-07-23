import express from 'express';
import { getUser, getUsers, createUserHandler, updateUserHandler, deleteUserHandler } from '../controllers/userController.js';

const router = express.Router();

// GET 
router.get('/', getUsers);

// GET with id 
router.get('/:id', getUser);

// POST 
router.post('/', createUserHandler);

// PUT 
router.put('/:id', updateUserHandler);

// DELETE 
router.delete('/:id', deleteUserHandler);


export default router;