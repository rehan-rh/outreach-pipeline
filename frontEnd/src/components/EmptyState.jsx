import { motion } from "framer-motion";
import { Inbox } from "lucide-react";

export default function EmptyState({ title = "No data yet", description = "Get started by running a pipeline.", icon: Icon = Inbox }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 px-4">
      <Icon className="w-8 h-8 text-surface-400 mb-3" />
      <h3 className="text-sm font-medium text-surface-700 mb-1">{title}</h3>
      <p className="text-[13px] text-surface-500 text-center max-w-xs">{description}</p>
    </motion.div>
  );
}
