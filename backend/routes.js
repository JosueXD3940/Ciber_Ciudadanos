import express from "express";
import { existeEmail, existeUsuario, guardarUsuario } from "./database.js";

const router = express.Router();

/* Registro: validación y captcha en una sola petición */
router.post("/register", async (req, res) => {
    const { username, email, password, confirmPassword, captcha, captchaCorrecto } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!emailRegex.test(email)) {
        return res.json({ ok: false, mensaje: "Email inválido" });
    }

    if (!passwordRegex.test(password)) {
        return res.json({ ok: false, mensaje: "La contraseña debe tener al menos una mayúscula y un número" });
    }

    if (password !== confirmPassword) {
        return res.json({ ok: false, mensaje: "Las contraseñas no coinciden" });
    }

    if (parseInt(captcha) !== captchaCorrecto) {
        return res.json({ ok: false, mensaje: "Captcha incorrecto" });
    }

    try {
        if (await existeEmail(email)) {
            return res.json({ ok: false, mensaje: "El email ya está registrado" });
        }
        if (await existeUsuario(username)) {
            return res.json({ ok: false, mensaje: "El usuario ya existe" });
        }

        await guardarUsuario(username, email);
        return res.json({ ok: true, mensaje: "Registro exitoso ✅" });
    } catch (err) {
        console.error(err);
        if (err.code === "ER_DUP_ENTRY") {
            return res.json({ ok: false, mensaje: "El usuario o el email ya existen" });
        }
        return res.status(500).json({ ok: false, mensaje: "Error al guardar en la base de datos" });
    }
});

export default router;
