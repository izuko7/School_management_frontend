import db from "../db/database.js";
import dayjs from "dayjs";

// Créer une activité
const creerActivite = (message, type) => {
    const date_creation = dayjs().format("DD/MM/YYYY HH:mm:ss");

    const insertActivite = db.prepare(`
        INSERT INTO activites (message, type, date_creation)
        VALUES (?, ?, ?)
    `);

    const result = insertActivite.run(message, type, date_creation);
    return result;
};

// Afficher les activités récentes 
const getActivitiesRecentes = (limite = 10) => {
    return db.prepare(`
            SELECT * FROM activites
            ORDER BY id DESC
            LIMIT ?
        `).all(limite);
};


export { creerActivite, getActivitiesRecentes };