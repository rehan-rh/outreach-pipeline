import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Key, Server, CheckCircle, XCircle } from "lucide-react";
import { healthAPI } from "../services/api";

export default function Settings() {
  const [apiStatus, setApiStatus] = useState(null);
  const [checking, setChecking] = useState(false);

  const checkHealth = async () => {
    setChecking(true);
    try {
      const res = await healthAPI.check();
      setApiStatus({ ok: true, data: res });
    } catch {
      setApiStatus({ ok: false });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => { checkHealth(); }, []);

  const envVars = [
    { name: "OCEAN_API_KEY", desc: "Ocean.io API key for company discovery" },
    { name: "PROSPEO_API_KEY", desc: "Prospeo API key for lead search & enrichment" },
    { name: "BREVO_API_KEY", desc: "Brevo SMTP API key for email sending" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-semibold text-surface-950 mb-1">Settings</h1>
        <p className="text-[13px] text-surface-500 mb-8">Configure your LeadFlow AI instance</p>

        {/* API Status */}
        <div className="card p-5 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Server className="w-4 h-4 text-surface-500" />
              <div>
                <h3 className="text-sm font-medium text-surface-900">API Server</h3>
                <p className="text-xs text-surface-500">Backend health check</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {apiStatus ? (
                apiStatus.ok ? (
                  <span className="flex items-center gap-1 badge-success px-2 py-0.5 rounded text-xs font-medium"><CheckCircle className="w-3 h-3" /> Connected</span>
                ) : (
                  <span className="flex items-center gap-1 badge-error px-2 py-0.5 rounded text-xs font-medium"><XCircle className="w-3 h-3" /> Offline</span>
                )
              ) : (
                <span className="text-xs text-surface-500">Checking...</span>
              )}
              <button onClick={checkHealth} disabled={checking} className="px-2.5 py-1 rounded-md text-xs font-medium text-surface-600 bg-surface-200 hover:bg-surface-300 transition-colors cursor-pointer disabled:opacity-50">
                {checking ? "..." : "Refresh"}
              </button>
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-4 h-4 text-surface-500" />
            <h3 className="text-sm font-medium text-surface-900">Environment Variables</h3>
          </div>
          <div className="space-y-2">
            {envVars.map((v) => (
              <div key={v.name} className="flex items-center justify-between py-2.5 border-b border-surface-200 last:border-0">
                <div>
                  <p className="text-sm font-medium text-surface-800 font-mono">{v.name}</p>
                  <p className="text-xs text-surface-500">{v.desc}</p>
                </div>
                <span className="text-xs text-surface-400 font-mono">••••••••</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-surface-400 mt-4">API keys are stored in <code className="text-surface-600 bg-surface-200 px-1 rounded">backEnd/.env</code> and never exposed to the frontend.</p>
        </div>
      </motion.div>
    </div>
  );
}
