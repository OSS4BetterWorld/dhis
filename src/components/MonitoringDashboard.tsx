import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Cloud, Layers, Satellite } from "lucide-react";
import { useMqttMonitoring } from "@/hooks/useMqttMonitoring";

interface MonitoringData {
  category: string;
  icon: React.ElementType;
  metrics: { label: string; value: string; status: "normal" | "warning" | "alert" }[];
}

const categoryIcons: Record<string, React.ElementType> = {
  "Weather Data": Cloud,
  "Geological": Activity,
  "Hydrological": Layers,
  "Satellite Data": Satellite,
};

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
  const { monitoringData, isConnected } = useMqttMonitoring();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Real-time Monitoring</h2>
        <Badge className={`${isConnected ? 'bg-gradient-primary' : 'bg-muted'} text-primary-foreground border-0 px-4 py-2`}>
          <Activity className={`h-4 w-4 mr-2 ${isConnected ? 'animate-pulse' : ''}`} />
          {isConnected ? 'Live Data' : 'Connecting...'}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {monitoringData.map((data) => {
          const Icon = categoryIcons[data.category] || Activity;
          return (
            <Card key={data.category} className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-card-foreground">
                  <div className="p-2 rounded-lg bg-gradient-primary">
                    <Icon className="h-5 w-5 text-primary-foreground" />
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
          );
        })}
      </div>
    </div>
  );
};
