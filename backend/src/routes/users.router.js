import express, { Router } from "express";
import { db } from "../config/firebase.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", authMiddleware, async function (req, res){
    const id = req.user.id;
    const userDB = await db.collection("users").doc(id).get();

    if(userDB.exists === false){
        return res.status(404).json({
            message: "usuario no encontrado"
        })
    }
    
    res.status(200).json({
        id: userDB.id,
        username :  userDB.data().username,
        role : userDB.data().role
    })
});

router.get("/", async function (req, res){
    const usersDB = await db.collection("users").get();
    const users = usersDB.docs.map((userDb)=> {
        return { id: userDb.id, ...userDb.data() }
    });

    res.status(200).json({
        message : "Lista de usuarios",
        users
    })
});

router.put("/:id/role", authMiddleware, adminMiddleware(["admin", "superadmin"]), async function (req, res){
    const id = req.params.id;
    const role = req.body.role;
    const userDB = await db.collection("users").doc(id);

    if(userDB.exists === false){
        return res.status(404).json({
            message: "usuario no encontrado"
        })
    }

    await userDB.update({ role });

    res.status(200).json({
        message: "Rol actualizado correctamente",
        id,
        role
    })
})

router.get("/:id", async function (req, res){
    const id = req.params.id;
    const userDB = await db.collection("users").doc(id).get();

    if(userDB.exists === false){
        return res.status(404).json({
            message: "usuario no encontrado"
        })
    }
    
    res.status(200).json({
        id: userDB.id,
        username :  userDB.data().username,
        role : userDB.data().role
    })
});

router.delete("/:id", authMiddleware, adminMiddleware(["superadmin"]), async function (req, res){
    const id = req.params.id;
    const userDB = await db.collection("users").doc(id);
    if(userDB.exists === false){
        return res.status(404).json({
            message: "usuario no encontrado"
        })
    }
    await userDB.delete();
    
    res.status(200).json({
        message : "Usuario eliminado correctamente",
        id
    })
})



export default router;
