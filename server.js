import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';

// Port d'écoute 
const PORT = process.env.PORT || 3000;


// Routes 
import studentRouter from './routes/studentRouter.js';
import teacherRouter from './routes/teacherRouter.js';
import classesRouter from './routes/classesRouter.js';
import subjectRouter from './routes/subjectRouter.js';
import gradeRouter from './routes/gradeRouter.js';
import absenceRouter from './routes/absenceRouter.js';
import userRouter from './routes/userRouter.js';
import activiteRouter from './routes/activiteRouter.js';

// route d'authententification 
import authRouter from './routes/authRouter.js';
import { login } from './controllers/authController.js';



// Middleware express et utilisation de Cors
const app = express();
app.use(express.json());
app.use(cors());


// express static 
app.use(express.static(path.join(import.meta.dirname, 'public')));


app.get('/', (req, res) => {
    res.redirect('/accueil');
});


// route page accueil 
app.get('/accueil', (req,res) => {
    res.sendFile(path.join(import.meta.dirname, 'public/html/index.html'));
})

// route page login 
app.get('/login', (req,res) => {
    res.sendFile(path.join(import.meta.dirname, 'public/html/login.html'));
})

// route dashboard 
app.get('/dashboard/admin', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public/html/dashboardAdmin.html'));
})
app.get('/dashboard/prof', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public/html/dashboardProf.html'));
})
app.get('/dashboard/etudiant', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public/html/dashboardEtudiant.html'));
})


// route page admin 
app.get('/dashboard/admin/eleve', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public/html/eleve-admin.html'));
})

app.get('/dashboard/admin/classe', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public/html/classe-admin.html'));
})

app.get('/dashboard/admin/enseignant', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public/html/enseignant-admin.html'));
})

app.get('/dashboard/admin/matiere', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public/html/matiere-admin.html'));
})

app.get('/dashboard/admin/presence', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public/html/presence-admin.html'))
})

app.get('/dashboard/admin/note', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public/html/note-admin.html'))
})

app.get('/dashboard/admin/parametre', (req, res) =>{
    res.sendFile(path.join(import.meta.dirname, 'public/html/parametre-admin.html'))
})

// route page professeur 
app.get('/dashboard/professeur/note', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public/html/note-prof.html'))
})

app.get('/dashboard/professeur/presence', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public/html/presence-prof.html'))
})

app.get('/dashboard/professeur/emploi_du_temps', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public/html/emploiDuTemps.html'))
})

// route page eleve 
app.get('/dashboard/etudiant/mesNotes', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public/html/note-eleve.html'))
})


// Route api 
app.use('/students', studentRouter);
app.use('/teachers', teacherRouter);
app.use('/classes', classesRouter);
app.use('/subjects', subjectRouter);
app.use('/grades', gradeRouter);
app.use('/absences', absenceRouter);
app.use('/users', userRouter);
app.use('/activites', activiteRouter);



// route api auth 
app.use('/auth', authRouter);

// Port d'écoute du serveur

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}/accueil`);
});