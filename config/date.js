import dayjs from "dayjs";
import 'dayjs/locale/fr.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(customParseFormat);
dayjs.locale('fr');

const now = () => dayjs().format('DD/MM/YYYY HH:mm:ss');
const formatDate = (date) => dayjs(date).format('DD/MM/YYYY');

export { dayjs, now, formatDate };