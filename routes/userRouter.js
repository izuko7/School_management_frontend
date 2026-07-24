import express from 'express';
import { getUser, getUsers, createUserHandler, updateUserHandler, deleteUserHandler } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authVerify.js';

const router = express.Router();

// GET 
router.get('/', verifyToken, getUsers);

// GET with id 
router.get('/:id', verifyToken, getUser);

// POST 
router.post('/', verifyToken, createUserHandler);

// PUT 
router.put('/:id', verifyToken, updateUserHandler);

// DELETE 
router.delete('/:id', verifyToken, deleteUserHandler);


export default router;