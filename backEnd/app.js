const { searchPeople } = require("./src/services/prospeoService");
const { enrichPerson } = require("./src/services/enrichPersonService");
const { sendEmail } = require("./src/services/brevoService");

async function main() {
    try {
        const leads = await searchPeople("microsoft.com");

        if (!leads || leads.length === 0) {
            console.log("No leads found");
            return;
        }

        const lead = leads[0];

        console.log("\nLead Found:");
        console.table([lead]);

        const enrichedLead = await enrichPerson(
            lead.personId
        );

        if (!enrichedLead?.email) {
            console.log("No verified email found");
            return;
        }

        console.log("\nEnriched Lead:");
        console.table([enrichedLead]);

        await sendEmail(
            "rehanhussain0842@gmail.com", // send to yourself for testing
            "Rehan"
        );

        console.log("\nPipeline Completed Successfully!");

    } catch (error) {
        console.error(error);
    }
}

main();