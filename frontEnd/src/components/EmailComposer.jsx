import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, Loader2 } from "lucide-react";

export default function EmailComposer({ lead, onSend, isSending = false }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const generateAIEmail = () => {
    const name = lead?.name?.split(" ")[0] || "there";
    const company = lead?.company || "your company";
    setSubject("Partnership Opportunity — Let's Connect");
    setMessage(
      `Hi ${name},\n\nI came across ${company} and was impressed by the work you're doing. I'd love to explore potential synergies between our teams.\n\nWould you be open to a quick 15-minute call this week?\n\nBest regards,\nRehan Hussain`
    );
  };

  const handleSend = () => {
    if (!lead?.email) return;
    onSend(lead.email, lead.name, subject, message);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-5 bg-surface-100">
      <h3 className="text-sm font-bold text-surface-900 uppercase tracking-wider mb-4">Compose Outreach</h3>
      {lead && (
        <div className="flex items-center gap-3 mb-4 p-3 rounded bg-surface-200 border border-surface-300">
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
            {lead.name?.charAt(0) || "?"}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-surface-900 truncate">{lead.name}</p>
            <p className="text-[11px] text-surface-500 font-mono truncate">{lead.email || "No email address"}</p>
          </div>
        </div>
      )}
      <div className="space-y-3.5">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-surface-400 mb-1">Subject Line</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter email subject line..."
            className="w-full px-3 py-2 rounded bg-surface-50 border border-surface-200 text-xs text-surface-800 placeholder:text-surface-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-surface-400 mb-1">Message Body</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your email body..."
            rows={5}
            className="w-full px-3 py-2 rounded bg-surface-50 border border-surface-200 text-xs text-surface-800 placeholder:text-surface-500 focus:outline-none focus:border-brand-500 transition-colors resize-none font-sans"
          />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={generateAIEmail}
          className="flex items-center gap-1.5 px-3 py-2 rounded text-xs font-semibold text-surface-800 bg-surface-200 hover:bg-surface-300 transition-colors border border-surface-300 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Generate AI Email
        </button>
        <button
          onClick={handleSend}
          disabled={!lead?.email || isSending || !subject || !message}
          className="flex items-center gap-1.5 px-4 py-2 rounded bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          Send Email
        </button>
      </div>
    </motion.div>
  );
}
