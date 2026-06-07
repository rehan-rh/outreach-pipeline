const axios = require("axios");
require("dotenv").config();

async function sendEmail(toEmail, toName) {
    try {
        const response = await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: {
                    name: "Rehan Hussain",
                    email: "rehanhussain0842@gmail.com"
                },
                to: [
                    {
                        email: toEmail,
                        name: toName
                    }
                ],
                subject: "Outreach Pipeline Test",
                htmlContent: `
                    <h2>Hello ${toName}</h2>
                    <p>This email was sent using my outreach automation project.</p>
                `
            },
            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("Email Sent Successfully!");
        console.log(response.data);

    } catch (error) {
        console.error(
            "Brevo Error:",
            error.response?.data || error.message
        );
    }
}

module.exports = { sendEmail };