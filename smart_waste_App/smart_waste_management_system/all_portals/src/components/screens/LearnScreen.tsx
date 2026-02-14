import React from "react";
import { BookOpen, Leaf, Recycle, Trash2, ArrowRight, Trophy, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const modules = [
  { 
    id: 1, 
    title: "Waste Segregation 101", 
    description: "Learn how to properly sort your waste",
    icon: Trash2,
    progress: 100,
    lessons: 5,
    completed: true,
    color: "primary"
  },
  { 
    id: 2, 
    title: "Recycling Benefits", 
    description: "Discover the impact of recycling",
    icon: Recycle,
    progress: 60,
    lessons: 4,
    completed: false,
    color: "accent"
  },
  { 
    id: 3, 
    title: "Sustainable Living", 
    description: "Tips for reducing your waste footprint",
    icon: Leaf,
    progress: 0,
    lessons: 6,
    completed: false,
    color: "secondary"
  },
];

const tips = [
  "Rinse containers before recycling",
  "Compost organic waste when possible",
  "Avoid single-use plastics",
  "Reuse bags and containers",
];

const LearnScreen: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto pb-24 bg-background">
      {/* Header */}
      <div className="px-5 pt-4 pb-5 bg-primary rounded-b-3xl">
        <h1 className="text-lg font-bold text-primary-foreground mb-1">Learn & Grow</h1>
        <p className="text-sm text-primary-foreground/80 mb-4">
          Environmental awareness modules
        </p>
        
        {/* Progress Overview */}
        <Card className="p-4 bg-primary-foreground/15 border-none backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary-foreground/20 rounded-lg">
              <Trophy className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-primary-foreground">Your Progress</p>
              <p className="text-xs text-primary-foreground/70">1 of 3 modules completed</p>
            </div>
            <span className="text-2xl font-bold text-primary-foreground">33%</span>
          </div>
          <Progress value={33} className="h-2 bg-primary-foreground/20" />
        </Card>
      </div>

      <div className="px-5 -mt-2">
        {/* Modules */}
        <h2 className="font-semibold text-foreground mt-5 mb-3">Awareness Modules</h2>
        <div className="space-y-3">
          {modules.map((module) => (
            <Card 
              key={module.id} 
              className={`p-4 bg-card border-border shadow-sm cursor-pointer hover:shadow-md transition-all ${
                module.completed ? "opacity-90" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl ${
                  module.color === "primary" 
                    ? "bg-primary/10" 
                    : module.color === "accent" 
                    ? "bg-accent/20" 
                    : "bg-secondary"
                }`}>
                  <module.icon className={`w-5 h-5 ${
                    module.color === "primary" 
                      ? "text-primary" 
                      : module.color === "accent" 
                      ? "text-accent-foreground" 
                      : "text-secondary-foreground"
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-medium text-foreground">{module.title}</h3>
                    {module.completed && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px]">
                        Completed
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{module.description}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Progress value={module.progress} className="h-1.5" />
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {module.lessons} lessons
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Tips */}
        <h2 className="font-semibold text-foreground mt-6 mb-3">Quick Tips</h2>
        <Card className="p-4 bg-accent/10 border-accent/20">
          <div className="flex items-center gap-2 mb-3">
            <Leaf className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Did You Know?</span>
          </div>
          <div className="space-y-2">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                <p className="text-xs text-muted-foreground">{tip}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Featured Article */}
        <Card className="mt-5 overflow-hidden bg-card border-border">
          <div className="h-24 bg-gradient-to-r from-primary to-primary/60 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-primary-foreground opacity-50" />
          </div>
          <div className="p-4">
            <Badge variant="secondary" className="mb-2 text-[10px]">Featured</Badge>
            <h3 className="font-medium text-foreground mb-1">The Future of Smart Waste</h3>
            <p className="text-xs text-muted-foreground mb-3">
              How IoT technology is revolutionizing waste management
            </p>
            <button className="text-xs text-primary font-medium flex items-center gap-1">
              Read Article <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LearnScreen;
