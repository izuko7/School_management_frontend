
const checkRole = (...rolesAutorises) => {
    return (req, res, next) => {
        const roleChecker = rolesAutorises.includes(req.user.role);
        if(!roleChecker){
            return res.status(403).json({message: `Rôle interdit`})
        }
        next();
    }
}

export { checkRole }