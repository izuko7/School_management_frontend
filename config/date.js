import dayjs from "dayjs";
import 'dayjs/locale/fr.js';


// Locale français
dayjs.locale('fr');


// Obtenir la date et l'heure actuelle
const now = () => dayjs().format('DD/MM/YYYY HH:mm:ss');


// Formater une date 
const formatDate = (date)=> dayjs(date).format('DD/MM/YYYY');


export { dayjs, now, formatDate };
