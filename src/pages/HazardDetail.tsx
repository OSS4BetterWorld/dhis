import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Activity, AlertTriangle, TrendingUp, MapPin, Waves } from "lucide-react";
import { useMqttMonitoring } from "@/hooks/useMqttMonitoring";
import { GoogleMap, useJsApiLoader, Polygon, Marker, InfoWindow, Polyline } from "@react-google-maps/api";

const HazardDetail = () => {
  const { hazardType } = useParams<{ hazardType: string }>();
  const navigate = useNavigate();
  const { monitoringData, isConnected } = useMqttMonitoring();
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const googleMapsApiKey = 'AIzaSyDNnlU13kUEQjf1qUbGEdui0nP2SOLdExU';

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapsApiKey,
  });

  // Flood-specific map data that updates based on monitoring data
  const [floodZones, setFloodZones] = useState([
    {
      id: 1,
      name: "Critical Zone A",
      level: "High",
      coordinates: [
        { lat: 21.028511, lng: 105.804817 },
        { lat: 21.025511, lng: 105.814817 },
        { lat: 21.018511, lng: 105.812817 },
        { lat: 21.020511, lng: 105.802817 },
      ],
      waterLevel: 4.5,
      predictedLevel: 5.2,
    },
    {
      id: 2,
      name: "Warning Zone B",
      level: "Medium",
      coordinates: [
        { lat: 21.015511, lng: 105.820817 },
        { lat: 21.012511, lng: 105.828817 },
        { lat: 21.008511, lng: 105.825817 },
        { lat: 21.010511, lng: 105.818817 },
      ],
      waterLevel: 3.2,
      predictedLevel: 3.8,
    },
  ]);

  const [floodFlow, setFloodFlow] = useState([
    { lat: 21.035, lng: 105.800 },
    { lat: 21.030, lng: 105.808 },
    { lat: 21.022, lng: 105.815 },
    { lat: 21.015, lng: 105.822 },
    { lat: 21.008, lng: 105.828 },
  ]);

  const [waterLevelMarkers, setWaterLevelMarkers] = useState([
    { id: 1, position: { lat: 21.028511, lng: 105.804817 }, level: 4.5, status: "Critical", trend: "rising" },
    { id: 2, position: { lat: 21.015511, lng: 105.820817 }, level: 3.2, status: "Warning", trend: "stable" },
    { id: 3, position: { lat: 21.040, lng: 105.795 }, level: 2.1, status: "Normal", trend: "falling" },
  ]);

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

  // Update flood data based on real-time monitoring
  useEffect(() => {
    const waterData = monitoringData.find(d => d.category === "Hydrological");
    if (waterData) {
      // Simulate updating water levels based on monitoring data
      setWaterLevelMarkers(prev => prev.map(marker => ({
        ...marker,
        level: marker.level + (Math.random() - 0.5) * 0.3,
        trend: Math.random() > 0.5 ? "rising" : marker.trend,
      })));
    }
  }, [monitoringData]);

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

  const getZoneColor = (level: string) => {
    switch (level) {
      case "High":
        return "#ef4444";
      case "Medium":
        return "#f59e0b";
      case "Low":
        return "#22c55e";
      default:
        return "#3b82f6";
    }
  };

  const getMarkerIcon = (status: string) => {
    const colors = {
      Critical: "#ef4444",
      Warning: "#f59e0b",
      Normal: "#22c55e",
    };
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" fill="${colors[status as keyof typeof colors] || "#3b82f6"}" stroke="white" stroke-width="3"/>
        <text x="16" y="20" text-anchor="middle" fill="white" font-size="14" font-weight="bold">💧</text>
      </svg>
    `)}`;
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
        {/* Flood Map - Only show for flood hazard type */}
        {hazardType?.toLowerCase() === "flood" && isLoaded && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Waves className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">Live Flood Monitoring Map</h2>
            </div>
            <Card className="border-border bg-card overflow-hidden">
              <CardContent className="p-0">
                <div className="h-[600px] relative">
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={{ lat: 21.028511, lng: 105.804817 }}
                    zoom={13}
                    options={{
                      mapTypeControl: true,
                      streetViewControl: false,
                      fullscreenControl: true,
                    }}
                  >
                    {/* Flood Flow Lines */}
                    <Polyline
                      path={floodFlow}
                      options={{
                        strokeColor: "#3b82f6",
                        strokeOpacity: 0.8,
                        strokeWeight: 4,
                        icons: [{
                          icon: { path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
                          offset: '100%',
                          repeat: '100px'
                        }]
                      }}
                    />

                    {/* Flood Zones */}
                    {floodZones.map((zone) => (
                      <Polygon
                        key={zone.id}
                        paths={zone.coordinates}
                        options={{
                          fillColor: getZoneColor(zone.level),
                          fillOpacity: 0.35,
                          strokeColor: getZoneColor(zone.level),
                          strokeOpacity: 0.8,
                          strokeWeight: 2,
                        }}
                        onClick={() => setSelectedMarker({
                          type: "zone",
                          data: zone,
                          position: zone.coordinates[0],
                        })}
                      />
                    ))}

                    {/* Water Level Markers */}
                    {waterLevelMarkers.map((marker) => (
                      <Marker
                        key={marker.id}
                        position={marker.position}
                        icon={{
                          url: getMarkerIcon(marker.status),
                          scaledSize: new window.google.maps.Size(32, 32),
                        }}
                        onClick={() => setSelectedMarker({ type: "marker", data: marker, position: marker.position })}
                      />
                    ))}

                    {/* Info Window */}
                    {selectedMarker && (
                      <InfoWindow
                        position={selectedMarker.position}
                        onCloseClick={() => setSelectedMarker(null)}
                      >
                        <div className="p-2 min-w-[200px]">
                          {selectedMarker.type === "zone" ? (
                            <>
                              <h3 className="font-bold text-lg mb-2">{selectedMarker.data.name}</h3>
                              <div className="space-y-1 text-sm">
                                <p>
                                  <span className="font-semibold">Risk Level:</span>{" "}
                                  <span className={selectedMarker.data.level === "High" ? "text-red-600 font-bold" : "text-orange-500"}>
                                    {selectedMarker.data.level}
                                  </span>
                                </p>
                                <p>
                                  <span className="font-semibold">Current Water Level:</span> {selectedMarker.data.waterLevel}m
                                </p>
                                <p>
                                  <span className="font-semibold">Predicted Level:</span>{" "}
                                  <span className="text-red-600">{selectedMarker.data.predictedLevel}m</span>
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <h3 className="font-bold text-lg mb-2">Water Level Station #{selectedMarker.data.id}</h3>
                              <div className="space-y-1 text-sm">
                                <p>
                                  <span className="font-semibold">Current Level:</span> {selectedMarker.data.level.toFixed(2)}m
                                </p>
                                <p>
                                  <span className="font-semibold">Status:</span>{" "}
                                  <span
                                    className={
                                      selectedMarker.data.status === "Critical"
                                        ? "text-red-600 font-bold"
                                        : selectedMarker.data.status === "Warning"
                                        ? "text-orange-500"
                                        : "text-green-600"
                                    }
                                  >
                                    {selectedMarker.data.status}
                                  </span>
                                </p>
                                <p>
                                  <span className="font-semibold">Trend:</span>{" "}
                                  <span className={selectedMarker.data.trend === "rising" ? "text-red-600" : "text-green-600"}>
                                    {selectedMarker.data.trend === "rising" ? "↑ Rising" : selectedMarker.data.trend === "falling" ? "↓ Falling" : "→ Stable"}
                                  </span>
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                </div>
                {/* Map Legend */}
                <div className="p-4 bg-muted/50 border-t border-border">
                  <h4 className="font-semibold mb-3 text-card-foreground">Map Legend</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: "#ef4444" }}></div>
                      <span className="text-card-foreground">High Risk Zone</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: "#f59e0b" }}></div>
                      <span className="text-card-foreground">Medium Risk Zone</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#3b82f6" }}></div>
                      <span className="text-card-foreground">Flood Flow Direction</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">💧</span>
                      <span className="text-card-foreground">Water Level Station</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

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
