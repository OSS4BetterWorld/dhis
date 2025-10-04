import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Cloud, Layers, Satellite } from "lucide-react";

interface MonitoringData {
  category: string;
  icon: React.ElementType;
  metrics: { label: string; value: string; status: "normal" | "warning" | "alert" }[];
}

const monitoringData: MonitoringData[] = [
  {
    category: "Weather Data",
    icon: Cloud,
    metrics: [
      { label: "Rainfall", value: "45mm/hr", status: "warning" },
      { label: "Wind Speed", value: "65 km/h", status: "normal" },
      { label: "Temperature", value: "28°C", status: "normal" },
    ],
  },
  {
    category: "Geological",
    icon: Activity,
    metrics: [
      { label: "Seismic Activity", value: "2.1 magnitude", status: "normal" },
      { label: "Volcanic Activity", value: "Low", status: "normal" },
      { label: "Ground Movement", value: "Stable", status: "normal" },
    ],
  },
  {
    category: "Hydrological",
    icon: Layers,
    metrics: [
      { label: "River Level", value: "8.2m", status: "warning" },
      { label: "Dam Capacity", value: "78%", status: "normal" },
      { label: "Groundwater", value: "Normal", status: "normal" },
    ],
  },
  {
    category: "Satellite Data",
    icon: Satellite,
    metrics: [
      { label: "Fire Hotspots", value: "3 detected", status: "alert" },
      { label: "Storm Tracking", value: "2 systems", status: "warning" },
      { label: "Cloud Cover", value: "65%", status: "normal" },
    ],
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "alert":
      return "bg-destructive text-destructive-foreground";
    case "warning":
      return "bg-warning text-foreground";
    default:
      return "bg-success text-primary-foreground";
  }
};

export const MonitoringDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Real-time Monitoring</h2>
        <Badge className="bg-gradient-primary text-primary-foreground border-0 px-4 py-2">
          <Activity className="h-4 w-4 mr-2 animate-pulse" />
          Live Data
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {monitoringData.map((data) => (
          <Card key={data.category} className="border-border bg-card hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl text-card-foreground">
                <div className="p-2 rounded-lg bg-gradient-primary">
                  <data.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                {data.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                  >
                    <span className="text-sm font-medium text-foreground">{metric.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{metric.value}</span>
                      <Badge className={getStatusColor(metric.status)} variant="secondary">
                        {metric.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
