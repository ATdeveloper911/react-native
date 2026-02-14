import React from "react";
import { Bell, Trash2, TrendingUp, MapPin, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import smartBinImage from "@/assets/smart-bin-hero.png";

const notifications = [
  { id: 1, title: "Bin #42 is 90% full", time: "2 min ago", type: "urgent" },
  { id: 2, title: "Collection completed - Route A", time: "15 min ago", type: "success" },
  { id: 3, title: "New awareness module available", time: "1 hour ago", type: "info" },
];

const stats = [
  { label: "Total Bins", value: "156", icon: Trash2, trend: "+12" },
  { label: "Full Bins", value: "8", icon: MapPin, trend: "-3" },
  { label: "Collections Today", value: "24", icon: TrendingUp, trend: "+8" },
];

const HomeScreen: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto pb-24 bg-background">
      {/* Header */}
      <div className="bg-primary px-5 pt-4 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-primary-foreground/80 text-sm">Welcome back,</p>
            <h1 className="text-xl font-bold text-primary-foreground">Minahil</h1>
          </div>
          <button className="relative p-2 bg-primary-foreground/20 rounded-full">
            <Bell className="w-5 h-5 text-primary-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-3">
          {stats.map((stat, index) => (
            <Card key={index} className="flex-1 p-3 bg-primary-foreground/15 border-none backdrop-blur-sm">
              <stat.icon className="w-4 h-4 text-primary-foreground/80 mb-1" />
              <p className="text-lg font-bold text-primary-foreground">{stat.value}</p>
              <p className="text-[10px] text-primary-foreground/70">{stat.label}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 -mt-4">
        {/* Hero Card */}
        <Card className="p-4 mb-5 bg-card border-border shadow-md overflow-hidden">
          <div className="flex items-center gap-4">
            <img 
              src={smartBinImage} 
              alt="Smart Bin" 
              className="w-20 h-20 object-contain"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Smart Waste System</h3>
              <p className="text-xs text-muted-foreground mb-2">
                Monitor bins in real-time with IoT technology
              </p>
              <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-none">
                Active • 156 Bins
              </Badge>
            </div>
          </div>
        </Card>

        {/* Recent Notifications */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground">Recent Alerts</h2>
          <button className="text-xs text-primary font-medium flex items-center gap-1">
            View All <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card key={notification.id} className="p-3 bg-card border-border shadow-sm">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  notification.type === "urgent" 
                    ? "bg-destructive/10" 
                    : notification.type === "success" 
                    ? "bg-primary/10" 
                    : "bg-accent/10"
                }`}>
                  <Bell className={`w-4 h-4 ${
                    notification.type === "urgent" 
                      ? "text-destructive" 
                      : notification.type === "success" 
                      ? "text-primary" 
                      : "text-accent-foreground"
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
                {notification.type === "urgent" && (
                  <Badge variant="destructive" className="text-[10px]">Urgent</Badge>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="font-semibold text-foreground mt-5 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors cursor-pointer">
            <Trash2 className="w-6 h-6 text-primary mb-2" />
            <p className="text-sm font-medium text-foreground">Check Bin Status</p>
            <p className="text-[10px] text-muted-foreground">View all nearby bins</p>
          </Card>
          <Card className="p-4 bg-accent/10 border-accent/20 hover:bg-accent/15 transition-colors cursor-pointer">
            <MapPin className="w-6 h-6 text-accent-foreground mb-2" />
            <p className="text-sm font-medium text-foreground">Find Nearest Bin</p>
            <p className="text-[10px] text-muted-foreground">Locate empty bins</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
