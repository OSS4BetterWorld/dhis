import { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader, Polygon, Marker, InfoWindow } from "@react-google-maps/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Layers,
  Download,
  Upload,
  Home,
  Users,
  Building2,
  AlertTriangle,
} from "lucide-react";
import { mockApi, RiskZone, HazardLayer, CriticalFacility } from "@/services/mockRiskData";
import { Link } from "react-router-dom";

const containerStyle = {
  width: "100%",
  height: "700px",
};

const center = {
  lat: 21.0245,
  lng: 105.8342,
};

const AdminRiskMap = () => {
  const [riskZones, setRiskZones] = useState<RiskZone[]>([]);
  const [hazardLayers, setHazardLayers] = useState<HazardLayer[]>([]);
  const [facilities, setFacilities] = useState<CriticalFacility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<CriticalFacility | null>(null);
  const [loading, setLoading] = useState(true);
  const googleMapsApiKey = 'AIzaSyDNnlU13kUEQjf1qUbGEdui0nP2SOLdExU';
  const [activeTab, setActiveTab] = useState("layers");
  const [visibleZones, setVisibleZones] = useState<Set<string>>(new Set());

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapsApiKey,
  });

  useEffect(() => {
    const loadData = async () => {
      const [zonesData, layersData, facilitiesData] = await Promise.all([
        mockApi.getRiskZones(),
        mockApi.getHazardLayers(),
        mockApi.getCriticalFacilities(),
      ]);
      setRiskZones(zonesData);
      setHazardLayers(layersData);
      setFacilities(facilitiesData);
      
      // Initially show flood zones
      const floodZones = zonesData.filter(z => z.type === "flood").map(z => z.id);
      setVisibleZones(new Set(floodZones));
      
      setLoading(false);
    };
    loadData();
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "#dc2626";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#16a34a";
      default:
        return "#6b7280";
    }
  };

  const toggleLayer = (layerId: string) => {
    setHazardLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );

    const layer = hazardLayers.find((l) => l.id === layerId);
    if (layer) {
      const newVisibleZones = new Set(visibleZones);
      layer.data.forEach((zone: RiskZone) => {
        if (layer.visible) {
          newVisibleZones.delete(zone.id);
        } else {
          newVisibleZones.add(zone.id);
        }
      });
      setVisibleZones(newVisibleZones);
    }
  };

  const calculateStats = () => {
    const totalPopulation = riskZones.reduce((sum, zone) => sum + zone.population, 0);
    const highRiskZones = riskZones.filter((z) => z.riskLevel === "high").length;
    const totalZones = riskZones.length;
    return { totalPopulation, highRiskZones, totalZones };
  };

  const stats = calculateStats();

  const getFacilityIcon = (type: string) => {
    const icons: Record<string, string> = {
      hospital: "⚕️",
      police: "👮",
      fire_station: "🚒",
      school: "🏫",
      power_plant: "⚡",
    };
    return icons[type] || "📍";
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <div className="h-6 w-px bg-border" />
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-card-foreground">Risk Map - Admin Dashboard</h1>
          </div>
          <div className="flex gap-2">
            <Link to="/risk-map">
              <Button variant="outline" size="sm">
                Citizen View
              </Button>
            </Link>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Risk Zones</p>
                  <p className="text-3xl font-bold text-card-foreground">{stats.totalZones}</p>
                </div>
                <Layers className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Risk Zones</p>
                  <p className="text-3xl font-bold text-destructive">{stats.highRiskZones}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Population at Risk</p>
                  <p className="text-3xl font-bold text-card-foreground">
                    {stats.totalPopulation.toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical Facilities</p>
                  <p className="text-3xl font-bold text-card-foreground">{facilities.length}</p>
                </div>
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-0">
                {isLoaded && !loading ? (
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={13}
                    options={{
                      mapTypeControl: true,
                      streetViewControl: false,
                      fullscreenControl: true,
                      scaleControl: true,
                    }}
                  >
                    {/* Risk Zone Polygons */}
                    {riskZones
                      .filter((zone) => visibleZones.has(zone.id))
                      .map((zone) => {
                        const paths = zone.coordinates.map((coord) => ({
                          lat: coord[1],
                          lng: coord[0],
                        }));

                        // Calculate center for label
                        const centerLat =
                          zone.coordinates.reduce((sum, coord) => sum + coord[1], 0) /
                          zone.coordinates.length;
                        const centerLng =
                          zone.coordinates.reduce((sum, coord) => sum + coord[0], 0) /
                          zone.coordinates.length;

                        return (
                          <div key={zone.id}>
                            <Polygon
                              paths={paths}
                              options={{
                                fillColor: getRiskColor(zone.riskLevel),
                                fillOpacity: 0.5,
                                strokeColor: getRiskColor(zone.riskLevel),
                                strokeOpacity: 1,
                                strokeWeight: 2,
                                clickable: false,
                              }}
                            />
                            <Marker
                              position={{ lat: centerLat, lng: centerLng }}
                              icon={{
                                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                                  <svg xmlns="http://www.w3.org/2000/svg" width="120" height="30">
                                    <rect width="120" height="30" rx="4" fill="white" stroke="${getRiskColor(
                                      zone.riskLevel
                                    )}" stroke-width="1"/>
                                    <text x="60" y="20" font-family="Arial" font-size="11" font-weight="600" fill="${getRiskColor(
                                      zone.riskLevel
                                    )}" text-anchor="middle">${zone.name}</text>
                                  </svg>
                                `)}`,
                                scaledSize: new google.maps.Size(120, 30),
                                anchor: new google.maps.Point(60, 15),
                              }}
                            />
                          </div>
                        );
                      })}

                    {/* Facility Markers */}
                    {facilities.map((facility) => (
                      <Marker
                        key={facility.id}
                        position={{ lat: facility.coordinates[1], lng: facility.coordinates[0] }}
                        icon={{
                          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">
                              <circle cx="20" cy="20" r="18" fill="hsl(213 94% 25%)" stroke="white" stroke-width="3"/>
                              <text x="20" y="27" font-size="20" text-anchor="middle">${getFacilityIcon(
                                facility.type
                              )}</text>
                            </svg>
                          `)}`,
                          scaledSize: new google.maps.Size(40, 40),
                          anchor: new google.maps.Point(20, 20),
                        }}
                        onClick={() => setSelectedFacility(facility)}
                      />
                    ))}

                    {/* Facility Info Window */}
                    {selectedFacility && (
                      <InfoWindow
                        position={{
                          lat: selectedFacility.coordinates[1],
                          lng: selectedFacility.coordinates[0],
                        }}
                        onCloseClick={() => setSelectedFacility(null)}
                      >
                        <div style={{ padding: "8px", minWidth: "200px" }}>
                          <h3 style={{ fontWeight: 600, marginBottom: "4px", fontSize: "14px" }}>
                            {selectedFacility.name}
                          </h3>
                          <p style={{ fontSize: "12px", color: "#666", margin: "2px 0" }}>
                            {selectedFacility.type.replace("_", " ").toUpperCase()}
                          </p>
                          <p style={{ fontSize: "12px", color: "#666", margin: "2px 0" }}>
                            Status: {selectedFacility.status}
                          </p>
                          <p style={{ fontSize: "12px", color: "#666", margin: "2px 0" }}>
                            Contact: {selectedFacility.contact}
                          </p>
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                ) : (
                  <div className="w-full h-[700px] flex items-center justify-center bg-muted">
                    <p className="text-muted-foreground">Loading map...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Control Panel</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="layers">Layers</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  </TabsList>

                  <TabsContent value="layers" className="space-y-4 mt-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Hazard Layers</h4>
                      <div className="space-y-3">
                        {hazardLayers.map((layer) => (
                          <div
                            key={layer.id}
                            className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
                          >
                            <span className="text-sm">{layer.name}</span>
                            <Switch
                              checked={layer.visible}
                              onCheckedChange={() => toggleLayer(layer.id)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <h4 className="text-sm font-semibold mb-3">Data Management</h4>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload GeoJSON
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Download className="h-4 w-4 mr-2" />
                          Export Zones
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="analytics" className="space-y-4 mt-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Risk Distribution</h4>
                      <div className="space-y-2">
                        {["high", "medium", "low"].map((level) => {
                          const count = riskZones.filter((z) => z.riskLevel === level).length;
                          const percentage = (count / riskZones.length) * 100;
                          return (
                            <div key={level}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="capitalize">{level}</span>
                                <span className="font-semibold">{count} zones</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    level === "high"
                                      ? "bg-destructive"
                                      : level === "medium"
                                      ? "bg-warning"
                                      : "bg-success"
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <h4 className="text-sm font-semibold mb-3">Hazard Types</h4>
                      <div className="space-y-2">
                        {Array.from(new Set(riskZones.map((z) => z.type))).map((type) => {
                          const count = riskZones.filter((z) => z.type === type).length;
                          return (
                            <div key={type} className="flex justify-between text-sm">
                              <Badge variant="outline" className="capitalize">
                                {type}
                              </Badge>
                              <span className="text-muted-foreground">{count} zones</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Zone List */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">All Risk Zones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {riskZones.map((zone) => (
                    <div
                      key={zone.id}
                      className="p-2 rounded-md border border-border hover:bg-muted/50 cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h5 className="text-xs font-semibold">{zone.name}</h5>
                        <Badge
                          variant="outline"
                          className={
                            zone.riskLevel === "high"
                              ? "border-destructive text-destructive"
                              : zone.riskLevel === "medium"
                              ? "border-warning text-warning"
                              : "border-success text-success"
                          }
                        >
                          {zone.riskLevel}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Population: {zone.population.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRiskMap;
