import jwt from 'jsonwebtoken';
import { getUserByPseudo } from '../services/userService.js';
import { logAuth, logWarn, logError } from '../utils/logger.js';

const login = async (req, res) => {
    try {
        const { pseudoname, motdepasse } = req.body;
        const user = await getUserByPseudo(pseudoname);

        if (!user) {
            logWarn(`Tentative de connexion échouée : Identifiant invalide`);
            return res.status(401).json({ error: "Identifiants invalides" });
        }

        if (user.motdepasse !== motdepasse) {
            logWarn(`Tentative de connexion échouée : mot de passe incorrect`);
            return res.status(401).json({ error: "Identifiants invalides" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        logAuth(`connexion réussie : utilisateur ${pseudoname}`);

        res.json({ token, role: user.role });

    } catch (error) {
        console.error('Erreur login:', error);
        logError(`Erreur lors de la connexion : ${error.message}`);
        res.status(500).json({ error: 'Une erreur est survenue' });
    }
};

export { login };