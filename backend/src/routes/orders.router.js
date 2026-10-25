import express from "express"
import { db } from "../config/firebase.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/", authMiddleware, adminMiddleware(["admin", "superadmin"]), async function (req, res) {
    const { teacherId, tools, state } = req.body;
    if (!teacherId || !tools || !state) {
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
        userId: req.user.id,
        teacherId,
        tools : tools.map(function(tool){
            return{
                toolId : tool.toolId,
                quantityOrder : Number(tool.quantityOrder),
                quantityReturned : 0
            }
        }),
        state,
        createdAt: new Date(),
        updatedAt: null
    }

    const orderRef = await db.collection("orders").add(order);
    res.status(201).json({
        status: "success",
        message: "Pedido creado",
        payload: order
    })

})


router.get("/", authMiddleware, adminMiddleware(["admin", "superadmin"]), async function (req, res) {
    const ordersDB = await db.collection("orders").get();
    const orders = []
    for (const orderDoc of ordersDB.docs) {
        const order = orderDoc.data();

        const teacherDoc = await db.collection("users").doc(order.teacherId).get();
        const teacher = teacherDoc.data();

        const userDoc = await db.collection("users").doc(order.userId).get();
        const user = userDoc.data();

        const tools = []
        for (const item of order.tools) {
            const toolDoc = await db.collection("tools").doc(item.toolId).get();
            const tool = toolDoc.data();
            tools.push({
                id: toolDoc.id,
                name: tool.name,
                state: tool.state,
                brand: tool.brand,
                serialized: tool.serialized,
                consumable: tool.consumable,
                quantityOrder: item.quantityOrder,
                quantityReturned: item.quantityReturned || 0
            })
        }

        orders.push({
            id: orderDoc.id,
            state: order.state,
            createdAt: new Date(order.createdAt.seconds * 1000).toLocaleString("es-AR"),
            user: {
                id: userDoc.id,
                name: user.name
            },
            teacher: {
                id: teacherDoc.id,
                name: teacher.name
            },
            tools
        })

    }
    res.status(200).json({
        status: "success",
        message: "Lista de pedidos",
        payload: orders
    })
})

router.get("/:id", async function (req, res) {
    const orderId = req.params.id;

    const orderRef = db.collection("orders").doc(orderId);
    const order = await orderRef.get();
    if (!order.exists) {
        return res.status(404).json({
            status: "error",
            message: "Pedido no encontrado"
        })
    }

    const tools = []
    for (const item of order.data().tools) {
        const toolDoc = await db.collection("tools").doc(item.toolId).get();
        const tool = toolDoc.data();
        tools.push({
            id: toolDoc.id,
            name: tool.name,
            state: tool.state,
            brand: tool.brand,
            serialized: tool.serialized,
            consumable: tool.consumable,
            quantityOrder: item.quantityOrder,
            quantityReturned: item.quantityReturned || 0
        })
    }

    res.status(200).json({
        status: "success",
        message: "orden obtenida",
        payload: {
            id: order.id,
            ...order.data(),
            tools
        }
    })


})

router.put("/:id", authMiddleware, adminMiddleware(["admin", "superadmin"]), async function (req, res) {
    const orderId = req.params.id;
    const toolsData = req.body.tools
    
    const orderRef = db.collection("orders").doc(orderId);
    const order = await orderRef.get();
    if (!order.exists) {
        return res.status(404).json({
            status: "error",
            message: "Pedido no encontrado"
        })
    }
    const orderData = order.data();
    for(const item of toolsData){
        console.log(item)
        const toolOrder = orderData.tools.find(function(tool){
            return tool.toolId === item.toolId
        })
        //Actualizar stock de herramienta
        const toolRef = db.collection("tools").doc(item.toolId)
        const tool = await toolRef.get()
        const newQuantity = Number(tool.data().quantity) + Number(item.quantityToReturn)
        await toolRef.update({ quantity : newQuantity })
        toolOrder.quantityReturned = Number(toolOrder.quantityReturned) + Number(item.quantityToReturn)
    }
    let state = "completado"
    for(const tool of orderData.tools){
        if(Number(tool.quantityReturned) < Number(tool.quantityOrder)){
            state = "pendiente"
        }
    }
    await orderRef.update({
        tools: orderData.tools,
        state,
        updatedAt : new Date()
    })
    res.status(200).json({
        status: "success",
        message: "Pedido completado",
        payload: {
            id: orderRef.id,
            state
        }
    })

})
export default router;