import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_DB_PATH = path.join(__dirname, "database.db");
const db = new Database(LOCAL_DB_PATH);
db.pragma("foreign_keys = ON");

try {
  // Nettoyage (dans l'ordre des dépendances)
  db.exec(`
    DELETE FROM grades;
    DELETE FROM absences;
    DELETE FROM subjects;
    DELETE FROM students;
    DELETE FROM teachers;
    DELETE FROM classes;
    DELETE FROM users;
  `);

  const insertUser = db.prepare(
    `INSERT INTO users (name, role, pseudoname, motdepasse) VALUES (?, ?, ?, ?)`
  );
  const insertTeacher = db.prepare(
    `INSERT INTO teachers (matricule, nom, prenom, user_id) VALUES (?, ?, ?, ?)`
  );
  const insertClasse = db.prepare(
    `INSERT INTO classes (nom, niveau, capacite) VALUES (?, ?, ?)`
  );
  const insertStudent = db.prepare(
    `INSERT INTO students (matricule, nom, prenom, date_naissance, classe_id, user_id) VALUES (?, ?, ?, ?, ?, ?)`
  );
  const insertSubject = db.prepare(
    `INSERT INTO subjects (nom, classe_id, teacher_id) VALUES (?, ?, ?)`
  );
  const insertGrade = db.prepare(
    `INSERT INTO grades (student_id, subject_id, note, date, type) VALUES (?, ?, ?, ?, ?)`
  );
  const insertAbsence = db.prepare(
    `INSERT INTO absences (student_id, date, status, justifie) VALUES (?, ?, ?, ?)`
  );

  // Admins
  insertUser.run("Admin Principal", "admin", "admin", "adminpass");
  insertUser.run("Administrateur", "admin", "superadmin", "adminpass2");
  console.log("Admins créés avec succès");

  // Professeurs
  const userProf = insertUser.run("Koffi", "prof", "BigK", "koffi1983");
  const userProf1 = insertUser.run("Fabien", "prof", "Fabsky", "fabbi198433");
  const userProf2 = insertUser.run("Yao", "prof", "YaoProf", "yao1985");
  const userProf3 = insertUser.run("Kouamé", "prof", "KouameProf", "kouame1987");

  // Étudiants (users)
  const userEtudiant = insertUser.run("Kouadio", "etudiant", "palmer10", "palmer1005");
  const userEtudiant1 = insertUser.run("Kouassi", "etudiant", "KKJ21", "kouakgouwap");
  const userEtudiant2 = insertUser.run("Konan", "etudiant", "Konan10", "konan2005");

  const teacher = insertTeacher.run("12345678", "Koffi", "Armand", userProf.lastInsertRowid);
  const teacher1 = insertTeacher.run("12345679", "Fabien", "Marc", userProf1.lastInsertRowid);
  const teacher2 = insertTeacher.run("12345680", "Yao", "Jean", userProf2.lastInsertRowid);
  const teacher3 = insertTeacher.run("12345681", "Kouamé", "Paul", userProf3.lastInsertRowid);
  console.log("Professeurs créés avec succès");

  const classe1 = insertClasse.run("6ème", "premier cycle", 30);
  const classe2 = insertClasse.run("5ème", "premier cycle", 30);
  const classe3 = insertClasse.run("4ème", "premier cycle", 30);
  const classe4 = insertClasse.run("3ème", "premier cycle", 30);
  const classe5 = insertClasse.run("2nde", "second cycle", 35);
  console.log("Classes créées avec succès");

  const eleve = insertStudent.run("14033212G", "Koudio", "tyson", "30/04/2005", classe1.lastInsertRowid, userEtudiant.lastInsertRowid);
  const eleve1 = insertStudent.run("14033213H", "Kouassi", "Kevin", "15/06/2005", classe2.lastInsertRowid, userEtudiant1.lastInsertRowid);
  const eleve2 = insertStudent.run("14033214J", "Konan", "Jean", "10/09/2006", classe3.lastInsertRowid, userEtudiant2.lastInsertRowid);
  console.log("Elèves créés avec succès");

  const subject1 = insertSubject.run("Français", classe1.lastInsertRowid, teacher.lastInsertRowid);
  const subject2 = insertSubject.run("Mathématiques", classe2.lastInsertRowid, teacher1.lastInsertRowid);
  const subject3 = insertSubject.run("Anglais", classe3.lastInsertRowid, teacher2.lastInsertRowid);
  const subject4 = insertSubject.run("Histoire-Géographie", classe4.lastInsertRowid, teacher3.lastInsertRowid);
  console.log("Matières créées avec succès");

  insertGrade.run(eleve.lastInsertRowid, subject1.lastInsertRowid, 12, "23/07/2026", "devoir");
  insertGrade.run(eleve1.lastInsertRowid, subject2.lastInsertRowid, 15, "20/07/2026", "devoir");
  insertGrade.run(eleve2.lastInsertRowid, subject3.lastInsertRowid, 14, "18/07/2026", "examen");
  console.log("Notes créées avec succès");

  insertAbsence.run(eleve.lastInsertRowid, "21/06/2026", "absent", 0);
  insertAbsence.run(eleve1.lastInsertRowid, "22/06/2026", "absent", 0);
  insertAbsence.run(eleve2.lastInsertRowid, "23/06/2026", "absent", 0);
  console.log("Absences créées avec succès");

  console.log("🎉 Seed local terminé avec succès.");
} catch (error) {
  console.log("Erreur : ", error.message);
} finally {
  db.close();
}