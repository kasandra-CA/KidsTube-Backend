const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
        user: "a231cd3eb962b3",
        pass: "df1dd6182a1d30"
    }
});

const sendVerificationEmail = async (email, token) => {
    const verificationURL = `http://localhost:3000/api/verify/${token}`;

    await transporter.sendMail({
        from: '"KidsTube" <no-reply@kidstube.com>',
        to: email,
        subject: "Verifica tu cuenta",
        html: `
            <h3>¡Bienvenido a KidsTube!</h3>
            <p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
            <a href="${verificationURL}">${verificationURL}</a>
        `
    });
};

module.exports = { sendVerificationEmail };