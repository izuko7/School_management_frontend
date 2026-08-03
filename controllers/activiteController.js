import { getActivitiesRecentes } from "../services/activiteService.js";
import { logError } from "../utils/logger.js";


const getactivites = (req, res) => {
    try {
        const activites = getActivitiesRecentes();
        res.json(activites);
    } catch (error) {
        logError(`Erreur lors de la récupération de l'activité : ${error.message}`);
        res.status(500).json({error : "Une erreur est survenue"});
    }
};


export { getactivites }