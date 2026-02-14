import React, { useState } from "react";
import { Camera, MapPin, AlertTriangle, Trash2, FileWarning, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const issueTypes = [
  { id: "missed", label: "Missed Collection", icon: Trash2 },
  { id: "damage", label: "Bin Damage", icon: FileWarning },
  { id: "illegal", label: "Illegal Dumping", icon: AlertTriangle },
  { id: "overflow", label: "Bin Overflow", icon: Trash2 },
];

const ReportScreen: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  if (submitted) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-8 bg-background pb-20">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Report Submitted!</h2>
        <p className="text-sm text-muted-foreground text-center">
          Thank you for helping keep our community clean. We'll review your report within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pb-24 bg-background">
      {/* Header */}
      <div className="px-5 pt-4 pb-5 bg-card border-b border-border">
        <h1 className="text-lg font-bold text-foreground">Report an Issue</h1>
        <p className="text-sm text-muted-foreground">Help us improve waste management</p>
      </div>

      <div className="px-5 py-5">
        {/* Issue Type Selection */}
        <h2 className="text-sm font-semibold text-foreground mb-3">What's the issue?</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {issueTypes.map((type) => (
            <Card
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`p-4 cursor-pointer transition-all ${
                selectedType === type.id
                  ? "bg-primary/10 border-primary ring-2 ring-primary/20"
                  : "bg-card border-border hover:bg-secondary/50"
              }`}
            >
              <type.icon className={`w-6 h-6 mb-2 ${
                selectedType === type.id ? "text-primary" : "text-muted-foreground"
              }`} />
              <p className={`text-xs font-medium ${
                selectedType === type.id ? "text-primary" : "text-foreground"
              }`}>
                {type.label}
              </p>
            </Card>
          ))}
        </div>

        {/* Location */}
        <h2 className="text-sm font-semibold text-foreground mb-3">Location</h2>
        <Card className="p-4 mb-6 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-lg">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <Input 
                placeholder="Enter address or use current location" 
                className="border-none bg-transparent p-0 h-auto text-sm focus-visible:ring-0"
              />
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-primary">
              Use GPS
            </Button>
          </div>
        </Card>

        {/* Description */}
        <h2 className="text-sm font-semibold text-foreground mb-3">Description</h2>
        <Textarea 
          placeholder="Describe the issue in detail..."
          className="bg-card border-border mb-6 min-h-24 resize-none"
        />

        {/* Photo Upload */}
        <h2 className="text-sm font-semibold text-foreground mb-3">Add Photo (Optional)</h2>
        <Card className="p-6 mb-6 bg-secondary/30 border-dashed border-2 border-border cursor-pointer hover:bg-secondary/50 transition-colors">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-card rounded-full mb-3">
              <Camera className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">Take or Upload Photo</p>
            <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
          </div>
        </Card>

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit}
          disabled={!selectedType}
          className="w-full h-12 text-base font-semibold"
        >
          Submit Report
        </Button>
      </div>
    </div>
  );
};

export default ReportScreen;
