import express from "express";
import { db } from "../config/firebase.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware(["admin", "superadmin"]), async function (req, res) {
    const { name, state, available, quantity, brand, section, serialized } = req.body;
    if (!name || !state || typeof available !== "boolean" || !quantity || !brand || !section || !serialized) {
        return res.status(400).json({
            status: "error",
            message: "Falta completar campos"
        })

    }
    const docRef = await db.collection("tools").add({ name, state, available, quantity, brand, section, serialized });

    res.status(201).json({
        status: "success",
        message: "herramienta añadida correctamente",
        payload: { id: docRef.id }
    })
})

router.get("/", authMiddleware, async function (req, res) {
    const toolsDB = await db.collection("tools").get();
    const tools = toolsDB.docs.map((toolsDB) => {
        return { id: toolsDB.id, ...toolsDB.data() }
    });

    res.status(200).json({
        status: "success",
        message: "lista de herramientas",
        payload: [...tools]
    })
});

router.get("/:id", authMiddleware, async function (req, res) {
    const id = req.params.id;
    const toolsDB = await db.collection("tools").doc(id).get();

    if (toolsDB.exists === false) {
        return res.status(404).json({
            status: "error",
            message: "Herramienta no encontrada"
        })
    }

    res.status(200).json({
        status: "success",
        message: "Herramienta obtenida",
        payload: {
            id: toolsDB.id,
            ...toolsDB.data()
        }
    })
})

router.delete("/:id", authMiddleware, adminMiddleware(["admin", "superadmin"]), async function (req, res) {
    const id = req.params.id;

    const toolsRef = db.collection("tools").doc(id);
    const tool = await toolsRef.get();
    if (!tool.exists) {
        return res.status(404).json({
            status: "error",
            message: "Herramienta no encontrada"
        })
    }
    await toolsRef.delete();

    res.status(200).json({
        status: "success",
        message: "Herramienta eliminada correctamente",
        payload: { id }
    })
})

router.put("/:id", authMiddleware, adminMiddleware(["admin", "superadmin"]), async function (req, res) {
    const id = req.params.id;
    const { name, state, available, quantity, brand, section, serialized } = req.body;

    const toolsRef = db.collection("tools").doc(id);
    const tool = await toolsRef.get();

    if (!tool.exists) {
        return res.status(404).json({
            status: "error",
            message: "Herramienta no encontrada"
        })
    }
    await toolsRef.update({ name, state, available, quantity, brand, section, serialized });

    res.status(200).json({
        status: "success",
        message: "Herramienta actualizada correctamente",
        payload: {
            id: toolsRef.id,
            name,
            state,
            available,
            quantity,
            brand,
            section,
            serialized
        }
    })


})
export default router;