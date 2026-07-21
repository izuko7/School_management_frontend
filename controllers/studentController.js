import { getAllStudents, getStudentById } from "../services/studentService.js";

// Contrôller étudiant 
const getStudents = (req, res) => {
    try {
        const students = (getAllStudents());
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue" });
    }
}


const getStudent = (req, res) =>  {
    try {
        const id = req.params.id;
        const student = getStudentById(id);
        
        if(!student){
           return res.status(404).json({ error: `Etuidant avec id : ${id}  introuvable `});
        }

        res.json(student);

    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue"});
    }
}






export { getStudents, getStudent };