const axios = require("axios");
require("dotenv").config();

async function sendEmail(toEmail, toName, subject, message) {
    try {
        const emailSubject = subject || "Outreach Pipeline Test";
        const emailBody = message
            ? `<div style="font-family: sans-serif; white-space: pre-line;">${message}</div>`
            : `
                    <h2>Hello ${toName}</h2>
                    <p>This email was sent using my outreach automation project.</p>
                `;

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
                subject: emailSubject,
                htmlContent: emailBody
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
        return response.data;
    } catch (error) {
        const errorDetails = error.response?.data || error.message;
        console.error("Brevo Error:", errorDetails);
        throw new Error(
            error.response?.data?.message || 
            (typeof errorDetails === "object" ? JSON.stringify(errorDetails) : errorDetails)
        );
    }
}

module.exports = { sendEmail };