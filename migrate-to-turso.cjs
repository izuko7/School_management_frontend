require("dotenv").config();
const path = require("path");
const Database = require("better-sqlite3");
const { createClient } = require("@tursodatabase/serverless/compat");

const LOCAL_DB_PATH = path.join(__dirname, "db", "database.db");
const RESET = process.argv.includes("--reset");

const TABLES_IN_ORDER = [
  "classes", "users", "teachers", "students",
  "subjects", "grades", "absences", "activites",
];

const SCHEMA = {
  classes: `CREATE TABLE IF NOT EXISTS classes (
        id       INTEGER PRIMARY KEY AUTOINCREMENT,
        nom      TEXT    UNIQUE NOT NULL,
        niveau   TEXT    NOT NULL,
        capacite INTEGER NOT NULL
    )`,
  users: `CREATE TABLE IF NOT EXISTS users (
        id       INTEGER PRIMARY KEY AUTOINCREMENT,
        name     TEXT    NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'prof', 'etudiant')),
        pseudoname TEXT  UNIQUE NOT NULL,
        motdepasse TEXT  NOT NULL
    )`,
  teachers: `CREATE TABLE IF NOT EXISTS teachers (
        id      INTEGER PRIMARY KEY AUTOINCREMENT,
        matricule TEXT    UNIQUE NOT NULL,
        nom     TEXT    NOT NULL,
        prenom    TEXT    NOT NULL,
        user_id INTEGER UNIQUE,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`,
  students: `CREATE TABLE IF NOT EXISTS students (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        matricule TEXT    UNIQUE NOT NULL,
        nom       TEXT    NOT NULL,
        prenom    TEXT    NOT NULL,
        date_naissance       TEXT NOT NULL,
        classe_id INTEGER NOT NULL,
        user_id   INTEGER UNIQUE,
        FOREIGN KEY (classe_id) REFERENCES classes(id),
        FOREIGN KEY (user_id)   REFERENCES users(id)
    )`,
  subjects: `CREATE TABLE IF NOT EXISTS subjects (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        nom        TEXT    NOT NULL,
        classe_id  INTEGER NOT NULL,
        teacher_id INTEGER,
        UNIQUE(nom, classe_id),
        FOREIGN KEY (classe_id)  REFERENCES classes(id),
        FOREIGN KEY (teacher_id) REFERENCES teachers(id)
    )`,
  grades: `CREATE TABLE IF NOT EXISTS grades (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        subject_id INTEGER NOT NULL,
        note       REAL    NOT NULL,
        date       TEXT    NOT NULL,
        type       TEXT    NOT NULL DEFAULT 'devoir',
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (subject_id) REFERENCES subjects(id)
    )`,
  absences: `CREATE TABLE IF NOT EXISTS absences (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        date       TEXT    NOT NULL,
        status     TEXT    NOT NULL CHECK (status IN ('absent', 'retard', 'present')),
        justifie   INTEGER NOT NULL DEFAULT 0 CHECK (justifie IN (0, 1)),
        motif      TEXT,
        FOREIGN KEY (student_id) REFERENCES students(id)
    )`,
  activites: `CREATE TABLE IF NOT EXISTS activites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT NOT NULL,
        type TEXT NOT NULL,
        date_creation TEXT NOT NULL
    )`,
};

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function main() {
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    console.error("❌ TURSO_DATABASE_URL et TURSO_AUTH_TOKEN doivent être définis (fichier .env).");
    process.exit(1);
  }

  console.log("📂 Ouverture de la base locale:", LOCAL_DB_PATH);
  const local = new Database(LOCAL_DB_PATH, { readonly: true });

  console.log("🌐 Connexion à Turso...");
  const remote = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  await remote.execute("PRAGMA foreign_keys = OFF;");

  console.log("🛠️  Création du schéma sur Turso (IF NOT EXISTS)...");
  for (const table of TABLES_IN_ORDER) {
    await remote.execute(SCHEMA[table]);
  }

  if (RESET) {
    console.log("🧹 --reset : suppression des données existantes sur Turso...");
    for (const table of [...TABLES_IN_ORDER].reverse()) {
      await remote.execute(`DELETE FROM ${table};`);
    }
    await remote.execute(
      `DELETE FROM sqlite_sequence WHERE name IN (${TABLES_IN_ORDER.map((t) => `'${t}'`).join(",")});`
    );
  }

  for (const table of TABLES_IN_ORDER) {
    const rows = local.prepare(`SELECT * FROM ${table}`).all();
    if (rows.length === 0) {
      console.log(`⏭️  ${table}: aucune ligne à migrer.`);
      continue;
    }

    const columns = Object.keys(rows[0]);
    const placeholders = columns.map(() => "?").join(", ");
    const sql = `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`;

    const statements = rows.map((row) => ({
      sql,
      args: columns.map((c) => row[c]),
    }));

    let inserted = 0;
    for (const batchChunk of chunk(statements, 25)) {
      await remote.batch(
        batchChunk.map((s) => ({ sql: s.sql, args: s.args })),
        "write"
      );
      inserted += batchChunk.length;
    }
    console.log(`✅ ${table}: ${inserted}/${rows.length} lignes migrées.`);
  }

  await remote.execute("PRAGMA foreign_keys = ON;");

  local.close();
  console.log("🎉 Migration terminée avec succès.");
}

main().catch((err) => {
  console.error("❌ Erreur pendant la migration:", err);
  process.exit(1);
});