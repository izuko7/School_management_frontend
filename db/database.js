import Database from "better-sqlite3";

// création de la base de donnée

const db = new Database('database.db');

// activation des clés étrangères

db.pragma('foreign_keys = ON');

export default db;