import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Loader2,
  Users,
  Copy,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Send,
} from "lucide-react";
import LeadDetailsDrawer from "../components/LeadDetailsDrawer";
import { SkeletonTable } from "../components/SkeletonLoader";
import EmptyState from "../components/EmptyState";
import EmailComposer from "../components/EmailComposer";
import SuccessModal from "../components/SuccessModal";
import { leadsAPI } from "../services/api";
import { usePipeline } from "../hooks/usePipeline";
import toast from "react-hot-toast";

export default function Leads() {
  const {
    leads: pipelineLeads,
    setLeads: setPipelineLeads,
    sendEmailToLead,
  } = usePipeline();

  const [domain, setDomain] = useState("");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState(null);
  const [activeComposerLead, setActiveComposerLead] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const perPage = 8;

  // Load persistent pipeline leads by default
  useEffect(() => {
    if (pipelineLeads && pipelineLeads.length > 0) {
      setLeads(pipelineLeads);
    }
  }, [pipelineLeads]);

  const handleSearch = async () => {
    if (!domain) return toast.error("Enter a domain");
    setLoading(true);
    try {
      const res = await leadsAPI.search(domain);
      const data = res.data || [];
      setLeads(data);
      setPipelineLeads(data); // update globally
      setPage(1);
      if (data.length === 0) {
        toast("No contacts found", { icon: "🔍" });
      } else {
        toast.success(`Found ${data.length} contacts!`);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (toEmail, toName, subject, message) => {
    setSendingEmail(true);
    const success = await sendEmailToLead(toEmail, toName, subject, message);
    setSendingEmail(false);
    if (success) {
      setShowSuccess(true);
      setActiveComposerLead(null);
    }
  };

  const filtered = useMemo(() => {
    let data = [...leads];
    if (filterSearch) {
      const s = filterSearch.toLowerCase();
      data = data.filter(
        (l) =>
          (l.name || "").toLowerCase().includes(s) ||
          (l.title || "").toLowerCase().includes(s) ||
          (l.company || "").toLowerCase().includes(s) ||
          (l.email || "").toLowerCase().includes(s)
      );
    }
    data.sort((a, b) => {
      const va = (a[sortKey] || "").toLowerCase();
      const vb = (b[sortKey] || "").toLowerCase();
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return data;
  }, [leads, filterSearch, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const exportCSV = () => {
    if (leads.length === 0) return;
    const header = "Name,Title,Company,LinkedIn,Email\n";
    const rows = leads
      .map(
        (l) =>
          `"${l.name || ""}","${l.title || ""}","${l.company || ""}","${
            l.linkedin || ""
          }","${l.email || ""}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leadflow_contacts.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  const copyEmail = (e, email) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    toast.success("Email copied!");
  };

  const handleClear = () => {
    setLeads([]);
    setPipelineLeads([]);
    setDomain("");
    setFilterSearch("");
  };

  const SortHeader = ({ label, field }) => (
    <th
      onClick={() => toggleSort(field)}
      className="text-left px-4 py-3 text-[11px] font-semibold text-surface-500 uppercase tracking-wider cursor-pointer hover:bg-surface-100 select-none transition-colors"
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className="w-3 h-3 text-surface-400" />
      </div>
    </th>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-surface-900">Contacts & Leads</h1>
          <p className="text-xs text-surface-500">Query and manage decision makers at target domains.</p>
        </div>
        <div className="flex items-center gap-2">
          {leads.length > 0 && (
            <>
              <button
                onClick={exportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-surface-300 bg-white hover:bg-surface-50 text-xs font-semibold text-surface-700 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
              <button
                onClick={handleClear}
                className="px-3 py-1.5 rounded border border-surface-300 bg-white hover:bg-surface-50 text-xs font-semibold text-surface-600 transition-colors cursor-pointer"
              >
                Clear
              </button>
            </>
          )}
        </div>
      </div>

      {/* Query Bar */}
      <div className="card p-4 bg-white flex flex-col sm:flex-row gap-3">
        <div className="flex flex-1 gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Query domain (e.g. stripe.com)"
              className="w-full pl-9 pr-3 py-1.5 rounded border border-surface-300 text-sm text-surface-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 bg-white"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !domain}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            Search
          </button>
        </div>

        {leads.length > 0 && (
          <input
            type="text"
            value={filterSearch}
            onChange={(e) => {
              setFilterSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Filter by name, title, company..."
            className="px-3 py-1.5 rounded border border-surface-300 text-sm text-surface-800 focus:outline-none focus:border-brand-500 bg-white max-w-xs ml-auto"
          />
        )}
      </div>

      {/* Content Table / Empty State */}
      {loading ? (
        <div className="card p-4 bg-white">
          <SkeletonTable rows={6} cols={6} />
        </div>
      ) : paged.length > 0 ? (
        <div className="card bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="crm-table w-full">
              <thead>
                <tr>
                  <SortHeader label="Name" field="name" />
                  <SortHeader label="Job Title" field="title" />
                  <SortHeader label="Company" field="company" />
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-surface-500 uppercase tracking-wider">LinkedIn</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-surface-500 uppercase tracking-wider">Email</th>
                  <th className="text-right px-4 py-3 text-[11px] font-semibold text-surface-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {paged.map((l, i) => (
                  <tr
                    key={i}
                    onClick={() => setSelectedLead(l)}
                    className="hover:bg-surface-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-surface-900">{l.name || "—"}</td>
                    <td className="px-4 py-3 text-surface-600 truncate max-w-[180px]">{l.title || "—"}</td>
                    <td className="px-4 py-3 text-surface-600">{l.company || "—"}</td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      {l.linkedin ? (
                        <a
                          href={l.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-500 hover:text-brand-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="text-surface-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {l.email ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-surface-700 font-mono text-xs">{l.email}</span>
                          <button
                            onClick={(e) => copyEmail(e, l.email)}
                            className="p-0.5 rounded hover:bg-surface-200 text-surface-400 hover:text-surface-600 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-surface-400 font-medium">Pending Enrichment</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setActiveComposerLead(l)}
                        disabled={!l.email}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-brand-50 hover:bg-brand-100 text-brand-600 text-xs font-semibold border border-brand-100 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Send className="w-3 h-3" /> Email
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-surface-200 bg-surface-50">
              <p className="text-xs text-surface-500">
                Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1 rounded hover:bg-surface-200 text-surface-500 disabled:opacity-35 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-surface-600 font-medium px-2">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1 rounded hover:bg-surface-200 text-surface-500 disabled:opacity-35 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card bg-white p-8">
          <EmptyState
            title="No Contacts Discovered"
            description="Perform a domain search or run the dashboard workflow to populate matching leads."
            icon={Users}
          />
        </div>
      )}

      {/* Composer overlay modal/section */}
      {activeComposerLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="card bg-white max-w-lg w-full mx-4 overflow-hidden relative p-6">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setActiveComposerLead(null)}
                className="px-2.5 py-1 rounded border border-surface-300 text-xs text-surface-600 bg-white hover:bg-surface-100 cursor-pointer"
              >
                Close
              </button>
            </div>
            <div className="mt-2">
              <EmailComposer
                lead={activeComposerLead}
                onSend={handleSendEmail}
                isSending={sendingEmail}
              />
            </div>
          </div>
        </div>
      )}

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
