import jwt from "jsonwebtoken"

const JWT_SECRET = "miclavesecreta";

function authMiddleware(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({
            message : "token no enviado"

        })
    }

    const [type, token] = authHeader.split(" ");
    if(!token){
        return res.status(401).json({
            message : "formato de token incorrecto"
        })
    }

    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message : "token invalido o vencido"
        })
    }
}

function adminMiddleware (req, res, next){
    if(req.user.role !== "admin"){
        return res.status(403).json({
            message : "no tenés permisos para acceder."
        })
    }
    next();
}

export {authMiddleware, adminMiddleware}