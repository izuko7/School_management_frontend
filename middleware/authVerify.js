import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // vérifier si authHeader existe 
    if(!authHeader){
        return res.status(401).json({message : 'Une erreur est survenue'});
    }

    try {
        const tokenVerifie = authHeader.split('Bearer ')[1];
        const decoded = jwt.verify(tokenVerifie, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({message : error.message});
    }
}


export { verifyToken }