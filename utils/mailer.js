// utils/mailer.js
const axios = require("axios");

const MAILTRAP_TOKEN = "94b2ca58d7d29b83c8382a908c1a7887";
const verificationURLBase = "http://localhost:3000/api/verify";

const sendVerificationEmail = async (email, token) => {
    const verificationURL = `${verificationURLBase}/${token}`;

    try {
        const response = await axios.post(
            "https://send.api.mailtrap.io/api/send",
            {
                from: {
                    email: "no-reply@kidstube.com",
                    name: "KidsTube"
                },
                to: [{ email }],
                subject: "Verifica tu cuenta",
                html: `
                    <h3>¡Bienvenido a KidsTube!</h3>
                    <p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
                    <a href="${verificationURL}">${verificationURL}</a>
                `
            },
            {
                headers: {
                    Authorization: `Bearer ${MAILTRAP_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("✅ Correo enviado con Mailtrap REST API:", response.status);
    } catch (error) {
        console.error("❌ Error al enviar email:", error.response?.data || error.message);
    }
};

module.exports = { sendVerificationEmail };
