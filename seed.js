import db from "./db/database.js";
import { createUser } from "./services/userService.js";
import { createTeacher } from "./services/teacherService.js";
import { createSubject } from "./services/subjectService.js";
import { createStudent } from "./services/studentService.js";
import { createGrade } from "./services/gradeService.js";
import { createClasse } from "./services/classeService.js";
import { createAbsence } from "./services/absenceService.js";


try {

    // Nettoyage de la base (dans l'ordre des dépendances)
    db.prepare("DELETE FROM grades").run();
    db.prepare("DELETE FROM absences").run();
    db.prepare("DELETE FROM subjects").run();
    db.prepare("DELETE FROM students").run();
    db.prepare("DELETE FROM teachers").run();
    db.prepare("DELETE FROM classes").run();
    db.prepare("DELETE FROM users").run();


    // Création des données

    createUser("Admin Principal", "admin", "admin", "adminpass");
    console.log("Admin créé avec succès");

    const userProf = createUser("Koffi", "prof", "BigK", "koffi1983");
    const userEtudiant = createUser("Kouadio", "etudiant", "palmer10", "palmer1005");
    const userEtudiant1 = createUser("Kouassi", "etudiant", "KKJ21", "kouakgouwap");
    

    const teacher = createTeacher("12345678", "Koffi", "Armand", userProf.lastInsertRowid);
    console.log('Professeur créé avec succès');

    const classe1 = createClasse("6ème", "premier cycle",30);
    console.log('classe créé avec succès');

    const elève = createStudent("14033212G", "Koudio", "tyson", "30/04/2005", classe1.lastInsertRowid, userEtudiant.lastInsertRowid)
    console.log('Elève créé avec succès');

    const subject1 = createSubject("Français", classe1.lastInsertRowid, teacher.lastInsertRowid)
    console.log('Matière créé avec succès');

    createGrade(elève.lastInsertRowid, subject1.lastInsertRowid, 12, "23/07/26", "devoir");
    console.log('Note créer avec succès');

    createAbsence(elève.lastInsertRowid, "21/06/26", "absent", 0)
    console.log('Absence créer avec succès');

} catch (error) {

    console.log("Erreur : ", error.message);

}