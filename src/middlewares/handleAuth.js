export const handleAuth = (...roles) =>{ //roles => ["admin", "user"] (es un array de los roles que pasemos)
    return (req, res, next) => {
        
        if(!req.user) return res.status(401).json({error: "No hay usuario"})
        if(!roles.includes(req.user.user.rol)) return res.status(403).json({error: "No tienes permisos"})
        
        next()
    }
}