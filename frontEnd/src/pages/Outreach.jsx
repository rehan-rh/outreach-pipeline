import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, Mail, Building2, User } from "lucide-react";
import PipelineVisualizer from "../components/PipelineVisualizer";
import CompanyCard from "../components/CompanyCard";
import EmailComposer from "../components/EmailComposer";
import SuccessModal from "../components/SuccessModal";
import ActivityTimeline from "../components/ActivityTimeline";
import EmptyState from "../components/EmptyState";
import { usePipeline } from "../hooks/usePipeline";

export default function Outreach() {
  const {
    domain,
    setDomain,
    currentStep,
    isRunning,
    companies,
    leads,
    enrichedLead,
    activities,
    runPipeline,
    sendEmailToLead,
    PIPELINE_STEPS,
  } = usePipeline();

  const [showSuccess, setShowSuccess] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  const handleSend = async (toEmail, toName, subject, message) => {
    setSendingEmail(true);
    const ok = await sendEmailToLead(toEmail, toName, subject, message);
    setSendingEmail(false);
    if (ok) setShowSuccess(true);
  };

  const targetLead = enrichedLead || (leads.length > 0 ? leads[0] : null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-surface-900">Email Outreach</h1>
        <p className="text-xs text-surface-500">Draft, verify, and deliver personalized outreach campaigns to prospect inbox.</p>
      </div>

      {/* Domain Bar */}
      <div className="card p-4 bg-white flex flex-col sm:flex-row gap-3">
        <div className="flex flex-1 gap-2 max-w-md">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runPipeline()}
            placeholder="Enter company domain (e.g. stripe.com)"
            className="w-full px-3 py-1.5 rounded border border-surface-300 text-sm text-surface-800 focus:outline-none focus:border-brand-500 bg-white"
            disabled={isRunning}
          />
          <button
            onClick={() => runPipeline()}
            disabled={isRunning || !domain}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
            {isRunning ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      {/* Progress */}
      {currentStep >= 0 && (
        <div className="card p-5 bg-white">
          <h2 className="text-xs font-bold uppercase tracking-wider text-surface-400 mb-3">Pipeline Status</h2>
          <PipelineVisualizer steps={PIPELINE_STEPS} currentStep={currentStep} />
        </div>
      )}

      {/* Main CRM Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composer & Target Lead */}
        <div className="lg:col-span-2 space-y-6">
          {targetLead ? (
            <div className="space-y-6">
              {/* Target Lead Detail Card */}
              <div className="card p-4 bg-white flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-sm shrink-0 border border-brand-100">
                  {targetLead.name?.charAt(0) || "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-surface-900">{targetLead.name}</h3>
                    <span className="badge-success px-2 py-0.5 rounded text-[11px] font-semibold">
                      Target Prospect
                    </span>
                  </div>
                  <p className="text-xs text-surface-500 mt-0.5">{targetLead.title || "No Title"} at {targetLead.company || "Target Company"}</p>
                  <p className="text-xs font-mono text-brand-600 mt-1">{targetLead.email || "No Email Found"}</p>
                </div>
              </div>

              {/* Email Composer Component */}
              <EmailComposer
                lead={targetLead}
                onSend={handleSend}
                isSending={sendingEmail}
              />
            </div>
          ) : (
            <div className="card bg-white p-8">
              <EmptyState
                title="No Outreach Target Selected"
                description="Run the outreach pipeline or search leads to select a contact for composing templates."
                icon={Mail}
              />
            </div>
          )}

          {/* Similar Companies Grid */}
          {companies.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-surface-500">Related Accounts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {companies.slice(0, 4).map((c, i) => (
                  <CompanyCard key={i} company={c} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Sidebar timeline */}
        <div>
          {activities.length > 0 ? (
            <div className="card p-5 bg-white space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-surface-500 pb-2 border-b border-surface-100">
                Pipeline Logs
              </h3>
              <ActivityTimeline activities={activities} />
            </div>
          ) : (
            <div className="card p-5 bg-white text-center text-xs text-surface-400 italic">
              No active logs available.
            </div>
          )}
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        email={targetLead?.email}
      />
    </div>
  );
}
