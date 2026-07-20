import Database from "better-sqlite3";
import path from "path";

// création de la base de donnée
const db = new Database(path.join(import.meta.dirname, 'database.db'));

// activation des clés étrangères
db.pragma('foreign_keys = ON');

export default db;