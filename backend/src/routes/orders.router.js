import express from "express"
import { db } from "../config/firebase.js";
import { authMiddleware, adminMiddleware} from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/", authMiddleware, adminMiddleware(["admin", "superadmin"]), async function (req, res) {
    const { teacherId, tools, status } = req.body;
    if (!teacherId || !tools || !status) {
        res.status(400).json({
            status: "error",
            message: "faltan campos en el pedido"
        })
    }

    const teacher = await db.collection("users").doc(teacherId).get();
    if (!teacher.exists) {
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
        await toolRef.update({ quantity: Number(tool.quantity) - Number(item.quantityOrder) })
    }

    const order = {
        userId : req.user.id,
        teacherId,
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


router.get("/", authMiddleware, adminMiddleware(["admin", "superadmin"]), async function (req, res){
    const ordersDB = await db.collection("orders").get();
    const orders = []
    for(const orderDoc of ordersDB.docs){
        const order = orderDoc.data();

        const teacherDoc = await db.collection("users").doc(order.teacherId).get();
        const teacher = teacherDoc.data();

        const userDoc = await db.collection("users").doc(order.userId).get();
        const user = userDoc.data();

        const tools = []
        for(const item of order.tools){
            const toolDoc = await db.collection("tools").doc(item.toolId).get();
            const tool = toolDoc.data();
            tools.push({
                id : toolDoc.id,
                name : tool.name,
                state : tool.state,
                brand : tool.brand,
                serialized : tool.serialized,
                consumable : tool.consumable,
                quantityOrder : item.quantityOrder
            })
        }

        orders.push({
            id : orderDoc.id,
            state : order.status,
            createdAt : new Date(order.createdAt.seconds *1000).toLocaleString("es-AR"),
            user : {
                id : userDoc.id,
                name :user.name
            },
            teacher : {
                id : teacherDoc.id,
                name : teacher.name
            },
            tools
        })

    }
    res.status(200).json({
        status : "success",
        message : "Lista de pedidos",
        payload : orders
    })
})
export default router;