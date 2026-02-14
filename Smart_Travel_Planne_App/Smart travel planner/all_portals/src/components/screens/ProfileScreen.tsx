import React from "react";
import { User, Bell, Shield, HelpCircle, LogOut, ChevronRight, Settings, Award, Leaf } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const menuItems = [
  { id: "notifications", label: "Notifications", icon: Bell, hasSwitch: true },
  { id: "privacy", label: "Privacy & Security", icon: Shield },
  { id: "settings", label: "App Settings", icon: Settings },
  { id: "help", label: "Help & Support", icon: HelpCircle },
];

const achievements = [
  { id: 1, label: "First Report", icon: "🎯", unlocked: true },
  { id: 2, label: "Eco Learner", icon: "📚", unlocked: true },
  { id: 3, label: "Green Hero", icon: "🌱", unlocked: false },
  { id: 4, label: "Community Star", icon: "⭐", unlocked: false },
];

const ProfileScreen: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto pb-24 bg-background">
      {/* Header */}
      <div className="px-5 pt-4 pb-6 bg-card border-b border-border">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">Minahil Imran</h1>
            <p className="text-sm text-muted-foreground">FA22-BSE-069</p>
            <p className="text-xs text-primary">COMSATS Vehari Campus</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="p-3 bg-card border-border text-center">
            <p className="text-xl font-bold text-primary">12</p>
            <p className="text-[10px] text-muted-foreground">Reports</p>
          </Card>
          <Card className="p-3 bg-card border-border text-center">
            <p className="text-xl font-bold text-accent-foreground">3</p>
            <p className="text-[10px] text-muted-foreground">Modules</p>
          </Card>
          <Card className="p-3 bg-card border-border text-center">
            <p className="text-xl font-bold text-foreground">2</p>
            <p className="text-[10px] text-muted-foreground">Badges</p>
          </Card>
        </div>

        {/* Achievements */}
        <h2 className="font-semibold text-foreground mb-3">Achievements</h2>
        <Card className="p-4 bg-card border-border mb-6">
          <div className="flex items-center justify-between">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                  achievement.unlocked 
                    ? "bg-primary/10" 
                    : "bg-secondary opacity-50"
                }`}>
                  {achievement.icon}
                </div>
                <p className={`text-[9px] mt-1 text-center ${
                  achievement.unlocked ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {achievement.label}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Eco Score */}
        <Card className="p-4 bg-primary/5 border-primary/20 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Eco Score</p>
              <p className="text-xs text-muted-foreground">You're making a difference!</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">78</p>
              <p className="text-[10px] text-muted-foreground">/100</p>
            </div>
          </div>
        </Card>

        {/* Menu Items */}
        <h2 className="font-semibold text-foreground mb-3">Settings</h2>
        <Card className="bg-card border-border divide-y divide-border overflow-hidden">
          {menuItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-lg">
                  <item.icon className="w-4 h-4 text-secondary-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </div>
              {item.hasSwitch ? (
                <Switch defaultChecked />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </Card>

        {/* Logout */}
        <button className="w-full mt-6 flex items-center justify-center gap-2 py-3 text-destructive font-medium">
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          Smart Waste Management v1.0.0
        </p>
      </div>
    </div>
  );
};

export default ProfileScreen;
