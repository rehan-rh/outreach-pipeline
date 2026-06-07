import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Briefcase,
  Building2,
  Mail,
  ShieldCheck,
  ExternalLink,
  Copy,
} from "lucide-react";
import toast from "react-hot-toast";

export default function LeadDetailsDrawer({ lead, onClose }) {
  if (!lead) return null;

  const copyEmail = () => {
    if (lead.email) {
      navigator.clipboard.writeText(lead.email);
      toast.success("Email copied!");
    }
  };

  const fields = [
    { icon: User, label: "Full Name", value: lead.name },
    { icon: Briefcase, label: "Job Title", value: lead.title },
    { icon: Building2, label: "Company", value: lead.company },
    { icon: ExternalLink, label: "LinkedIn", value: lead.linkedin, isLink: true },
    { icon: Mail, label: "Email", value: lead.email, copyable: true },
    {
      icon: ShieldCheck,
      label: "Verification Status",
      value: lead.emailStatus || (lead.email ? "Verified" : "Pending"),
      isBadge: true,
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 350 }}
          className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-surface-50 border-l border-surface-200 overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 bg-surface-100">
            <h2 className="text-sm font-bold text-surface-900 uppercase tracking-wider">Lead Profile Details</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-surface-200 text-surface-500 hover:text-surface-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Avatar Area */}
          <div className="flex flex-col items-center py-8 border-b border-surface-200 bg-surface-100/50">
            <div className="w-16 h-16 rounded-full bg-brand-600 flex items-center justify-center text-xl font-bold text-white mb-3 shadow-inner">
              {lead.name?.charAt(0) || "?"}
            </div>
            <h3 className="text-base font-bold text-surface-900">{lead.name || "Unknown Lead"}</h3>
            <p className="text-xs text-brand-400 mt-1">{lead.company || "Unknown Company"}</p>
          </div>

          {/* Fields */}
          <div className="px-6 py-4 space-y-1">
            {fields.map((field) => (
              <div key={field.label} className="flex items-start gap-3.5 py-3.5 border-b border-surface-200 last:border-0">
                <field.icon className="w-4 h-4 text-surface-500 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-surface-400 font-bold mb-1">{field.label}</p>
                  {field.isLink && field.value ? (
                    <a
                      href={field.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1.5 transition-colors font-medium"
                    >
                      <span className="truncate">View LinkedIn Profile</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  ) : field.isBadge ? (
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                      field.value === "Verified" || field.value === "valid" ? "badge-success" : "badge-warning"
                    }`}>
                      {field.value || "—"}
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-surface-800 truncate font-medium">{field.value || "—"}</p>
                      {field.copyable && field.value && (
                        <button
                          onClick={copyEmail}
                          className="p-0.5 rounded hover:bg-surface-200 text-surface-500 hover:text-surface-800 transition-colors shrink-0"
                          title="Copy Email"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
