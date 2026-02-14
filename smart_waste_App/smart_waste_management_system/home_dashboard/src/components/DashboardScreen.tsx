import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, Menu, ChevronRight } from 'lucide-react';
import BottomNav from './BottomNav';
import SwipableCardStack from './SwipableCardStack';
import TipsCarousel from './TipsCarousel';
import StatsGrid from './StatsGrid';

const DashboardScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  const quickActions = [
    { id: 1, label: 'Report Issue', emoji: '📝' },
    { id: 2, label: 'Find Bin', emoji: '🗑️' },
    { id: 3, label: 'Schedule', emoji: '📅' },
    { id: 4, label: 'Learn', emoji: '📚' },
  ];

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Header */}
      <div className="pt-10 px-4 pb-4 gradient-hero">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-11 h-11 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-primary"
            >
              M
            </motion.div>
            <div>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-muted-foreground"
              >
                Good Morning 👋
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg font-bold text-foreground"
              >
                Minahil Imran
              </motion.h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-card shadow-soft flex items-center justify-center text-muted-foreground border border-border"
            >
              <Search className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-card shadow-soft flex items-center justify-center relative border border-border"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                3
              </span>
            </motion.button>
          </div>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <input
            type="text"
            placeholder="Search bins, routes, or reports..."
            className="w-full h-12 pl-12 pr-4 bg-card rounded-xl border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-soft"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        </motion.div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-28">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3 mb-5"
        >
          {quickActions.map((action, index) => (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-card rounded-xl p-3 shadow-soft border border-border flex flex-col items-center gap-1 hover:shadow-medium transition-shadow"
            >
              <span className="text-xl">{action.emoji}</span>
              <span className="text-[10px] font-medium text-muted-foreground">{action.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Stats Grid */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-foreground">Overview</h2>
            <button className="text-xs text-primary font-medium flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <StatsGrid />
        </div>

        {/* Swipable Cards */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-foreground">Bin Status</h2>
            <span className="text-xs text-muted-foreground">Swipe cards →</span>
          </div>
          <SwipableCardStack />
        </div>

        {/* Tips Carousel */}
        <div className="mb-5">
          <h2 className="font-bold text-foreground mb-3">Eco Tips</h2>
          <TipsCarousel />
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default DashboardScreen;
