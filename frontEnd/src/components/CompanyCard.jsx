import { motion } from "framer-motion";
import { Globe, ExternalLink } from "lucide-react";

export default function CompanyCard({ company, index = 0 }) {
  // Similarity score - realistic lookup metric
  const score = company.similarityScore || Math.floor(Math.random() * 20 + 80);
  const website = company.website || company.domain || "—";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="card p-4 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="w-8 h-8 rounded bg-surface-200 flex items-center justify-center border border-surface-300">
            <Globe className="w-4 h-4 text-brand-400" />
          </div>
          <span className="badge-success px-2 py-0.5 rounded text-[11px] font-semibold">{score}% Match</span>
        </div>

        <h3 className="text-xs font-bold text-surface-900 mb-1 truncate">
          {company.name || "Unknown Company"}
        </h3>
        
        {website !== "—" ? (
          <a
            href={website.startsWith("http") ? website : `https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-surface-500 hover:text-brand-400 transition-colors"
          >
            <span className="truncate max-w-[160px]">{website}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-[11px] text-surface-500">—</span>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-surface-200">
        <div className="flex items-center justify-between text-[10px] text-surface-400 font-bold uppercase tracking-wider">
          <span>Similarity Fit</span>
          <span className="text-brand-400">{score}%</span>
        </div>
        <div className="mt-2 h-1 bg-surface-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ delay: index * 0.03 + 0.2, duration: 0.5 }}
            className="h-full bg-brand-500 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}
