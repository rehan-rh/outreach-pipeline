const axios = require("axios");
require("dotenv").config();

async function getSimilarCompanies(domain) {
    try {
        const response = await axios.post(
            "https://api.ocean.io/v3/search/companies",
            {
                size: 10,
                companiesFilters: {
                    lookalikeDomains: [domain]
                },
                fields: ["domain", "name"]
            },
            {
                headers: {
                    "x-api-token": process.env.OCEAN_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        const companies = response.data.companies.map(item => ({
            name: item.company.name,
            website: item.company.domain
        }));

        console.table(companies);

        return companies;

    } catch (error) {
        console.error(
            error.response?.data || error.message
        );

        return [];
    }
}

module.exports = {
    getSimilarCompanies
};