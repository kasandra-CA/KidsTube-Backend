const fetch = require("node-fetch");

async function sendVerificationEmail(email, token) {
    const verificationLink = `http://localhost:5500/verify.html?token=${token}`;

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "api-key": "api aqui",
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            sender: {
                name: "KidsTube",
                email: "ireleon1503@gmail.com"
            },
            to: [{ email: email }],
            subject: "📧 Verifica tu cuenta en KidsTube",
            htmlContent: `
    <h2>¡Bienvenido a KidsTube!</h2>
    <p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
    <a href="${verificationLink}" target="_blank" rel="noopener" style="color:#d63384;">
        Verificar cuenta
    </a>
    <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
`

        })
    });

    const result = await response.json();

    if (!response.ok) {
        console.error("❌ Error al enviar correo:", result);
        throw new Error(result.message || "No se pudo enviar el correo.");
    }

    console.log("📨 Correo enviado correctamente:", result);
}

module.exports = { sendVerificationEmail };
