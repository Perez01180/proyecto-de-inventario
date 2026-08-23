import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({
            status : "error",
            message : "token no enviado"

        })
    }

    const [type, token] = authHeader.split(" ");
    if(!token){
        return res.status(401).json({
            status : "error",
            message : "formato de token incorrecto"
        })
    }

    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            status :  "error",
            message : "token invalido o vencido"
        })
    }
}

function adminMiddleware (roles){
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                status :  "error",
                message : "no tenés permisos para acceder."
            })
        }
        next();
    }
}

export {authMiddleware, adminMiddleware}