import fs from 'fs';
import path from 'path';
import { dayjs, now } from '../config/date.js';

const logFile = path.join(import.meta.dirname, '../logs/app.log');


const writeLog = (level, message) => {
    const timestamp = now();
    const line = `[${timestamp}] [${level}] ${message}\n`;
    fs.appendFileSync(logFile, line);
};


// log info 
const logInfo = (message) =>{
    writeLog('INFO', message);
};

// log warning 
const logWarn = (message) => {
    writeLog('WARN', message);
};


// log authentification 
const logAuth = (message) => {
    writeLog('AUTH', message);
};


// log erreur 
const logError = (message) => {
    writeLog('ERROR', message);
};

// log succès 
const logSuccess = (message) => {
    writeLog('SUCCESS', message);
};

export { logInfo, logWarn, logAuth, logError, logSuccess}
