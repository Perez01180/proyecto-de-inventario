import admin from "firebase-admin"
import credential from "../../sistema-de-inventario-7292d-firebase-adminsdk-fbsvc-676b83db15.json" with { type: "json" }

admin.initializeApp({ credential: admin.credential.cert(credential) });
export const db = admin.firestore();
