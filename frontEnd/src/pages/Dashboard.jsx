import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  Mail,
  Send,
  TrendingUp,
  ArrowRight,
  Loader2,
  Globe,
  CheckCircle,
  Copy,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import StatCard from "../components/StatCard";
import PipelineVisualizer from "../components/PipelineVisualizer";
import ActivityTimeline from "../components/ActivityTimeline";
import CompanyCard from "../components/CompanyCard";
import LeadDetailsDrawer from "../components/LeadDetailsDrawer";
import EmailComposer from "../components/EmailComposer";
import SuccessModal from "../components/SuccessModal";
import { SkeletonStat, SkeletonTable } from "../components/SkeletonLoader";
import { usePipeline } from "../hooks/usePipeline";
import toast from "react-hot-toast";

export default function Dashboard() {
  const {
    domain,
    setDomain,
    currentStep,
    isRunning,
    companies,
    leads,
    enrichedLead,
    emailsSentCount,
    activities,
    runPipeline,
    sendEmailToLead,
    reset,
    PIPELINE_STEPS,
  } = usePipeline();

  const [selectedLead, setSelectedLead] = useState(null);
  const [activeComposerLead, setActiveComposerLead] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  // Leads pagination and sorting
  const [leadPage, setLeadPage] = useState(1);
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const perPage = 5;

  const handleSendEmail = async (toEmail, toName, subject, message) => {
    setSendingEmail(true);
    const success = await sendEmailToLead(toEmail, toName, subject, message);
    setSendingEmail(false);
    if (success) {
      setShowSuccess(true);
      setActiveComposerLead(null);
    }
  };

  const copyEmail = (e, email) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    toast.success("Email copied!");
  };

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedLeads = useMemo(() => {
    const data = [...leads];
    data.sort((a, b) => {
      const va = (a[sortKey] || "").toLowerCase();
      const vb = (b[sortKey] || "").toLowerCase();
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return data;
  }, [leads, sortKey, sortDir]);

  const totalPages = Math.ceil(sortedLeads.length / perPage);
  const pagedLeads = sortedLeads.slice((leadPage - 1) * perPage, leadPage * perPage);

  // Status message for each step of the running pipeline
  const getStatusMessage = () => {
    switch (currentStep) {
      case 0:
        return "Initializing pipeline...";
      case 1:
        return "Searching similar companies via Ocean API...";
      case 2:
        return "Normalizing company results...";
      case 3:
        return "Querying Prospeo Search for contacts...";
      case 4:
        return "Enriching target contacts & verifying email addresses...";
      case 5:
        return "Drafting Brevo outreach email...";
      case 6:
        return "Outreach workflow complete!";
      default:
        return "Running pipeline steps on the backend...";
    }
  };

  const stats = [
    { label: "Companies Found", value: companies.length, icon: Building2, color: "brand" },
    { label: "Leads Generated", value: leads.length, icon: Users, color: "emerald" },
    { label: "Emails Enriched", value: enrichedLead ? 1 : 0, icon: Mail, color: "cyan" },
    { label: "Emails Sent", value: emailsSentCount, icon: Send, color: "violet" },
    { label: "Success Rate", value: leads.length > 0 ? 100 : 0, icon: TrendingUp, color: "amber", suffix: "%" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Hero Section */}
      <div className="card p-6 bg-surface-100">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-brand-500/10 text-brand-400 text-xs font-semibold mb-3 border border-brand-500/20">
            <Sparkles className="w-3.5 h-3.5" /> B2B Prospecting & Outreach
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 tracking-tight mb-2">
            LeadFlow AI Sales Hub
          </h1>
          <p className="text-sm text-surface-600 mb-6">
            Enter a company domain to look up similar accounts, pull primary contacts, verify addresses, and queue automated templates.
          </p>

          {/* Domain Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-xl">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Enter company domain (e.g. stripe.com)"
                onKeyDown={(e) => e.key === "Enter" && !isRunning && domain && runPipeline()}
                className="w-full pl-9 pr-3.5 py-2 rounded border border-surface-300 text-sm text-surface-800 placeholder:text-surface-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 bg-surface-50"
                disabled={isRunning}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => runPipeline()}
                disabled={isRunning || !domain}
                className="flex items-center justify-center gap-2 px-5 py-2 rounded bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {isRunning ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                {isRunning ? "Processing..." : "Run Pipeline"}
              </button>
              {(companies.length > 0 || leads.length > 0 || activities.length > 0) && (
                <button
                  onClick={reset}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded border border-surface-300 hover:bg-surface-200 text-xs font-semibold text-surface-700 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              )}
            </div>
          </div>

          {/* Pipeline Active Loader State */}
          {isRunning && (
            <div className="mt-4 flex items-center gap-2.5 text-xs text-brand-400 font-semibold bg-brand-500/5 border border-brand-500/10 p-2.5 rounded">
              <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
              <span>{getStatusMessage()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Pipeline Progress Visualization */}
      {currentStep >= 0 && (
        <div className="card p-5 bg-surface-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-4">Pipeline Steps</h2>
          <PipelineVisualizer steps={PIPELINE_STEPS} currentStep={currentStep} />
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {isRunning && companies.length === 0
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonStat key={i} />)
          : stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Main CRM Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Companies and Leads */}
        <div className="lg:col-span-2 space-y-6">
          {/* Similar Companies Section */}
          {companies.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-surface-500">
                  Target Companies Discovered ({companies.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {companies.slice(0, 4).map((c, i) => (
                  <CompanyCard key={i} company={c} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* Leads Table Section */}
          {leads.length > 0 && (
            <div className="card bg-surface-100 overflow-hidden">
              <div className="p-4 border-b border-surface-200 bg-surface-50 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-surface-700">
                  Identified Decision Makers
                </h3>
                <span className="badge-info px-2 py-0.5 rounded text-xs font-medium">
                  {leads.length} contacts found
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="crm-table w-full">
                  <thead>
                    <tr>
                      <th
                        onClick={() => toggleSort("name")}
                        className="text-left px-4 py-3 cursor-pointer select-none hover:bg-surface-200"
                      >
                        <div className="flex items-center gap-1">
                          Name <ArrowUpDown className="w-3 h-3 text-surface-500" />
                        </div>
                      </th>
                      <th
                        onClick={() => toggleSort("title")}
                        className="text-left px-4 py-3 cursor-pointer select-none hover:bg-surface-200"
                      >
                        <div className="flex items-center gap-1">
                          Job Title <ArrowUpDown className="w-3 h-3 text-surface-500" />
                        </div>
                      </th>
                      <th
                        onClick={() => toggleSort("company")}
                        className="text-left px-4 py-3 cursor-pointer select-none hover:bg-surface-200"
                      >
                        <div className="flex items-center gap-1">
                          Company <ArrowUpDown className="w-3 h-3 text-surface-500" />
                        </div>
                      </th>
                      <th className="text-left px-4 py-3 text-surface-500">Email</th>
                      <th className="text-right px-4 py-3 text-surface-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-200">
                    {pagedLeads.map((l, i) => (
                      <tr
                        key={i}
                        onClick={() => setSelectedLead(l)}
                        className="hover:bg-surface-200 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-surface-900">{l.name || "—"}</td>
                        <td className="px-4 py-3 text-surface-600 truncate max-w-[150px]">{l.title || "—"}</td>
                        <td className="px-4 py-3 text-surface-600">{l.company || "—"}</td>
                        <td className="px-4 py-3">
                          {l.email ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-surface-700 font-mono text-xs">{l.email}</span>
                              <button
                                onClick={(e) => copyEmail(e, l.email)}
                                className="p-0.5 rounded hover:bg-surface-300 text-surface-500 hover:text-surface-700 transition-colors"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-surface-500 font-medium">Pending Enrichment</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setActiveComposerLead(l)}
                            disabled={!l.email}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 text-xs font-semibold border border-brand-500/20 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Send className="w-3 h-3" /> Email
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-surface-200 bg-surface-50">
                  <p className="text-xs text-surface-500">
                    Showing {(leadPage - 1) * perPage + 1}–
                    {Math.min(leadPage * perPage, sortedLeads.length)} of {sortedLeads.length}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setLeadPage((p) => Math.max(1, p - 1))}
                      disabled={leadPage === 1}
                      className="p-1 rounded hover:bg-surface-200 text-surface-500 disabled:opacity-35 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-surface-600 font-medium px-2">
                      {leadPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setLeadPage((p) => Math.min(totalPages, p + 1))}
                      disabled={leadPage === totalPages}
                      className="p-1 rounded hover:bg-surface-200 text-surface-500 disabled:opacity-35 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Email Composer (Inline when active) */}
          {activeComposerLead && (
            <div className="relative">
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={() => setActiveComposerLead(null)}
                  className="px-2.5 py-1 rounded border border-surface-300 bg-surface-100 hover:bg-surface-200 text-xs text-surface-700 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
              <EmailComposer
                lead={activeComposerLead}
                onSend={handleSendEmail}
                isSending={sendingEmail}
              />
            </div>
          )}
        </div>

        {/* Right Side: Activity Timeline */}
        <div className="space-y-6">
          {activities.length > 0 && (
            <div className="card p-5 bg-surface-100 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-surface-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-surface-500">
                  Activity Timeline
                </h3>
                <span className="text-[11px] text-surface-400">Real-time updates</span>
              </div>
              <ActivityTimeline activities={activities} />
            </div>
          )}
        </div>
      </div>

      {/* Drawers and modals */}
      {selectedLead && (
        <LeadDetailsDrawer lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        email={activeComposerLead?.email}
      />
    </div>
  );
}
