import React, { useState } from "react";
import PhoneFrame from "./PhoneFrame";
import BottomNavigation from "./BottomNavigation";
import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";
import ReportScreen from "./screens/ReportScreen";
import LearnScreen from "./screens/LearnScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AdminDashboard from "./screens/AdminDashboard";
import WorkerScreen from "./screens/WorkerScreen";
import { Button } from "@/components/ui/button";
import { Users, Shield, Truck } from "lucide-react";

type UserRole = "citizen" | "admin" | "worker";

const SmartWasteApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [userRole, setUserRole] = useState<UserRole>("citizen");

  const handleRoleSwitch = (role: UserRole) => {
    setUserRole(role);
    if (role === "admin") setActiveTab("admin");
    else if (role === "worker") setActiveTab("worker");
    else setActiveTab("home");
  };

  const renderScreen = () => {
    if (userRole === "worker") {
      return <WorkerScreen />;
    }
    
    if (userRole === "admin" && activeTab === "admin") {
      return <AdminDashboard />;
    }
    
    switch (activeTab) {
      case "home":
        return <HomeScreen />;
      case "map":
        return <MapScreen />;
      case "report":
        return <ReportScreen />;
      case "learn":
        return <LearnScreen />;
      case "profile":
        return <ProfileScreen />;
      case "admin":
        return <AdminDashboard />;
      case "worker":
        return <WorkerScreen />;
      default:
        return userRole === "admin" ? <AdminDashboard /> : <HomeScreen />;
    }
  };

  return (
    <div className="relative">
      {/* Role Switcher - Outside phone frame */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Button
          onClick={() => handleRoleSwitch("citizen")}
          variant={userRole === "citizen" ? "default" : "outline"}
          size="sm"
          className="gap-2 shadow-lg"
        >
          <Users className="w-4 h-4" />
          Citizen
        </Button>
        <Button
          onClick={() => handleRoleSwitch("worker")}
          variant={userRole === "worker" ? "default" : "outline"}
          size="sm"
          className={`gap-2 shadow-lg ${userRole === "worker" ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}`}
        >
          <Truck className="w-4 h-4" />
          Worker
        </Button>
        <Button
          onClick={() => handleRoleSwitch("admin")}
          variant={userRole === "admin" ? "default" : "outline"}
          size="sm"
          className={`gap-2 shadow-lg ${userRole === "admin" ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" : ""}`}
        >
          <Shield className="w-4 h-4" />
          Admin
        </Button>
      </div>

      <PhoneFrame>
        <div className="relative h-full">
          {renderScreen()}
          {userRole !== "worker" && (
            <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} isAdmin={userRole === "admin"} />
          )}
        </div>
      </PhoneFrame>
    </div>
  );
};

export default SmartWasteApp;
