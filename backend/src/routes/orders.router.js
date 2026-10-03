import express from "express"
import { db } from "../config/firebase.js";


const router = express.Router();

router.post("/", async function (req, res) {
    const { userId, tools, status } = req.body;
    if (!userId || !tools || !status) {
        res.status(400).json({
            status: "error",
            message: "faltan campos en el pedido"
        })
    }

    const user = await db.collection("users").doc(userId).get();
    if (!user.exists) {
        res.status(404).json({
            status: "error",
            message: "Usuario no encontrado"
        })
    }

    for (const item of tools) {
        const toolRef = db.collection("tools").doc(item.toolId);
        const toolDoc = await toolRef.get();
        const tool = toolDoc.data();
        //descontar Stock
        await toolRef.update({ quantity: Number(tool.quantity) - Number(item.quantity) })
    }

    const order = {
        userId,
        tools,
        status,
        createdAt : new Date(),
        updatedAt : null
    }

    const orderRef = await db.collection("orders").add(order);
    res.status(201).json({
        status : "success",
        message : "Pedido creado",
        payload : order
    })

})

export default router;