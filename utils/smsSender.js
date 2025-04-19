const { Vonage } = require('@vonage/server-sdk');

const vonage = new Vonage({
    apiKey: "30a13415",
    apiSecret: "8TK4lwvM2ex6HFF4"
});

const sendSMS = async (to, code) => {
    return new Promise((resolve, reject) => {
        vonage.sms.send(
            {
                to,
                from: "KidsTube",
                text: `Tu código de verificación es: ${code}`
            },
            (err, responseData) => {
                if (err) {
                    console.error("❌ Error al enviar SMS:", err);
                    reject(err);
                } else {
                    console.log("✅ SMS enviado:", responseData);
                    resolve(responseData);
                }
            }
        );
    });
};

module.exports = { sendSMS };