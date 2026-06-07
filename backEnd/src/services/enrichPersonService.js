const axios = require("axios");
require("dotenv").config();

async function enrichPerson(personId) {
    try {
        console.log(`[Enrich] Querying Prospeo enrichment for personId: ${personId}`);
        
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

        console.log("[Enrich] Prospeo response status:", response.status);
        
        const person = response.data?.person;
        if (!person) {
            console.warn("[Enrich] Prospeo response did not contain a person object:", response.data);
            return null;
        }

        const enrichedLead = {
            personId: person.person_id || personId,
            name: person.full_name || "",
            title: person.current_job_title || "",
            linkedin: person.linkedin_url || "",
            email: person.email?.email || null,
            emailStatus: person.email?.status || "Pending"
        };

        console.log(`[Enrich] Success: ${enrichedLead.name} - ${enrichedLead.email} (${enrichedLead.emailStatus})`);
        return enrichedLead;

    } catch (error) {
        console.error(
            "[Enrich] Error querying Prospeo API:",
            error.response?.data || error.message
        );
        return null;
    }
}

module.exports = {
    enrichPerson
};