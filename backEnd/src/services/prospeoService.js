const axios = require("axios");
require("dotenv").config();

async function searchPeople(companyDomain) {
  try {
    const response = await axios.post(
      "https://api.prospeo.io/search-person",
      {
        page: 1,
        filters: {
          company: {
            websites: {
              include: [companyDomain],
            },
          },
          person_seniority: {
            include: ["Founder/Owner"],
          },
        },
      },
      {
        headers: {
          "X-KEY": process.env.PROSPEO_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    const leads = response.data.results
      .filter((item) => {
        const title = item.person.current_job_title?.toLowerCase() || "";

        return (
          title.includes("founder") ||
          title.includes("ceo") ||
          title.includes("owner") ||
          title.includes("director") ||
          title.includes("vp") ||
          title.includes("president")
        );
      })
      .map((item) => ({
        personId: item.person.person_id,
        name: item.person.full_name,
        title: item.person.current_job_title,
        linkedin: item.person.linkedin_url,
        email: item.person.email?.email,
        company: item.company?.name,
        companyDomain: item.company?.domain,
      }));

    console.table(leads);

    return leads;
  } catch (error) {
    console.error("Prospeo Error:", error.response?.data || error.message);
    return [];
  }
}

module.exports = {
  searchPeople,
};
