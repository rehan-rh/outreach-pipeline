import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X } from "lucide-react";

export default function SuccessModal({ isOpen, onClose, email }) {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.15 }} className="card p-6 max-w-sm w-full mx-4 text-center relative" onClick={(e) => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-3 right-3 p-1 rounded-md hover:bg-surface-200 text-surface-500 transition-colors"><X className="w-4 h-4" /></button>
          <div className="w-10 h-10 mx-auto rounded-full bg-emerald/10 flex items-center justify-center mb-3">
            <CheckCircle className="w-5 h-5 text-emerald" />
          </div>
          <h3 className="text-base font-semibold text-surface-950 mb-1">Email Sent</h3>
          <p className="text-sm text-surface-500 mb-5">Your email has been successfully sent{email ? ` to ${email}` : ""}.</p>
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors cursor-pointer">Done</button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
