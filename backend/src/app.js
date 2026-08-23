import express, { response } from "express";
import cors from "cors";
import { db } from "./config/firebase.js";
import usersRouter from "./routes/users.router.js";
import { authMiddleware, adminMiddleware } from "./middlewares/auth.middleware.js";
import authRouter from "./routes/auth.router.js";
import dotenv from "dotenv";

//Inicializamos las variables de entorno
dotenv.config();

const app = express();

//configuracion para aceptar JSON en el body
app.use(express.json());
//configuracion para poder conectarme desde el frontend
app.use(cors());

const users = [];

//Rutas
app.use("/api/v2/users", usersRouter);

app.use("/api/v2/auth", authRouter);

app.listen(8080, function () {
    console.log("servidor funcionando")
});