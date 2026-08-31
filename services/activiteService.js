import db from "../db/database.js";
import dayjs from "dayjs";

// Créer une activité
const creerActivite = async (message, type) => {
    const date_creation = dayjs().format("DD/MM/YYYY HH:mm:ss");

    const insertActivite = await db.prepare(`
        INSERT INTO activites (message, type, date_creation)
        VALUES (?, ?, ?)
    `);

    const result = await insertActivite.run([message, type, date_creation]);
    return result;
};

// Afficher les activités récentes
const getActivitiesRecentes = async (limite = 5) => {
    const stmt = await db.prepare(`
            SELECT * FROM activites
            ORDER BY id DESC
            LIMIT ?
        `);
    return await stmt.all([limite]);
};

export { creerActivite, getActivitiesRecentes };