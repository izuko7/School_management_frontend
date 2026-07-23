import express from 'express';
import cors from 'cors';



// Routes 
import studentRouter from './routes/studentRouter.js';
import teacherRouter from './routes/teacherRouter.js';
import classesRouter from './routes/classesRouter.js';
import subjectRouter from './routes/subjectRouter.js';
import gradeRouter from './routes/gradeRouter.js';
import absenceRouter from './routes/absenceRouter.js';
import userRouter from './routes/userRouter.js';



// Middleware express et utilisation de Cors
const app = express();
app.use(express.json());
app.use(cors());


// Route api 
app.use('/students', studentRouter);
app.use('/teachers', teacherRouter);
app.use('/classes', classesRouter);
app.use('/subjects', subjectRouter);
app.use('/grades', gradeRouter);
app.use('/absences', absenceRouter);
app.use('/users', userRouter);

// Port d'écoute du serveur

app.listen(3000, () => {
    console.log(`Serveur démarré sur http://localhost:3000/`)
});