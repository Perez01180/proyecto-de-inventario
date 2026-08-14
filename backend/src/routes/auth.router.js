import express, { json } from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { db } from "../config/firebase.js";

const router = express.Router();

const JWT_SECRET = "miclavesecreta"

router.post("/register", async function (req, res) {
    const { name, lastname, dni, username, password } = req.body || {};
    //si algun campo no existe nos da mensaje de error.
    if (!name || !lastname || !dni || !username || !password ) {
        return res.status(400).json({
            status: "error",
            message: "Todos los campos son obligatorios"
        })
    }

    const userDB = await db.collection("users").where("username", "==", username).get();

    if (userDB.empty == false) {
        return res.status(400).json({
            status: "error",
            message: "El usuario ya existe"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        name,
        lastname,
        dni,
        username,
        password: hashedPassword,
        role: "user"
    }

    const result = await db.collection("users").add(newUser);

    res.status(201).json({
        status: "success",
        message: "usuario registrado correctamente",
        payload: { id: result.id }
    })
});

router.post("/login", async function (req, res) {
    const { username, password } = req.body || {}
    //si username o password no existen nos da mensaje de error.
    if (!username || !password) {
        return res.status(400).json({
            status: "error",
            message: "username y password son obligatorios"
        })
    }

    const userDB = await db.collection("users").where("username", "==", username).get();

    if (userDB.empty) {
        return res.status(400).json({
            status: "error",
            message: "usuario no encontrado"
        })
    }

    const user = { id: userDB.docs[0].id, ...userDB.docs[0].data() }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid === false) {
        return res.status(400).json({
            status: "error",
            message: "contraseña incorrecta"
        })
    }
    //creamos una llave de acceso para el usuario logueado
    const token = jwt.sign(
        {
            id: user.id,
            username: user.username,
            role: user.role
        },
        JWT_SECRET,
        { expiresIn: "1h" }
    )

    res.status(200).json({
        status: "success",
        message: "Logueado correctamente",
        payload: {
            id: user.id,
            token,
            role : user.role
        }
    })
})

export default router;
