import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Users, Target, Calendar } from "lucide-react";
import { toastService } from "@/services/toastService";

interface ExportOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

export default function DataExport() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (type: string) => {
    setIsExporting(true);
    try {
      toastService.success(`${type} export started successfully`);
      // Add actual export logic here
    } catch (error) {
      toastService.error("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const exportOptions: ExportOption[] = [
    {
      id: "training-data",
      title: "Training Data",
      description: "Export all training sessions, performance metrics, and analytics",
      icon: <Target className="h-5 w-5" />,
      action: () => handleExport("Training Data"),
    },
    {
      id: "team-roster",
      title: "Team Roster",
      description: "Export team members, roles, and squad assignments",
      icon: <Users className="h-5 w-5" />,
      action: () => handleExport("Team Roster"),
    },
    {
      id: "equipment-inventory",
      title: "Equipment Inventory",
      description: "Export weapons, gear, and equipment assignments",
      icon: <FileText className="h-5 w-5" />,
      action: () => handleExport("Equipment Inventory"),
    },
    {
      id: "performance-reports",
      title: "Performance Reports",
      description: "Export detailed performance analytics and trends",
      icon: <Calendar className="h-5 w-5" />,
      action: () => handleExport("Performance Reports"),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Data Export</h1>
        <p className="text-muted-foreground">Export your team's data in various formats for analysis and reporting</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {exportOptions.map((option) => (
          <Card key={option.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {option.icon}
                {option.title}
              </CardTitle>
              <CardDescription>{option.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={option.action} disabled={isExporting} className="w-full" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export {option.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Export History</CardTitle>
          <CardDescription>Recent exports from your team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">No recent exports. Start by selecting an export option above.</div>
        </CardContent>
      </Card>
    </div>
  );
}
