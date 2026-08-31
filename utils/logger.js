import fs from 'fs';
import path from 'path';
import { dayjs, now } from '../config/date.js';

const logDir = path.join(import.meta.dirname, '../logs');
const logFile = path.join(logDir, 'app.log');

// Crée le dossier logs/ s'il n'existe pas encore
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const writeLog = (level, message) => {
    const timestamp = now();
    const line = `[${timestamp}] [${level}] ${message}\n`;
    fs.appendFileSync(logFile, line);
};