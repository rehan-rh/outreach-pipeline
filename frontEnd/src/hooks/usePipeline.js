import { useState, useCallback } from "react";
import { pipelineAPI, emailAPI } from "../services/api";
import toast from "react-hot-toast";

const PIPELINE_STEPS = [
  { id: "domain", label: "Domain Input", icon: "Globe" },
  { id: "ocean", label: "Ocean API", icon: "Waves" },
  { id: "companies", label: "Similar Companies", icon: "Building2" },
  { id: "search", label: "Prospeo Search", icon: "Search" },
  { id: "enrich", label: "Enrichment", icon: "Sparkles" },
  { id: "email", label: "Brevo Email", icon: "Mail" },
  { id: "sent", label: "Email Sent", icon: "CheckCircle" },
];

export function usePipeline() {
  // Initialize state from localStorage for persistence across page navigation
  const [domain, setDomainState] = useState(() => localStorage.getItem("lf_domain") || "");
  const [currentStep, setCurrentStepState] = useState(() => Number(localStorage.getItem("lf_currentStep") || -1));
  const [isRunning, setIsRunning] = useState(false);
  const [companies, setCompaniesState] = useState(() => JSON.parse(localStorage.getItem("lf_companies") || "[]"));
  const [leads, setLeadsState] = useState(() => JSON.parse(localStorage.getItem("lf_leads") || "[]"));
  const [enrichedLead, setEnrichedLeadState] = useState(() => JSON.parse(localStorage.getItem("lf_enrichedLead") || "null"));
  const [emailsSentCount, setEmailsSentCountState] = useState(() => Number(localStorage.getItem("lf_emailsSentCount") || 0));
  const [error, setError] = useState(null);
  const [activities, setActivitiesState] = useState(() => JSON.parse(localStorage.getItem("lf_activities") || "[]"));

  // Helper setter wrappers to sync to localStorage
  const setDomain = (val) => {
    localStorage.setItem("lf_domain", val);
    setDomainState(val);
  };
  const setCurrentStep = (val) => {
    localStorage.setItem("lf_currentStep", val);
    setCurrentStepState(val);
  };
  const setCompanies = (val) => {
    localStorage.setItem("lf_companies", JSON.stringify(val));
    setCompaniesState(val);
  };
  const setLeads = (val) => {
    localStorage.setItem("lf_leads", JSON.stringify(val));
    setLeadsState(val);
  };
  const setEnrichedLead = (val) => {
    localStorage.setItem("lf_enrichedLead", JSON.stringify(val));
    setEnrichedLeadState(val);
  };
  const setEmailsSentCount = (val) => {
    localStorage.setItem("lf_emailsSentCount", String(val));
    setEmailsSentCountState(val);
  };
  const setActivities = (val) => {
    localStorage.setItem("lf_activities", JSON.stringify(val));
    setActivitiesState(val);
  };

  const addActivity = useCallback((type, message, data = null) => {
    setActivitiesState((prev) => {
      const updated = [
        {
          id: Date.now() + Math.random(),
          type,
          message,
          data,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ];
      localStorage.setItem("lf_activities", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const runPipeline = useCallback(
    async (inputDomain) => {
      const d = inputDomain || domain;
      if (!d) {
        toast.error("Please enter a domain");
        return;
      }

      setIsRunning(true);
      setError(null);
      setCurrentStep(0);
      setCompanies([]);
      setLeads([]);
      setEnrichedLead(null);
      setEmailsSentCount(0);

      try {
        // Step 1: Domain Input
        addActivity("domain", `Starting pipeline`);
        await new Promise((r) => setTimeout(r, 600));

        // Step 2: Ocean API - Similar Companies
        setCurrentStep(1);
        await new Promise((r) => setTimeout(r, 600));

        // Step 3: Prospeo Search
        setCurrentStep(3);
        await new Promise((r) => setTimeout(r, 600));

        // Step 4: Prospeo enrichment
        setCurrentStep(4);

        // Execute actual backend pipeline endpoint
        const res = await pipelineAPI.run(d);
        
        const companiesData = res.companies || [];
        const leadsData = res.leads || [];
        const enrichedData = res.enrichedLead || null;
        const emailSentStatus = res.emailSent || false;

        setCompanies(companiesData);
        setLeads(leadsData);
        setEnrichedLead(enrichedData);
        setEmailsSentCount(emailSentStatus ? 1 : 0);

        // Log completion events
        addActivity("companies", `Companies discovered`);
        addActivity("leads", `Leads discovered`);
        
        if (enrichedData) {
          addActivity("enrich", `Lead enriched`);
        } else {
          addActivity("enrich", `No enrichable lead found`);
        }

        // Handle auto email sending status
        if (emailSentStatus && enrichedData) {
          addActivity("email", `Email sent successfully`);
          toast.success(`Demo outreach email sent successfully!`);
        } else if (res.emailErrorMsg) {
          addActivity("error", `Auto-email sending failed: ${res.emailErrorMsg}`);
          toast.error(`Auto-email failed: ${res.emailErrorMsg}`);
        }

        setCurrentStep(5);
        setCurrentStep(6);
        toast.success("Pipeline completed successfully!");
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
        addActivity("error", `Pipeline failed: ${err.message}`);
      } finally {
        setIsRunning(false);
      }
    },
    [domain, addActivity]
  );

  const sendEmailToLead = useCallback(
    async (toEmail, toName, subject, message) => {
      try {
        await emailAPI.send(toEmail, toName, subject, message);
        setEmailsSentCount(1);
        addActivity("email", `Email sent successfully`);
        return true;
      } catch (err) {
        toast.error(`Failed to send email: ${err.message}`);
        addActivity("error", `Failed sending email to ${toEmail}: ${err.message}`);
        return false;
      }
    },
    [addActivity]
  );

  const reset = () => {
    localStorage.removeItem("lf_domain");
    localStorage.removeItem("lf_currentStep");
    localStorage.removeItem("lf_companies");
    localStorage.removeItem("lf_leads");
    localStorage.removeItem("lf_enrichedLead");
    localStorage.removeItem("lf_emailsSentCount");
    localStorage.removeItem("lf_activities");
    
    setDomainState("");
    setCurrentStepState(-1);
    setIsRunning(false);
    setCompaniesState([]);
    setLeadsState([]);
    setEnrichedLeadState(null);
    setEmailsSentCountState(0);
    setError(null);
    setActivitiesState([]);
  };

  return {
    domain,
    setDomain,
    currentStep,
    isRunning,
    companies,
    leads,
    enrichedLead,
    emailsSentCount,
    error,
    activities,
    runPipeline,
    sendEmailToLead,
    reset,
    PIPELINE_STEPS,
  };
}
