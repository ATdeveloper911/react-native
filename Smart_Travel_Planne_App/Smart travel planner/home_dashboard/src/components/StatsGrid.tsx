import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, TrendingUp, Route, Clock } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, trend, trendUp, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-card rounded-2xl p-3 shadow-soft border border-border"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
      <p className="text-lg font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
      {trend && (
        <p className={`text-xs mt-1 ${trendUp ? 'text-success' : 'text-destructive'}`}>
          {trendUp ? '↑' : '↓'} {trend}
        </p>
      )}
    </motion.div>
  );
};

const StatsGrid: React.FC = () => {
  const stats = [
    { icon: <Trash2 className="w-4 h-4" />, label: 'Bins Monitored', value: '156', trend: '+12%', trendUp: true },
    { icon: <TrendingUp className="w-4 h-4" />, label: 'Collection Rate', value: '94%', trend: '+5%', trendUp: true },
    { icon: <Route className="w-4 h-4" />, label: 'Routes Today', value: '8', trend: '-2', trendUp: false },
    { icon: <Clock className="w-4 h-4" />, label: 'Avg Response', value: '25m', trend: '-10m', trendUp: true },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => (
        <StatCard key={stat.label} {...stat} delay={index * 0.1} />
      ))}
    </div>
  );
};

export default StatsGrid;
