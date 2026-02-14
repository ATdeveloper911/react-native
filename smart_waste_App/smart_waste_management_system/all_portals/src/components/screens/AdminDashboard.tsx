import React, { useState } from "react";
import { 
  Map, Users, Route, BarChart3, Bell, Settings, 
  Trash2, TrendingUp, AlertTriangle, CheckCircle2, 
  Clock, Navigation, ChevronRight, Filter, Search,
  UserCheck, MapPin, Zap
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import cityMapBg from "@/assets/city-map-bg.png";

interface Bin {
  id: number;
  name: string;
  fillLevel: number;
  status: "empty" | "filling" | "full" | "overflow" | "offline";
  location: string;
  lastUpdated: string;
}

interface Worker {
  id: number;
  name: string;
  status: "available" | "busy" | "offline";
  tasksCompleted: number;
  currentRoute?: string;
  avatar: string;
}

interface CollectionRoute {
  id: number;
  name: string;
  bins: number;
  distance: string;
  estimatedTime: string;
  status: "pending" | "in-progress" | "completed";
  assignedTo?: string;
}

const bins: Bin[] = [
  { id: 1, name: "Bin #12", fillLevel: 25, status: "empty", location: "Main Street", lastUpdated: "2 min ago" },
  { id: 2, name: "Bin #23", fillLevel: 60, status: "filling", location: "Park Avenue", lastUpdated: "5 min ago" },
  { id: 3, name: "Bin #42", fillLevel: 92, status: "overflow", location: "Market Square", lastUpdated: "1 min ago" },
  { id: 4, name: "Bin #31", fillLevel: 85, status: "full", location: "University Road", lastUpdated: "3 min ago" },
  { id: 5, name: "Bin #15", fillLevel: 45, status: "filling", location: "Hospital Lane", lastUpdated: "8 min ago" },
  { id: 6, name: "Bin #08", fillLevel: 10, status: "empty", location: "Stadium Road", lastUpdated: "12 min ago" },
  { id: 7, name: "Bin #55", fillLevel: 0, status: "offline", location: "Industrial Area", lastUpdated: "1 hour ago" },
];

const workers: Worker[] = [
  { id: 1, name: "Ahmad Khan", status: "available", tasksCompleted: 12, avatar: "AK" },
  { id: 2, name: "Zainab Ali", status: "busy", tasksCompleted: 8, currentRoute: "Route A", avatar: "ZA" },
  { id: 3, name: "Hassan Raza", status: "available", tasksCompleted: 15, avatar: "HR" },
  { id: 4, name: "Fatima Noor", status: "offline", tasksCompleted: 6, avatar: "FN" },
];

const routes: CollectionRoute[] = [
  { id: 1, name: "Route A - North Zone", bins: 8, distance: "12.5 km", estimatedTime: "45 min", status: "in-progress", assignedTo: "Zainab Ali" },
  { id: 2, name: "Route B - Central", bins: 12, distance: "18.2 km", estimatedTime: "1h 15min", status: "pending" },
  { id: 3, name: "Route C - South Zone", bins: 6, distance: "8.7 km", estimatedTime: "30 min", status: "completed", assignedTo: "Ahmad Khan" },
];

const getStatusColor = (status: Bin["status"]) => {
  switch (status) {
    case "empty": return "bg-primary";
    case "filling": return "bg-accent";
    case "full": return "bg-destructive/80";
    case "overflow": return "bg-destructive";
    case "offline": return "bg-muted-foreground";
    default: return "bg-muted";
  }
};

const getWorkerStatusColor = (status: Worker["status"]) => {
  switch (status) {
    case "available": return "bg-primary";
    case "busy": return "bg-accent";
    case "offline": return "bg-muted-foreground";
    default: return "bg-muted";
  }
};

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedWorker, setSelectedWorker] = useState<number | null>(null);

  const fullBins = bins.filter(b => b.status === "full" || b.status === "overflow").length;
  const offlineBins = bins.filter(b => b.status === "offline").length;
  const availableWorkers = workers.filter(w => w.status === "available").length;

  return (
    <div className="h-full overflow-y-auto pb-24 bg-background">
      {/* Header */}
      <div className="bg-secondary px-5 pt-4 pb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-secondary-foreground/70 text-xs">Admin Panel</p>
            <h1 className="text-lg font-bold text-secondary-foreground">Dashboard</h1>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-secondary-foreground/10 rounded-full">
              <Bell className="w-4 h-4 text-secondary-foreground" />
            </button>
            <button className="p-2 bg-secondary-foreground/10 rounded-full">
              <Settings className="w-4 h-4 text-secondary-foreground" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2">
          <Card className="p-2 bg-secondary-foreground/10 border-none text-center">
            <Trash2 className="w-4 h-4 text-secondary-foreground mx-auto mb-1" />
            <p className="text-lg font-bold text-secondary-foreground">{bins.length}</p>
            <p className="text-[9px] text-secondary-foreground/70">Total</p>
          </Card>
          <Card className="p-2 bg-destructive/20 border-none text-center">
            <AlertTriangle className="w-4 h-4 text-destructive mx-auto mb-1" />
            <p className="text-lg font-bold text-secondary-foreground">{fullBins}</p>
            <p className="text-[9px] text-secondary-foreground/70">Full</p>
          </Card>
          <Card className="p-2 bg-primary/20 border-none text-center">
            <Users className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-secondary-foreground">{availableWorkers}</p>
            <p className="text-[9px] text-secondary-foreground/70">Available</p>
          </Card>
          <Card className="p-2 bg-accent/20 border-none text-center">
            <Route className="w-4 h-4 text-accent-foreground mx-auto mb-1" />
            <p className="text-lg font-bold text-secondary-foreground">{routes.length}</p>
            <p className="text-[9px] text-secondary-foreground/70">Routes</p>
          </Card>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="px-5 -mt-3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-card border border-border h-10">
            <TabsTrigger value="overview" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="w-3 h-3 mr-1" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="bins" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Trash2 className="w-3 h-3 mr-1" />
              Bins
            </TabsTrigger>
            <TabsTrigger value="routes" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Route className="w-3 h-3 mr-1" />
              Routes
            </TabsTrigger>
            <TabsTrigger value="workers" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="w-3 h-3 mr-1" />
              Workers
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-4 space-y-4">
            {/* Map Preview */}
            <Card className="overflow-hidden border-border">
              <div className="relative h-32">
                <img src={cityMapBg} alt="Map" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <div>
                    <p className="text-xs font-medium text-foreground">Live Bin Map</p>
                    <p className="text-[10px] text-muted-foreground">{bins.length} bins tracked</p>
                  </div>
                  <Button size="sm" className="h-7 text-xs">
                    <Map className="w-3 h-3 mr-1" /> View Full Map
                  </Button>
                </div>
              </div>
            </Card>

            {/* Alerts */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-foreground">Active Alerts</h3>
                <Badge variant="destructive" className="text-[10px]">{fullBins} urgent</Badge>
              </div>
              <div className="space-y-2">
                {bins.filter(b => b.status === "overflow" || b.status === "full").slice(0, 3).map(bin => (
                  <Card key={bin.id} className="p-3 bg-destructive/5 border-destructive/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(bin.status)} animate-pulse`} />
                        <div>
                          <p className="text-xs font-medium text-foreground">{bin.name} - {bin.fillLevel}%</p>
                          <p className="text-[10px] text-muted-foreground">{bin.location}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="h-6 text-[10px] text-destructive">
                        Assign
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Today's Performance */}
            <Card className="p-4 bg-card border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">Today's Performance</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Collections Completed</span>
                    <span className="font-medium text-foreground">18/24</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Route Efficiency</span>
                    <span className="font-medium text-foreground">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Response Time</span>
                    <span className="font-medium text-foreground">Avg 12 min</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Bins Tab */}
          <TabsContent value="bins" className="mt-4">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search bins..." className="pl-10 bg-card h-9 text-sm" />
            </div>

            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
              {["All", "Full", "Filling", "Empty", "Offline"].map(filter => (
                <Button key={filter} variant="outline" size="sm" className="h-7 text-xs whitespace-nowrap">
                  {filter}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              {bins.map(bin => (
                <Card key={bin.id} className="p-3 bg-card border-border">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${getStatusColor(bin.status)}/20 flex items-center justify-center`}>
                      <Trash2 className={`w-5 h-5 ${bin.status === "offline" ? "text-muted-foreground" : bin.status === "overflow" || bin.status === "full" ? "text-destructive" : "text-primary"}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-foreground">{bin.name}</p>
                        <Badge variant={bin.status === "overflow" || bin.status === "full" ? "destructive" : "secondary"} className="text-[10px]">
                          {bin.fillLevel}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {bin.location}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{bin.lastUpdated}</p>
                      </div>
                      <Progress value={bin.fillLevel} className="h-1 mt-2" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Routes Tab */}
          <TabsContent value="routes" className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Collection Routes</h3>
              <Button size="sm" className="h-7 text-xs">
                <Zap className="w-3 h-3 mr-1" /> Optimize
              </Button>
            </div>

            <Card className="p-3 bg-primary/5 border-primary/20 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Navigation className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-foreground">AI Route Optimization</p>
                  <p className="text-[10px] text-muted-foreground">Saves 23% fuel & 18% time</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Card>

            <div className="space-y-3">
              {routes.map(route => (
                <Card key={route.id} className={`p-4 bg-card border-border ${route.status === "in-progress" ? "ring-2 ring-primary/20" : ""}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{route.name}</p>
                      <p className="text-[10px] text-muted-foreground">{route.bins} bins • {route.distance}</p>
                    </div>
                    <Badge 
                      variant={route.status === "completed" ? "secondary" : route.status === "in-progress" ? "default" : "outline"}
                      className="text-[10px]"
                    >
                      {route.status === "in-progress" && <span className="w-1.5 h-1.5 bg-primary-foreground rounded-full mr-1 animate-pulse" />}
                      {route.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">{route.estimatedTime}</span>
                    </div>
                    {route.assignedTo ? (
                      <div className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-primary" />
                        <span className="text-[10px] text-foreground">{route.assignedTo}</span>
                      </div>
                    ) : (
                      <Button size="sm" variant="outline" className="h-6 text-[10px]">
                        Assign Worker
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Workers Tab */}
          <TabsContent value="workers" className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Collection Workers</h3>
              <Badge variant="secondary" className="text-[10px]">{availableWorkers} available</Badge>
            </div>

            <div className="space-y-3">
              {workers.map(worker => (
                <Card 
                  key={worker.id} 
                  className={`p-4 bg-card border-border cursor-pointer transition-all ${selectedWorker === worker.id ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setSelectedWorker(selectedWorker === worker.id ? null : worker.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <span className="text-sm font-semibold text-secondary-foreground">{worker.avatar}</span>
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${getWorkerStatusColor(worker.status)}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{worker.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {worker.currentRoute ? `Assigned: ${worker.currentRoute}` : `${worker.tasksCompleted} tasks completed today`}
                      </p>
                    </div>
                    <Badge 
                      variant={worker.status === "available" ? "default" : "secondary"}
                      className="text-[10px]"
                    >
                      {worker.status}
                    </Badge>
                  </div>

                  {selectedWorker === worker.id && worker.status === "available" && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">Assign to route:</p>
                      <div className="flex gap-2 flex-wrap">
                        {routes.filter(r => r.status === "pending").map(route => (
                          <Button key={route.id} size="sm" variant="outline" className="h-7 text-[10px]">
                            {route.name.split(" - ")[0]}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
