import Database from "better-sqlite3";
import path from "path";
import { connect } from "@tursodatabase/serverless";

// création de la base de donnée
const db = connect({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

// const db = new Database(path.join(import.meta.dirname, 'database.db'));

// activation des clés étrangères
db.pragma('foreign_keys = ON');

export default db;