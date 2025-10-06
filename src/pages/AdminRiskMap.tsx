import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Layers,
  MapPin,
  BarChart3,
  Download,
  Upload,
  Home,
  Users,
  Building2,
  AlertTriangle,
} from "lucide-react";
import { mockApi, RiskZone, HazardLayer, CriticalFacility } from "@/services/mockRiskData";
import { Link } from "react-router-dom";

const AdminRiskMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [riskZones, setRiskZones] = useState<RiskZone[]>([]);
  const [hazardLayers, setHazardLayers] = useState<HazardLayer[]>([]);
  const [facilities, setFacilities] = useState<CriticalFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapboxToken, setMapboxToken] = useState("");
  const [activeTab, setActiveTab] = useState("layers");

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
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || loading) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [105.8342, 21.0245],
      zoom: 13,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.current.addControl(new mapboxgl.ScaleControl(), "bottom-left");

    map.current.on("load", () => {
      // Add all risk zones
      riskZones.forEach((zone) => {
        const color =
          zone.riskLevel === "high"
            ? "#dc2626"
            : zone.riskLevel === "medium"
            ? "#f59e0b"
            : "#16a34a";

        if (map.current) {
          map.current.addSource(zone.id, {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [zone.coordinates],
              },
              properties: zone,
            },
          });

          map.current.addLayer({
            id: zone.id,
            type: "fill",
            source: zone.id,
            paint: {
              "fill-color": color,
              "fill-opacity": 0.5,
            },
          });

          map.current.addLayer({
            id: `${zone.id}-border`,
            type: "line",
            source: zone.id,
            paint: {
              "line-color": color,
              "line-width": 2,
            },
          });

          // Add labels
          const center = zone.coordinates.reduce(
            (acc, coord) => [acc[0] + coord[0] / zone.coordinates.length, acc[1] + coord[1] / zone.coordinates.length],
            [0, 0]
          );

          const el = document.createElement("div");
          el.style.cssText = `
            background: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            border: 1px solid ${color};
            color: ${color};
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          `;
          el.textContent = zone.name;

          new mapboxgl.Marker(el)
            .setLngLat(center as [number, number])
            .addTo(map.current);
        }
      });

      // Add facility markers
      facilities.forEach((facility) => {
        const icons: Record<string, string> = {
          hospital: "⚕️",
          police: "👮",
          fire_station: "🚒",
          school: "🏫",
          power_plant: "⚡",
        };

        const el = document.createElement("div");
        el.style.cssText = `
          background: hsl(var(--primary));
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;
        el.textContent = icons[facility.type] || "📍";

        if (map.current) {
          new mapboxgl.Marker(el)
            .setLngLat(facility.coordinates)
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(
                `<div style="padding: 8px;">
                  <h3 style="font-weight: 600; margin-bottom: 4px;">${facility.name}</h3>
                  <p style="font-size: 12px; color: #666;">${facility.type.replace("_", " ").toUpperCase()}</p>
                  <p style="font-size: 12px; color: #666;">Status: ${facility.status}</p>
                  <p style="font-size: 12px; color: #666;">Contact: ${facility.contact}</p>
                </div>`
              )
            )
            .addTo(map.current);
        }
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, loading, riskZones, facilities]);

  const toggleLayer = (layerId: string) => {
    setHazardLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );

    if (map.current) {
      const layer = hazardLayers.find((l) => l.id === layerId);
      if (layer) {
        const visibility = layer.visible ? "none" : "visible";
        layer.data.forEach((zone: RiskZone) => {
          map.current?.setLayoutProperty(zone.id, "visibility", visibility);
          map.current?.setLayoutProperty(`${zone.id}-border`, "visibility", visibility);
        });
      }
    }
  };

  const calculateStats = () => {
    const totalPopulation = riskZones.reduce((sum, zone) => sum + zone.population, 0);
    const highRiskZones = riskZones.filter((z) => z.riskLevel === "high").length;
    const totalZones = riskZones.length;
    return { totalPopulation, highRiskZones, totalZones };
  };

  const stats = calculateStats();

  if (!mapboxToken) {
    return (
      <div className="min-h-screen bg-gradient-subtle p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Mapbox Token Required</CardTitle>
              <CardDescription>
                Please enter your Mapbox public token to view the admin risk map. Get one from{" "}
                <a
                  href="https://mapbox.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  mapbox.com
                </a>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="pk.eyJ1..."
                  className="w-full px-4 py-2 border rounded-md"
                  onChange={(e) => setMapboxToken(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  This is temporary. In production, this would be securely stored in backend configuration.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                <div ref={mapContainer} className="w-full h-[700px] rounded-lg" />
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
