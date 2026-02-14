import React, { useState } from "react";
import { Search, Filter, Navigation, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import cityMapBg from "@/assets/city-map-bg.png";

interface Bin {
  id: number;
  name: string;
  fillLevel: number;
  status: "empty" | "filling" | "full" | "overflow";
  distance: string;
  x: number;
  y: number;
}

const bins: Bin[] = [
  { id: 1, name: "Bin #12", fillLevel: 25, status: "empty", distance: "50m", x: 20, y: 30 },
  { id: 2, name: "Bin #23", fillLevel: 60, status: "filling", distance: "120m", x: 45, y: 20 },
  { id: 3, name: "Bin #42", fillLevel: 92, status: "overflow", distance: "200m", x: 70, y: 45 },
  { id: 4, name: "Bin #31", fillLevel: 80, status: "full", distance: "300m", x: 30, y: 60 },
  { id: 5, name: "Bin #15", fillLevel: 45, status: "filling", distance: "180m", x: 60, y: 70 },
  { id: 6, name: "Bin #08", fillLevel: 10, status: "empty", distance: "400m", x: 85, y: 25 },
];

const getStatusColor = (status: Bin["status"]) => {
  switch (status) {
    case "empty": return "bg-primary";
    case "filling": return "bg-accent";
    case "full": return "bg-destructive/80";
    case "overflow": return "bg-destructive";
    default: return "bg-muted";
  }
};

const getStatusBadge = (status: Bin["status"]) => {
  switch (status) {
    case "empty": return { label: "Empty", variant: "default" as const };
    case "filling": return { label: "Filling", variant: "secondary" as const };
    case "full": return { label: "Full", variant: "destructive" as const };
    case "overflow": return { label: "Overflow!", variant: "destructive" as const };
    default: return { label: "Unknown", variant: "secondary" as const };
  }
};

const MapScreen: React.FC = () => {
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const filteredBins = filter === "all" 
    ? bins 
    : bins.filter(bin => bin.status === filter);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 bg-card border-b border-border">
        <h1 className="text-lg font-bold text-foreground mb-3">Bin Locations</h1>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search location or bin..." 
            className="pl-10 bg-secondary border-none h-10"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {["all", "empty", "filling", "full", "overflow"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filter === f 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative overflow-hidden">
        <img 
          src={cityMapBg} 
          alt="City Map" 
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        
        {/* Bin Markers */}
        {filteredBins.map((bin) => (
          <button
            key={bin.id}
            onClick={() => setSelectedBin(bin)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
              selectedBin?.id === bin.id ? "scale-125 z-10" : "hover:scale-110"
            }`}
            style={{ left: `${bin.x}%`, top: `${bin.y}%` }}
          >
            <div className={`relative p-2 rounded-full ${getStatusColor(bin.status)} shadow-lg`}>
              <Trash2 className="w-4 h-4 text-primary-foreground" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-card rounded-full text-[8px] font-bold flex items-center justify-center text-foreground shadow">
                {bin.fillLevel}%
              </span>
            </div>
          </button>
        ))}

        {/* Current Location Marker */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-primary rounded-full border-2 border-primary-foreground shadow-lg animate-pulse" />
          <div className="absolute inset-0 w-4 h-4 bg-primary/30 rounded-full animate-ping" />
        </div>

        {/* Recenter Button */}
        <button className="absolute bottom-28 right-4 p-3 bg-card rounded-full shadow-lg border border-border">
          <Navigation className="w-5 h-5 text-primary" />
        </button>
        
        {/* Filter Button */}
        <button className="absolute bottom-28 left-4 p-3 bg-card rounded-full shadow-lg border border-border">
          <Filter className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Selected Bin Info */}
      {selectedBin && (
        <Card className="absolute bottom-24 left-4 right-4 p-4 bg-card/95 backdrop-blur-sm border-border shadow-lg z-20">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-foreground">{selectedBin.name}</h3>
              <p className="text-xs text-muted-foreground">{selectedBin.distance} away</p>
            </div>
            <Badge {...getStatusBadge(selectedBin.status)}>
              {getStatusBadge(selectedBin.status).label}
            </Badge>
          </div>
          
          {/* Fill Level Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Fill Level</span>
              <span className="font-medium text-foreground">{selectedBin.fillLevel}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${getStatusColor(selectedBin.status)}`}
                style={{ width: `${selectedBin.fillLevel}%` }}
              />
            </div>
          </div>

          <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
            Get Directions
          </button>
        </Card>
      )}
    </div>
  );
};

export default MapScreen;
