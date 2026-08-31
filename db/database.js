import { connect } from "@tursodatabase/serverless";

const db = connect({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

// équivalent de db.pragma('foreign_keys = ON') en asynchrone
await (await db.prepare("PRAGMA foreign_keys = ON")).run();

export default db;