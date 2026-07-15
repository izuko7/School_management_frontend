import db from "./database.js";

// TABLE USERS
const tableUsers = `
    CREATE TABLE IF NOT EXISTS users (
        id       INTEGER PRIMARY KEY AUTOINCREMENT,
        name     TEXT    NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'prof', 'etudiant')),
        pseudoname TEXT  UNIQUE NOT NULL,
        motdepasse TEXT  NOT NULL
    )
`;
db.exec(tableUsers);

// TABLE CLASSES
const tableClasses = `
    CREATE TABLE IF NOT EXISTS classes (
        id       INTEGER PRIMARY KEY AUTOINCREMENT,
        nom      TEXT    UNIQUE NOT NULL,
        niveau   TEXT    NOT NULL,
        capacite INTEGER NOT NULL
    )
`;
db.exec(tableClasses);


// TABLE ETUDIANTS
const tableStudents = `
        CREATE TABLE IF NOT EXISTS students (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        matricule TEXT    UNIQUE NOT NULL,
        nom       TEXT    NOT NULL,
        prenom    TEXT    NOT NULL,
        date_naissance       TEXT NOT NULL,
        classe_id INTEGER NOT NULL,
        user_id   INTEGER UNIQUE,
        FOREIGN KEY (classe_id) REFERENCES classes(id),
        FOREIGN KEY (user_id)   REFERENCES users(id)
    )
`;
db.exec(tableStudents);


// TABLE PROFESSEURS
const tableTeachers = `
    CREATE TABLE IF NOT EXISTS teachers (
        id      INTEGER PRIMARY KEY AUTOINCREMENT,
        nom     TEXT    NOT NULL,
        user_id INTEGER UNIQUE,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
`;
db.exec(tableTeachers);


// TABLE MATIERE SUBJECT
const tableSubjects = `
    CREATE TABLE IF NOT EXISTS subjects (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        nom        TEXT    NOT NULL,
        classe_id  INTEGER NOT NULL,
        teacher_id INTEGER,
        UNIQUE(nom, classe_id),
        FOREIGN KEY (classe_id)  REFERENCES classes(id),
        FOREIGN KEY (teacher_id) REFERENCES teachers(id)
    )
`;
db.exec(tableSubjects);


// TABLE NOTES GRADES
const tableGrades = `
    CREATE TABLE IF NOT EXISTS grades (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        subject_id INTEGER NOT NULL,
        note       REAL    NOT NULL,
        date       TEXT    NOT NULL,
        type       TEXT    NOT NULL DEFAULT 'devoir',
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (subject_id) REFERENCES subjects(id)
    )
`;
db.exec(tableGrades);


// TABLE ABSENCES
const tableAbsences = `
    CREATE TABLE IF NOT EXISTS absences (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        date       TEXT    NOT NULL,
        status     TEXT    NOT NULL CHECK (status IN ('absent', 'retard', 'present')),
        justifie   INTEGER NOT NULL DEFAULT 0 CHECK (justifie IN (0, 1)),
        motif      TEXT,
        FOREIGN KEY (student_id) REFERENCES students(id)
    )
`;
db.exec(tableAbsences);