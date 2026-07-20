import express from 'express';
import cors from 'cors';



// Routes 
import studentRouter from './routes/studentRouter.js';



// Middleware express et utilisation de Cors
const app = express();
app.use(express.json());
app.use(cors());


// Route api 
app.use('/students', studentRouter);

// Port d'écoute du serveur

app.listen(3000, () => {
    console.log(`Serveur démarré sur http://localhost:3000/`)
});