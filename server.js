import express from 'express';
import cors from 'cors';

const app = express();

// Middleware express et utilisation de Cors
app.use(express.json());
app.use(cors());


// Port d'écoute du serveur

app.listen(3000, () => {
    console.log(`Serveur démarré sur http://localhost:3000/`)
});