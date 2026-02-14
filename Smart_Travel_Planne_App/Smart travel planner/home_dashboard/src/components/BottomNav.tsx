import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Map, Bell, User, Plus } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'map', icon: Map, label: 'Map' },
  { id: 'report', icon: Plus, label: 'Report', isAction: true },
  { id: 'alerts', icon: Bell, label: 'Alerts' },
  { id: 'profile', icon: User, label: 'Profile' },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 pb-8">
      <div className="glass-card mx-4 rounded-2xl p-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          if (tab.isAction) {
            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => onTabChange(tab.id)}
                className="gradient-primary w-12 h-12 rounded-xl flex items-center justify-center shadow-primary -mt-6"
              >
                <Icon className="w-6 h-6 text-primary-foreground" />
              </motion.button>
            );
          }
          
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center p-2 rounded-xl transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
