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
    await (await db.prepare("DELETE FROM grades")).run();
    await (await db.prepare("DELETE FROM absences")).run();
    await (await db.prepare("DELETE FROM subjects")).run();
    await (await db.prepare("DELETE FROM students")).run();
    await (await db.prepare("DELETE FROM teachers")).run();
    await (await db.prepare("DELETE FROM classes")).run();
    await (await db.prepare("DELETE FROM users")).run();

    // Création des données

    await createUser("Admin Principal", "admin", "admin", "adminpass");
    await createUser("Administrateur", "admin", "superadmin", "adminpass2");
    console.log("Admins créés avec succès");

    const userProf = await createUser("Koffi", "prof", "BigK", "koffi1983");
    const userProf1 = await createUser("Fabien", "prof", "Fabsky", "fabbi198433");
    const userProf2 = await createUser("Yao", "prof", "YaoProf", "yao1985");
    const userProf3 = await createUser("Kouamé", "prof", "KouameProf", "kouame1987");

    const userEtudiant = await createUser("Kouadio", "etudiant", "palmer10", "palmer1005");
    const userEtudiant1 = await createUser("Kouassi", "etudiant", "KKJ21", "kouakgouwap");
    const userEtudiant2 = await createUser("Konan", "etudiant", "Konan10", "konan2005");

    const teacher = await createTeacher("12345678", "Koffi", "Armand", userProf.lastInsertRowid);
    const teacher1 = await createTeacher("12345679", "Fabien", "Marc", userProf1.lastInsertRowid);
    const teacher2 = await createTeacher("12345680", "Yao", "Jean", userProf2.lastInsertRowid);
    const teacher3 = await createTeacher("12345681", "Kouamé", "Paul", userProf3.lastInsertRowid);
    console.log('Professeurs créés avec succès');

    const classe1 = await createClasse("6ème", "premier cycle", 30);
    const classe2 = await createClasse("5ème", "premier cycle", 30);
    const classe3 = await createClasse("4ème", "premier cycle", 30);
    const classe4 = await createClasse("3ème", "premier cycle", 30);
    const classe5 = await createClasse("2nde", "second cycle", 35);
    console.log('Classes créées avec succès');

    const elève = await createStudent("14033212G", "Koudio", "tyson", "30/04/2005", classe1.lastInsertRowid, userEtudiant.lastInsertRowid);
    const elève1 = await createStudent("14033213H", "Kouassi", "Kevin", "15/06/2005", classe2.lastInsertRowid, userEtudiant1.lastInsertRowid);
    const elève2 = await createStudent("14033214J", "Konan", "Jean", "10/09/2006", classe3.lastInsertRowid, userEtudiant2.lastInsertRowid);
    console.log('Elèves créés avec succès');

    const subject1 = await createSubject("Français", classe1.lastInsertRowid, teacher.lastInsertRowid);
    const subject2 = await createSubject("Mathématiques", classe2.lastInsertRowid, teacher1.lastInsertRowid);
    const subject3 = await createSubject("Anglais", classe3.lastInsertRowid, teacher2.lastInsertRowid);
    const subject4 = await createSubject("Histoire-Géographie", classe4.lastInsertRowid, teacher3.lastInsertRowid);
    console.log('Matières créées avec succès');

    await createGrade(elève.lastInsertRowid, subject1.lastInsertRowid, 12, "23/07/2026", "devoir");
    await createGrade(elève1.lastInsertRowid, subject2.lastInsertRowid, 15, "20/07/2026", "devoir");
    await createGrade(elève2.lastInsertRowid, subject3.lastInsertRowid, 14, "18/07/2026", "examen");
    console.log('Notes créées avec succès');

    await createAbsence(elève.lastInsertRowid, "21/06/2026", "absent", 0);
    await createAbsence(elève1.lastInsertRowid, "22/06/2026", "absent", 0);
    await createAbsence(elève2.lastInsertRowid, "23/06/2026", "absent", 0);
    console.log('Absences créées avec succès');

} catch (error) {

    console.log("Erreur : ", error.message);

}