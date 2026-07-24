import jwt from 'jsonwebtoken';
import { getUserByPseudo } from '../services/userService.js';


const login = (req,res) => {
    try {
        const { pseudoname, motdepasse } = req.body;
        const user = getUserByPseudo(pseudoname);

        if(!user){
            return res.status(401).json({error: "Identifiants invalides"});
        }

        if(user.motdepasse !== motdepasse){
             return res.status(401).json({error: "Identifiants invalides"});
        }

        // génération du token 
        const token = jwt.sign(
        {id: user.id, role: user.role}, 
            process.env.JWT_SECRET,
            {expiresIn: '3h'}
        );

        res.json({ token });

    } catch (error) {
        res.status(500).json({error: 'Une erreur est survenue'});
    }
}

export { login }