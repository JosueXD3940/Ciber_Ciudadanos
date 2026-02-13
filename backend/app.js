import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes.js";
import { verificarConexion } from "./database.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Servir el frontend (página, CSS, JS) desde http://localhost:3000
app.use(express.static(path.join(__dirname, "..", "frontend")));

app.use("/", router);

app.listen(PORT, async () => {
    const url = `http://localhost:${PORT}`;
    console.log("\n  Servidor ejecutándose en:", url);
    try {
        await verificarConexion();
        console.log("  Base de datos MySQL: conectada y funcionando correctamente.\n");
    } catch (err) {
        console.log("  Base de datos MySQL: ERROR - no se pudo conectar.", err.message);
        console.log("  Asegúrate de tener XAMPP/MySQL encendido y la BD 'ciber_ciudadanos' creada.\n");
    }
});
