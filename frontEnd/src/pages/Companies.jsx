import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, Building2, ExternalLink, RefreshCw } from "lucide-react";
import CompanyCard from "../components/CompanyCard";
import { SkeletonCard } from "../components/SkeletonLoader";
import EmptyState from "../components/EmptyState";
import { companiesAPI } from "../services/api";
import { usePipeline } from "../hooks/usePipeline";
import toast from "react-hot-toast";

export default function Companies() {
  const { companies: pipelineCompanies, setCompanies: setPipelineCompanies } = usePipeline();
  const [domain, setDomain] = useState("");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync with persistent pipeline companies by default
  useEffect(() => {
    if (pipelineCompanies && pipelineCompanies.length > 0) {
      setCompanies(pipelineCompanies);
    }
  }, [pipelineCompanies]);

  const handleSearch = async () => {
    if (!domain) return toast.error("Enter a domain");
    setLoading(true);
    try {
      const res = await companiesAPI.getSimilar(domain);
      const data = res.data || [];
      setCompanies(data);
      // Update pipeline state so it updates globally too
      setPipelineCompanies(data);
      if (data.length === 0) {
        toast("No similar companies found", { icon: "🔍" });
      } else {
        toast.success(`Found ${data.length} similar companies!`);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCompanies([]);
    setPipelineCompanies([]);
    setDomain("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-surface-900">Companies & Accounts</h1>
        <p className="text-xs text-surface-500">Discover and manage target accounts matching your ideal customer profile.</p>
      </div>

      {/* Action Bar */}
      <div className="card p-4 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Find similar to domain (e.g. stripe.com)"
              className="w-full pl-9 pr-3 py-1.5 rounded border border-surface-300 text-sm text-surface-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 bg-white"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !domain}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            Lookup
          </button>
        </div>

        {companies.length > 0 && (
          <button
            onClick={handleClear}
            className="px-3 py-1.5 rounded border border-surface-300 text-xs font-semibold text-surface-600 hover:bg-surface-50 transition-colors cursor-pointer"
          >
            Clear List
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : companies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((c, i) => (
            <CompanyCard key={i} company={c} index={i} />
          ))}
        </div>
      ) : (
        <div className="card bg-white p-8">
          <EmptyState
            title="No Accounts Discovered"
            description="Enter a domain above or run the main dashboard pipeline to fetch target accounts from Ocean API."
            icon={Building2}
          />
        </div>
      )}
    </div>
  );
}
