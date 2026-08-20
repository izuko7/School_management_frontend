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
    createUser("Administrateur", "admin", "superadmin", "adminpass2");
    console.log("Admins créés avec succès");

    const userProf = createUser("Koffi", "prof", "BigK", "koffi1983");
    const userProf1 = createUser("Fabien", "prof", "Fabsky", "fabbi198433");
    const userProf2 = createUser("Yao", "prof", "YaoProf", "yao1985");
    const userProf3 = createUser("Kouamé", "prof", "KouameProf", "kouame1987");

    const userEtudiant = createUser("Kouadio", "etudiant", "palmer10", "palmer1005");
    const userEtudiant1 = createUser("Kouassi", "etudiant", "KKJ21", "kouakgouwap");
    const userEtudiant2 = createUser("Konan", "etudiant", "Konan10", "konan2005");


    const teacher = createTeacher("12345678", "Koffi", "Armand", userProf.lastInsertRowid);
    const teacher1 = createTeacher("12345679", "Fabien", "Marc", userProf1.lastInsertRowid);
    const teacher2 = createTeacher("12345680", "Yao", "Jean", userProf2.lastInsertRowid);
    const teacher3 = createTeacher("12345681", "Kouamé", "Paul", userProf3.lastInsertRowid);
    console.log('Professeurs créés avec succès');


    const classe1 = createClasse("6ème", "premier cycle", 30);
    const classe2 = createClasse("5ème", "premier cycle", 30);
    const classe3 = createClasse("4ème", "premier cycle", 30);
    const classe4 = createClasse("3ème", "premier cycle", 30);
    const classe5 = createClasse("2nde", "second cycle", 35);
    console.log('Classes créées avec succès');


    const elève = createStudent("14033212G", "Koudio", "tyson", "2005-04-30", classe1.lastInsertRowid, userEtudiant.lastInsertRowid);
    const elève1 = createStudent("14033213H", "Kouassi", "Kevin", "2005-06-15", classe2.lastInsertRowid, userEtudiant1.lastInsertRowid);
    const elève2 = createStudent("14033214J", "Konan", "Jean", "10/09/2006", classe3.lastInsertRowid, userEtudiant2.lastInsertRowid);
    console.log('Elèves créés avec succès');


    const subject1 = createSubject("Français", classe1.lastInsertRowid, teacher.lastInsertRowid);
    const subject2 = createSubject("Mathématiques", classe2.lastInsertRowid, teacher1.lastInsertRowid);
    const subject3 = createSubject("Anglais", classe3.lastInsertRowid, teacher2.lastInsertRowid);
    const subject4 = createSubject("Histoire-Géographie", classe4.lastInsertRowid, teacher3.lastInsertRowid);
    console.log('Matières créées avec succès');


    createGrade(elève.lastInsertRowid, subject1.lastInsertRowid, 12, "23-07-26", "devoir");
    createGrade(elève1.lastInsertRowid, subject2.lastInsertRowid, 15, "20-07-26", "devoir");
    createGrade(elève2.lastInsertRowid, subject3.lastInsertRowid, 14, "18-07-26", "examen");
    console.log('Notes créées avec succès');


    createAbsence(elève.lastInsertRowid, "21-06-26", "absent", 0);
    createAbsence(elève1.lastInsertRowid, "22-06-26", "absent", 0);
    createAbsence(elève2.lastInsertRowid, "23-06-26", "absent", 0);
    console.log('Absences créées avec succès');


} catch (error) {

    console.log("Erreur : ", error.message);

}