import mysql from "mysql2/promise";

// Configuración para MySQL en XAMPP (ajusta usuario/contraseña si los cambiaste)
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "ciber_ciudadanos",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

/** Verifica que la conexión a MySQL funcione */
export async function verificarConexion() {
    const [rows] = await pool.execute("SELECT 1");
    return rows.length > 0;
}

export async function existeEmail(email) {
    const [rows] = await pool.execute(
        "SELECT id FROM usuarios WHERE email = ?",
        [email]
    );
    return rows.length > 0;
}

export async function existeUsuario(usuario) {
    const [rows] = await pool.execute(
        "SELECT id FROM usuarios WHERE usuario = ?",
        [usuario]
    );
    return rows.length > 0;
}

export async function guardarUsuario(usuario, email) {
    await pool.execute(
        "INSERT INTO usuarios (usuario, email) VALUES (?, ?)",
        [usuario, email]
    );
}
