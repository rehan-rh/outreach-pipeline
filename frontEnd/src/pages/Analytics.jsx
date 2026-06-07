import { motion } from "framer-motion";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, Mail, Building2 } from "lucide-react";
import StatCard from "../components/StatCard";

const leadsData = [
  { name: "Mon", leads: 12 }, { name: "Tue", leads: 19 }, { name: "Wed", leads: 8 },
  { name: "Thu", leads: 25 }, { name: "Fri", leads: 32 }, { name: "Sat", leads: 15 }, { name: "Sun", leads: 22 },
];
const emailsData = [
  { name: "Mon", sent: 8 }, { name: "Tue", sent: 14 }, { name: "Wed", sent: 5 },
  { name: "Thu", sent: 18 }, { name: "Fri", sent: 24 }, { name: "Sat", sent: 10 }, { name: "Sun", sent: 16 },
];
const pieData = [
  { name: "Delivered", value: 75 }, { name: "Opened", value: 15 }, { name: "Bounced", value: 10 },
];
const COLORS = ["#10b981", "#6366f1", "#ef4444"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-xs shadow-md">
      <p className="text-surface-500 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-medium" style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function Analytics() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-semibold text-surface-950 mb-1">Analytics</h1>
        <p className="text-[13px] text-surface-500 mb-6">Track your outreach performance</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total Leads" value={133} icon={Users} color="brand" />
          <StatCard label="Emails Sent" value={95} icon={Mail} color="emerald" />
          <StatCard label="Success Rate" value={87} icon={TrendingUp} color="amber" suffix="%" />
          <StatCard label="Companies" value={24} icon={Building2} color="violet" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Leads Chart */}
          <div className="card p-5">
            <h3 className="text-[13px] font-semibold text-surface-700 mb-4">Leads Generated</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={leadsData}>
                <defs>
                  <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="leads" stroke="#6366f1" fill="url(#leadGrad)" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Emails Chart */}
          <div className="card p-5">
            <h3 className="text-[13px] font-semibold text-surface-700 mb-4">Emails Sent</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={emailsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sent" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="card p-5 max-w-sm">
          <h3 className="text-[13px] font-semibold text-surface-700 mb-4">Email Delivery Rate</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-2">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-surface-500">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
