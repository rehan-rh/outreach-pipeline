import { motion } from "framer-motion";
import { useAnimatedCounter } from "../hooks/useAnimatedCounter";

export default function StatCard({ label, value, icon: Icon, color = "brand", suffix = "", prefix = "" }) {
  const animatedValue = useAnimatedCounter(value, 1200);

  const colorMap = {
    brand: "text-brand-500",
    emerald: "text-emerald",
    amber: "text-amber",
    rose: "text-rose",
    cyan: "text-cyan",
    violet: "text-violet",
  };

  const textColor = colorMap[color] || colorMap.brand;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] text-surface-600 font-medium">{label}</p>
        <Icon className={`w-4 h-4 text-surface-500`} />
      </div>
      <p className={`text-2xl font-semibold text-surface-950 tabular-nums`}>
        {prefix}{animatedValue.toLocaleString()}{suffix}
      </p>
    </motion.div>
  );
}
