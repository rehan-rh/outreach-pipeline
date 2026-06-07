import { motion } from "framer-motion";
import {
  Globe,
  Waves,
  Building2,
  Search,
  Sparkles,
  Mail,
  CheckCircle,
} from "lucide-react";

const iconMap = { Globe, Waves, Building2, Search, Sparkles, Mail, CheckCircle };

export default function PipelineVisualizer({ steps, currentStep }) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center min-w-[680px]">
        {steps.map((step, index) => {
          const Icon = iconMap[step.icon] || Globe;
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              {/* Step Node */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-colors duration-300 ${
                    isCompleted
                      ? "bg-emerald/10 border-emerald/30"
                      : isActive
                      ? "bg-brand-500/10 border-brand-500/30"
                      : "bg-surface-200 border-surface-300"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-emerald" />
                  ) : (
                    <Icon className={`w-4 h-4 ${isActive ? "text-brand-500" : "text-surface-500"}`} />
                  )}
                </div>
                <span className={`text-[11px] font-medium text-center whitespace-nowrap ${
                  isCompleted ? "text-emerald" : isActive ? "text-brand-500" : "text-surface-500"
                }`}>
                  {step.label}
                </span>
              </motion.div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-px mx-2 bg-surface-300 relative overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: isCompleted ? "100%" : isActive ? "50%" : "0%" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={`h-full ${isCompleted ? "bg-emerald" : "bg-brand-500"}`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
