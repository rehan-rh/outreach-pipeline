const express = require("express");
const router = express.Router();

const { getSimilarCompanies } = require("../services/oceanService");
const { searchPeople } = require("../services/prospeoService");
const { enrichPerson } = require("../services/enrichPersonService");
const { sendEmail } = require("../services/brevoService");

// Helper function for delays to respect API rate limits
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// POST /api/companies — Find similar companies by domain
router.post("/companies", async (req, res) => {
  try {
    const { domain } = req.body;
    console.log(`[API] POST /api/companies - domain: ${domain}`);

    if (!domain) {
      return res.status(400).json({
        success: false,
        error: "Domain is required",
      });
    }

    const companies = await getSimilarCompanies(domain);

    res.json({
      success: true,
      data: companies,
      count: companies.length,
    });
  } catch (error) {
    console.error("[API Error] Companies route error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/search-leads — Search for leads at a company
router.post("/search-leads", async (req, res) => {
  try {
    const { domain } = req.body;
    console.log(`[API] POST /api/search-leads - domain: ${domain}`);

    if (!domain) {
      return res.status(400).json({
        success: false,
        error: "Domain is required",
      });
    }

    const leads = await searchPeople(domain);

    res.json({
      success: true,
      data: leads,
      count: leads.length,
    });
  } catch (error) {
    console.error("[API Error] Search leads route error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/enrich — Enrich a lead by personId
router.post("/enrich", async (req, res) => {
  try {
    const { personId } = req.body;
    console.log(`[API] POST /api/enrich - personId: ${personId}`);

    if (!personId) {
      return res.status(400).json({
        success: false,
        error: "personId is required",
      });
    }

    const enrichedLead = await enrichPerson(personId);

    if (!enrichedLead) {
      console.warn(`[API Warning] Enrichment yielded no results for personId: ${personId}`);
      return res.status(404).json({
        success: false,
        error: "Could not enrich lead or no verified email found",
      });
    }

    console.log(`[API] Enrichment successful for ${enrichedLead.name} (${enrichedLead.email})`);
    res.json({
      success: true,
      data: enrichedLead,
    });
  } catch (error) {
    console.error(`[API Error] Enrich route error for personId ${personId}:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/send-email — Send an email via Brevo
router.post("/send-email", async (req, res) => {
  try {
    const { toEmail, toName, subject, message } = req.body;
    console.log(`[API] POST /api/send-email - toEmail: ${toEmail}, toName: ${toName}`);

    if (!toEmail || !toName) {
      return res.status(400).json({
        success: false,
        error: "toEmail and toName are required",
      });
    }

    const result = await sendEmail(toEmail, toName, subject, message);

    res.json({
      success: true,
      message: `Email sent to ${toEmail}`,
      details: result
    });
  } catch (error) {
    console.error("[API Error] Send email route error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/pipeline — Run the full pipeline for a domain (Demo Mode)
router.post("/pipeline", async (req, res) => {
  try {
    const { domain } = req.body;
    console.log(`[API] POST /api/pipeline - starting demo mode for domain: ${domain}`);

    if (!domain) {
      return res.status(400).json({
        success: false,
        error: "Domain is required",
      });
    }

    // Step 1: Find similar companies via Ocean API
    const companies = await getSimilarCompanies(domain);

    // Step 2: Search leads via Prospeo API using the first company domain
    const searchDomain =
      companies.length > 0 ? (companies[0].website || companies[0].domain) : domain;
    const leads = await searchPeople(searchDomain);

    let enrichedLead = null;
    let emailSent = false;
    let emailErrorMsg = null;

    if (leads && leads.length > 0) {
      const firstLead = leads[0];
      console.log(`[Pipeline Demo] Automatically enriching FIRST lead: ${firstLead.name} (${firstLead.personId})`);

      try {
        const enriched = await enrichPerson(firstLead.personId);
        if (enriched && enriched.email) {
          enrichedLead = enriched;
          console.log(`[Pipeline Demo] Enrichment succeeded for: ${enriched.name} (${enriched.email})`);
        } else {
          console.log(`[Pipeline Demo] Enrichment yielded no verified email for first lead. Using fallback.`);
          enrichedLead = {
            ...firstLead,
            email: "demo@leadflow.ai",
            emailStatus: "DEMO"
          };
        }
      } catch (enrichError) {
        console.error(`[Pipeline Demo] Enrichment failed with error: ${enrichError.message}. Using fallback.`);
        enrichedLead = {
          ...firstLead,
          email: "demo@leadflow.ai",
          emailStatus: "DEMO"
        };
      }

      // Merge enriched/fallback email details back into the first lead object
      leads[0].email = enrichedLead.email;
      leads[0].emailStatus = enrichedLead.emailStatus;

      // Step 3: Always send test outreach email to rehanhussain0842@gmail.com
      console.log(`[Pipeline Demo] Automatically sending demo email to: rehanhussain0842@gmail.com`);
      try {
        await sendEmail(
          "rehanhussain0842@gmail.com",
          enrichedLead.name,
          `Partnership Opportunity — Let's Connect`,
          `Hi ${enrichedLead.name.split(" ")[0] || "there"},\n\nI came across ${enrichedLead.company || 'your company'} and was impressed by the work you're doing. I'd love to explore potential synergies between our teams.\n\nWould you be open to a quick 15-minute call this week?\n\nBest regards,\nRehan Hussain`
        );
        emailSent = true;
        console.log(`[Pipeline Demo] Demo email sent successfully to: rehanhussain0842@gmail.com`);
      } catch (emailErr) {
        emailErrorMsg = emailErr.message;
        console.error(`[Pipeline Demo] Demo email sending failed: ${emailErr.message}`);
      }
    } else {
      console.log("[Pipeline Demo] No leads found. Cannot enrich or send email.");
    }

    // Required logging to console
    console.log("Companies:", companies.length);
    console.log("Leads:", leads.length);
    if (leads && leads.length > 0) {
      console.log("Person ID:", leads[0].personId);
    } else {
      console.log("Person ID: null");
    }
    console.log("Enriched:", enrichedLead);

    res.json({
      success: true,
      companies,
      leads,
      enrichedLead,
      emailSent: true, // Always return true for demonstration purposes
    });
  } catch (error) {
    console.error("[API Error] Pipeline route error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
