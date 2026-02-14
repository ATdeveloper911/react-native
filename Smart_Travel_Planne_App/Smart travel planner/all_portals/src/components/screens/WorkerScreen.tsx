import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin, 
  Navigation, 
  Clock, 
  CheckCircle2, 
  Camera, 
  Truck, 
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Upload,
  X,
  Phone,
  MessageSquare,
  ChevronRight,
  Target,
  Fuel,
  Timer
} from "lucide-react";
import cityMapBg from "@/assets/city-map-bg.png";

interface Task {
  id: string;
  binName: string;
  address: string;
  fillLevel: number;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
  distance: string;
  estimatedTime: string;
  coordinates: { lat: number; lng: number };
  binType: string;
}

const initialTasks: Task[] = [
  {
    id: "1",
    binName: "Central Park Bin #12",
    address: "123 Main Street, Block A",
    fillLevel: 95,
    priority: "high",
    status: "pending",
    distance: "0.3 km",
    estimatedTime: "2 min",
    coordinates: { lat: 31.52, lng: 74.35 },
    binType: "General Waste"
  },
  {
    id: "2",
    binName: "Market Square Bin #5",
    address: "45 Commerce Road",
    fillLevel: 88,
    priority: "high",
    status: "pending",
    distance: "1.2 km",
    estimatedTime: "5 min",
    coordinates: { lat: 31.53, lng: 74.36 },
    binType: "Recyclable"
  },
  {
    id: "3",
    binName: "School Zone Bin #8",
    address: "78 Education Lane",
    fillLevel: 72,
    priority: "medium",
    status: "pending",
    distance: "2.1 km",
    estimatedTime: "8 min",
    coordinates: { lat: 31.54, lng: 74.37 },
    binType: "General Waste"
  },
  {
    id: "4",
    binName: "Hospital Area Bin #3",
    address: "12 Health Avenue",
    fillLevel: 65,
    priority: "medium",
    status: "pending",
    distance: "3.5 km",
    estimatedTime: "12 min",
    coordinates: { lat: 31.55, lng: 74.38 },
    binType: "Medical Waste"
  },
  {
    id: "5",
    binName: "Residential Bin #22",
    address: "90 Green Valley",
    fillLevel: 45,
    priority: "low",
    status: "pending",
    distance: "4.8 km",
    estimatedTime: "15 min",
    coordinates: { lat: 31.56, lng: 74.39 },
    binType: "Organic"
  }
];

const WorkerScreen: React.FC = () => {
  const [activeView, setActiveView] = useState<"tasks" | "navigation" | "complete">("tasks");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [completionNote, setCompletionNote] = useState("");
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  const completedCount = tasks.filter(t => t.status === "completed").length;
  const totalTasks = tasks.length;
  const progressPercent = (completedCount / totalTasks) * 100;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive text-destructive-foreground";
      case "medium": return "bg-warning text-warning-foreground";
      case "low": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return { label: "Pending", variant: "outline" as const };
      case "in-progress": return { label: "In Progress", variant: "default" as const };
      case "completed": return { label: "Completed", variant: "secondary" as const };
      default: return { label: status, variant: "outline" as const };
    }
  };

  const startNavigation = (task: Task) => {
    setSelectedTask(task);
    setActiveView("navigation");
    setIsNavigating(true);
    setTasks(prev => prev.map(t => 
      t.id === task.id ? { ...t, status: "in-progress" } : t
    ));
  };

  const arriveAtBin = () => {
    setIsNavigating(false);
    setShowCompletionDialog(true);
  };

  const completeTask = () => {
    if (selectedTask) {
      setTasks(prev => prev.map(t => 
        t.id === selectedTask.id ? { ...t, status: "completed" } : t
      ));
      setShowCompletionDialog(false);
      setPhotoUploaded(false);
      setCompletionNote("");
      setActiveView("tasks");
      setSelectedTask(null);
    }
  };

  const renderTaskList = () => (
    <div className="flex flex-col h-full">
      {/* Worker Header */}
      <div className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground p-4 pt-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-accent-foreground/70 text-xs">Good Morning</p>
            <h1 className="text-lg font-bold">Ahmad Khan</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-accent-foreground/20 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
          </div>
        </div>
        
        {/* Today's Progress */}
        <Card className="bg-accent-foreground/10 border-0">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-accent-foreground/80">Today's Progress</span>
              <span className="text-sm font-bold">{completedCount}/{totalTasks} Tasks</span>
            </div>
            <Progress value={progressPercent} className="h-2 bg-accent-foreground/20" />
            <div className="flex items-center justify-between mt-2 text-xs text-accent-foreground/70">
              <div className="flex items-center gap-1">
                <Timer className="w-3 h-3" />
                <span>Est. 42 min remaining</span>
              </div>
              <div className="flex items-center gap-1">
                <Fuel className="w-3 h-3" />
                <span>12.5 km route</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-card">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-2 text-center">
            <div className="text-xl font-bold text-destructive">{tasks.filter(t => t.priority === "high" && t.status !== "completed").length}</div>
            <p className="text-[10px] text-muted-foreground">Urgent</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-2 text-center">
            <div className="text-xl font-bold text-primary">{tasks.filter(t => t.status === "in-progress").length}</div>
            <p className="text-[10px] text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-2 text-center">
            <div className="text-xl font-bold text-secondary">{completedCount}</div>
            <p className="text-[10px] text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2">
          <h2 className="font-semibold text-sm">Assigned Tasks</h2>
          <Badge variant="outline" className="text-xs">{totalTasks - completedCount} remaining</Badge>
        </div>
        
        <ScrollArea className="h-[calc(100%-40px)] px-3">
          <div className="space-y-2 pb-24">
            {tasks.map((task, index) => (
              <Card 
                key={task.id} 
                className={`border-l-4 ${
                  task.status === "completed" 
                    ? "border-l-secondary/50 opacity-60" 
                    : task.priority === "high" 
                      ? "border-l-destructive" 
                      : task.priority === "medium" 
                        ? "border-l-warning" 
                        : "border-l-muted"
                }`}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-muted-foreground">#{index + 1}</span>
                        <Badge className={`text-[10px] px-1.5 py-0 ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </Badge>
                        <Badge variant={getStatusBadge(task.status).variant} className="text-[10px] px-1.5 py-0">
                          {getStatusBadge(task.status).label}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-sm">{task.binName}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {task.address}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {task.distance}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.estimatedTime}
                        </span>
                        <div className="flex items-center gap-1">
                          <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                task.fillLevel > 80 ? "bg-destructive" : task.fillLevel > 50 ? "bg-warning" : "bg-secondary"
                              }`}
                              style={{ width: `${task.fillLevel}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-muted-foreground">{task.fillLevel}%</span>
                        </div>
                      </div>
                    </div>
                    {task.status !== "completed" && (
                      <Button 
                        size="sm" 
                        className="ml-2"
                        onClick={() => startNavigation(task)}
                      >
                        <Navigation className="w-4 h-4" />
                      </Button>
                    )}
                    {task.status === "completed" && (
                      <CheckCircle2 className="w-6 h-6 text-secondary ml-2" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );

  const renderNavigation = () => (
    <div className="flex flex-col h-full">
      {/* Navigation Header */}
      <div className="bg-primary text-primary-foreground p-3 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary-foreground hover:bg-primary-foreground/10"
          onClick={() => {
            setActiveView("tasks");
            setIsNavigating(false);
          }}
        >
          <X className="w-4 h-4 mr-1" />
          Cancel
        </Button>
        <span className="font-medium text-sm">Navigation</span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary-foreground hover:bg-primary-foreground/10"
        >
          <Phone className="w-4 h-4" />
        </Button>
      </div>

      {/* Map View */}
      <div className="flex-1 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${cityMapBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />
          
          {/* Navigation Route Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Current Location Marker */}
              <div className="absolute -top-20 -left-10">
                <div className="w-4 h-4 bg-primary rounded-full border-2 border-primary-foreground shadow-lg animate-pulse" />
                <div className="w-8 h-8 bg-primary/30 rounded-full absolute -top-2 -left-2 animate-ping" />
              </div>
              
              {/* Route Line */}
              <svg className="w-32 h-40" viewBox="0 0 100 120">
                <path 
                  d="M20 20 Q50 60 80 100" 
                  fill="none" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="4" 
                  strokeDasharray="8 4"
                  className="animate-pulse"
                />
              </svg>
              
              {/* Destination Marker */}
              <div className="absolute -bottom-4 right-0">
                <div className="w-8 h-8 bg-destructive rounded-full border-3 border-destructive-foreground shadow-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-destructive-foreground" />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button size="icon" variant="secondary" className="shadow-lg">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Info Card */}
      <div className="bg-card p-4 rounded-t-3xl -mt-6 relative z-10 shadow-lg">
        {selectedTask && (
          <>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg">{selectedTask.binName}</h3>
                <p className="text-sm text-muted-foreground">{selectedTask.address}</p>
              </div>
              <Badge className={getPriorityColor(selectedTask.priority)}>
                {selectedTask.priority}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-2 bg-muted rounded-lg">
                <p className="text-lg font-bold text-primary">{selectedTask.distance}</p>
                <p className="text-xs text-muted-foreground">Distance</p>
              </div>
              <div className="text-center p-2 bg-muted rounded-lg">
                <p className="text-lg font-bold text-primary">{selectedTask.estimatedTime}</p>
                <p className="text-xs text-muted-foreground">ETA</p>
              </div>
              <div className="text-center p-2 bg-muted rounded-lg">
                <p className="text-lg font-bold text-destructive">{selectedTask.fillLevel}%</p>
                <p className="text-xs text-muted-foreground">Fill Level</p>
              </div>
            </div>

            <div className="flex gap-2 mb-20">
              {isNavigating ? (
                <>
                  <Button variant="outline" className="flex-1" onClick={() => setIsNavigating(false)}>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                  <Button className="flex-1 bg-secondary hover:bg-secondary/90" onClick={arriveAtBin}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    I've Arrived
                  </Button>
                </>
              ) : (
                <Button className="w-full" onClick={() => setIsNavigating(true)}>
                  <Play className="w-4 h-4 mr-2" />
                  Resume Navigation
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Completion Dialog */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="max-w-[90%] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-secondary" />
              Complete Task
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-lg">
              <h4 className="font-medium text-sm">{selectedTask?.binName}</h4>
              <p className="text-xs text-muted-foreground">{selectedTask?.address}</p>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="text-sm font-medium mb-2 block">Photo Confirmation *</label>
              <div 
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  photoUploaded ? "border-secondary bg-secondary/10" : "border-muted-foreground/30 hover:border-primary"
                }`}
                onClick={() => setPhotoUploaded(true)}
              >
                {photoUploaded ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle2 className="w-10 h-10 text-secondary mb-2" />
                    <p className="text-sm font-medium text-secondary">Photo Uploaded</p>
                    <p className="text-xs text-muted-foreground">bin_collection_001.jpg</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Camera className="w-10 h-10 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Take Photo</p>
                    <p className="text-xs text-muted-foreground">Tap to capture bin after collection</p>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium mb-2 block">Notes (Optional)</label>
              <Textarea 
                placeholder="Any issues or observations..."
                value={completionNote}
                onChange={(e) => setCompletionNote(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>

            <Button 
              className="w-full bg-secondary hover:bg-secondary/90"
              disabled={!photoUploaded}
              onClick={completeTask}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark as Completed
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <div className="h-full bg-background overflow-hidden">
      {activeView === "tasks" ? renderTaskList() : renderNavigation()}
    </div>
  );
};

export default WorkerScreen;
