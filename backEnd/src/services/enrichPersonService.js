const axios = require("axios");
require("dotenv").config();

async function enrichPerson(personId) {
    try {
        const response = await axios.post(
            "https://api.prospeo.io/enrich-person",
            {
                only_verified_email: true,
                data: {
                    person_id: personId
                }
            },
            {
                headers: {
                    "X-KEY": process.env.PROSPEO_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        const person = response.data.person;

        const enrichedLead = {
            personId: person.person_id,
            name: person.full_name,
            title: person.current_job_title,
            linkedin: person.linkedin_url,
            email: person.email?.email,
            emailStatus: person.email?.status
        };

        console.log("\nEnriched Lead:");
        console.table([enrichedLead]);

        return enrichedLead;

    } catch (error) {
        console.error(
            "Enrich Error:",
            error.response?.data || error.message
        );

        return null;
    }
}

module.exports = {
    enrichPerson
};