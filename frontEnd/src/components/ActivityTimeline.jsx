import { motion } from "framer-motion";
import { Building2, Search, Mail, CheckCircle, AlertCircle, Globe, Sparkles, Zap } from "lucide-react";

const iconMap = {
  domain: Globe,
  ocean: Zap,
  companies: Building2,
  search: Search,
  leads: UsersIconCheck,
  enrich: Sparkles,
  email: Mail,
  ready: CheckCircle,
  error: AlertCircle,
};

function UsersIconCheck(props) {
  return <Building2 {...props} />;
}

export default function ActivityTimeline({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <p className="text-xs text-surface-500 italic">No recent activity logged.</p>
    );
  }

  // Display only the latest 8 events for brevity
  const displayActivities = activities.slice(0, 8);

  return (
    <div className="relative pl-4 border-l border-surface-200 space-y-4 py-1">
      {displayActivities.map((a, i) => {
        const Icon = iconMap[a.type] || Globe;
        const isError = a.type === "error";

        return (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="relative"
          >
            {/* Timeline dot */}
            <div className={`absolute -left-[23px] top-1 w-3 h-3 rounded-full border-2 bg-white flex items-center justify-center ${
              isError ? "border-rose" : a.type === "ready" ? "border-emerald" : "border-brand-500"
            }`} />

            <div className="min-w-0">
              <p className="text-xs font-medium text-surface-800 leading-normal">
                {a.message}
              </p>
              <span className="text-[10px] text-surface-400">
                {new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
