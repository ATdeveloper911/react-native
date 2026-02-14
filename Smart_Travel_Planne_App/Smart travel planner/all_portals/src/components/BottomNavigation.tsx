import React from "react";
import { Home, Map, AlertTriangle, BookOpen, User, LayoutDashboard } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const citizenNavItems: NavItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "map", label: "Map", icon: Map },
  { id: "report", label: "Report", icon: AlertTriangle },
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "profile", label: "Profile", icon: User },
];

const adminNavItems: NavItem[] = [
  { id: "admin", label: "Dashboard", icon: LayoutDashboard },
  { id: "map", label: "Map", icon: Map },
  { id: "report", label: "Reports", icon: AlertTriangle },
  { id: "learn", label: "Analytics", icon: BookOpen },
  { id: "profile", label: "Settings", icon: User },
];

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdmin?: boolean;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange, isAdmin = false }) => {
  const navItems = isAdmin ? adminNavItems : citizenNavItems;
  
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border pb-6 pt-2 px-2 z-40">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                isActive 
                  ? isAdmin ? "text-secondary scale-105" : "text-primary scale-105"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                isActive ? isAdmin ? "bg-secondary/15" : "bg-primary/15" : ""
              }`}>
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
