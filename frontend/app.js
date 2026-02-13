const { createApp } = Vue;

createApp({

    data() {
        return {
            form: {
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
                captcha: ''
            },
            captcha: {
                a: Math.floor(Math.random() * 10),
                b: Math.floor(Math.random() * 10)
            },
            passwordError: false,
            mensaje: ''
        }
    },

    computed: {
        formValido() {
            return this.form.username &&
                   this.form.email &&
                   this.form.password.length >= 8 &&
                   !this.passwordError &&
                   this.form.confirmPassword &&
                   this.form.captcha !== '';
        }
    },

    methods: {

        validarPassword() {
            const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
            this.passwordError = !regex.test(this.form.password);
        },

        async enviarFormulario() {
            this.mensaje = "";

            try {
                const respuesta = await fetch("/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: this.form.username,
                        email: this.form.email,
                        password: this.form.password,
                        confirmPassword: this.form.confirmPassword,
                        captcha: this.form.captcha,
                        captchaCorrecto: this.captcha.a + this.captcha.b
                    })
                });

                const data = await respuesta.json();

                this.mensaje = data.mensaje || "Error desconocido";

                if (data.ok && data.mensaje === "Registro exitoso ✅") {
                    this.resetFormulario();
                }

            } catch (error) {
                this.mensaje = "Error al conectar con el servidor";
            }
        },

        cambiarCaptcha() {
            this.captcha = {
                a: Math.floor(Math.random() * 10),
                b: Math.floor(Math.random() * 10)
            };
            this.form.captcha = '';
        },

        resetFormulario() {
            this.form = {
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
                captcha: ''
            };
            this.captcha = {
                a: Math.floor(Math.random() * 10),
                b: Math.floor(Math.random() * 10)
            };
        }
    }

}).mount("#app");
