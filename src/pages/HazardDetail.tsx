import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Activity, AlertTriangle, TrendingUp, MapPin } from "lucide-react";
import { useMqttMonitoring } from "@/hooks/useMqttMonitoring";

const HazardDetail = () => {
  const { hazardType } = useParams<{ hazardType: string }>();
  const navigate = useNavigate();
  const { monitoringData, isConnected } = useMqttMonitoring();
  const [historicalData, setHistoricalData] = useState<any[]>([]);

  useEffect(() => {
    // Simulate fetching historical data for this specific hazard
    const mockHistorical = [
      { date: "2024-10-02", intensity: "High", location: "Region A", casualties: 12 },
      { date: "2024-09-15", intensity: "Medium", location: "Region B", casualties: 3 },
      { date: "2024-08-20", intensity: "Low", location: "Region C", casualties: 0 },
      { date: "2024-07-10", intensity: "Medium", location: "Region A", casualties: 5 },
    ];
    setHistoricalData(mockHistorical);
  }, [hazardType]);

  const getRelevantMetrics = () => {
    switch (hazardType?.toLowerCase()) {
      case "flood":
        return monitoringData.filter(d => 
          d.category === "Weather Data" || d.category === "Hydrological"
        );
      case "earthquake":
        return monitoringData.filter(d => d.category === "Geological");
      case "wildfire":
        return monitoringData.filter(d => 
          d.category === "Satellite Data" || d.category === "Weather Data"
        );
      case "cyclone":
        return monitoringData.filter(d => 
          d.category === "Weather Data" || d.category === "Satellite Data"
        );
      default:
        return monitoringData;
    }
  };

  const statusColors = {
    normal: "bg-success",
    warning: "bg-warning",
    alert: "bg-destructive"
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 text-primary-foreground hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight capitalize">
              {hazardType} Monitoring
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Real-time data and historical analysis
            </p>
            <div className="flex items-center gap-2 mt-4">
              <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-destructive'}`} />
              <span className="text-sm">
                {isConnected ? "Live Data Stream Active" : "Connecting..."}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-12 space-y-8">
        {/* Real-time Monitoring */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Activity className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Real-time Metrics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getRelevantMetrics().map((category) => (
              <Card key={category.category} className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-xl text-card-foreground">{category.category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.metrics.map((metric) => (
                    <div key={metric.label} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-card-foreground">{metric.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-card-foreground">{metric.value}</span>
                          <Badge className={statusColors[metric.status]} variant="secondary">
                            {metric.status}
                          </Badge>
                        </div>
                      </div>
                      <Progress
                        value={metric.status === "alert" ? 90 : metric.status === "warning" ? 60 : 30}
                        className="h-2"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Risk Assessment */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Current Risk Assessment</h2>
          </div>
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Risk Level Analysis</CardTitle>
              <CardDescription>Based on current monitoring data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-gradient-subtle border border-border">
                  <div className="text-sm text-muted-foreground mb-1">Overall Risk</div>
                  <div className="text-2xl font-bold text-warning">Medium</div>
                </div>
                <div className="p-4 rounded-lg bg-gradient-subtle border border-border">
                  <div className="text-sm text-muted-foreground mb-1">Affected Areas</div>
                  <div className="text-2xl font-bold text-foreground">3 Regions</div>
                </div>
                <div className="p-4 rounded-lg bg-gradient-subtle border border-border">
                  <div className="text-sm text-muted-foreground mb-1">Population at Risk</div>
                  <div className="text-2xl font-bold text-foreground">~50,000</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Historical Events */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Recent Events</h2>
          </div>
          <Card className="border-border bg-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 text-sm font-semibold text-card-foreground">Date</th>
                      <th className="text-left p-4 text-sm font-semibold text-card-foreground">Location</th>
                      <th className="text-left p-4 text-sm font-semibold text-card-foreground">Intensity</th>
                      <th className="text-left p-4 text-sm font-semibold text-card-foreground">Casualties</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {historicalData.map((event, index) => (
                      <tr key={index} className="hover:bg-muted/30 transition-colors">
                        <td className="p-4 text-card-foreground">{event.date}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="text-card-foreground">{event.location}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge
                            className={
                              event.intensity === "High"
                                ? "bg-destructive"
                                : event.intensity === "Medium"
                                ? "bg-warning"
                                : "bg-success"
                            }
                          >
                            {event.intensity}
                          </Badge>
                        </td>
                        <td className="p-4 text-card-foreground">{event.casualties}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default HazardDetail;
