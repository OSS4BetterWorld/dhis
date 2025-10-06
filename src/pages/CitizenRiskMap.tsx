import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Navigation, Phone, Shield, Home } from "lucide-react";
import { mockApi, RiskZone, Shelter } from "@/services/mockRiskData";
import { Link } from "react-router-dom";

const CitizenRiskMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [riskZones, setRiskZones] = useState<RiskZone[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [selectedZone, setSelectedZone] = useState<RiskZone | null>(null);
  const [nearestShelter, setNearestShelter] = useState<Shelter | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapboxToken, setMapboxToken] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const [zonesData, sheltersData] = await Promise.all([
        mockApi.getRiskZones(),
        mockApi.getShelters(),
      ]);
      setRiskZones(zonesData);
      setShelters(sheltersData);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || loading) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [105.8342, 21.0245],
      zoom: 13,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.current.on("load", () => {
      // Add risk zones
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
              "fill-opacity": 0.4,
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

          map.current.on("click", zone.id, () => {
            setSelectedZone(zone);
          });
        }
      });

      // Add shelter markers
      shelters.forEach((shelter) => {
        const el = document.createElement("div");
        el.className = "shelter-marker";
        el.style.cssText = `
          background: hsl(var(--primary));
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        `;
        el.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>`;

        if (map.current) {
          new mapboxgl.Marker(el)
            .setLngLat(shelter.coordinates)
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(
                `<div style="padding: 8px;">
                  <h3 style="font-weight: 600; margin-bottom: 4px;">${shelter.name}</h3>
                  <p style="font-size: 12px; color: #666;">Capacity: ${shelter.capacity}</p>
                  <p style="font-size: 12px; color: #666;">Contact: ${shelter.contact}</p>
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
  }, [mapboxToken, loading, riskZones, shelters]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-warning text-foreground";
      case "low":
        return "bg-success text-primary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getSafetyTip = (zone: RiskZone) => {
    const tips: Record<string, string> = {
      flood: "Keep emergency supplies ready. Avoid low-lying areas during heavy rain. Know evacuation routes.",
      earthquake: "Secure heavy furniture. Keep emergency kit accessible. Practice drop-cover-hold drills.",
      landslide: "Avoid steep slopes during heavy rain. Watch for cracks in ground. Have evacuation plan ready.",
      fire: "Keep emergency contacts handy. Prepare masks and water. Clear dry vegetation around property.",
      storm: "Secure loose objects. Stay indoors during warnings. Keep emergency supplies stocked.",
    };
    return tips[zone.type] || "Stay alert and follow emergency guidelines.";
  };

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
                Please enter your Mapbox public token to view the risk map. You can get one from{" "}
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
            <h1 className="text-xl font-bold text-card-foreground">Risk Map - Citizen View</h1>
          </div>
          <Link to="/admin/risk-map">
            <Button variant="outline" size="sm">
              Admin View
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div ref={mapContainer} className="w-full h-[600px] rounded-lg" />
              </CardContent>
            </Card>

            {/* Legend */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Risk Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-destructive" />
                    <span className="text-sm">High Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-warning" />
                    <span className="text-sm">Medium Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-success" />
                    <span className="text-sm">Low Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <Shield className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="text-sm">Emergency Shelter</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Panel */}
          <div className="space-y-4">
            {/* Selected Zone Info */}
            {selectedZone ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{selectedZone.name}</CardTitle>
                      <CardDescription className="mt-1">{selectedZone.description}</CardDescription>
                    </div>
                    <Badge className={getRiskColor(selectedZone.riskLevel)}>
                      {selectedZone.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      Hazard Type
                    </h4>
                    <Badge variant="outline">{selectedZone.type.toUpperCase()}</Badge>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Population Affected</h4>
                    <p className="text-2xl font-bold text-primary">{selectedZone.population.toLocaleString()}</p>
                  </div>

                  {selectedZone.lastIncident && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Last Incident</h4>
                      <p className="text-sm text-muted-foreground">{selectedZone.lastIncident}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border">
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      Safety Tips
                    </h4>
                    <p className="text-sm text-muted-foreground">{getSafetyTip(selectedZone)}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Select a Zone</CardTitle>
                  <CardDescription>Click on a colored area on the map to view details</CardDescription>
                </CardHeader>
              </Card>
            )}

            {/* Nearest Shelters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Emergency Shelters
                </CardTitle>
                <CardDescription>Click shelter markers on map for details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {shelters.slice(0, 3).map((shelter) => (
                    <div key={shelter.id} className="p-3 rounded-lg border border-border bg-muted/30">
                      <h4 className="font-semibold text-sm mb-1">{shelter.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        Capacity: {shelter.capacity} people
                      </p>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{shelter.contact}</span>
                      </div>
                      <Badge
                        className="mt-2"
                        variant={shelter.status === "operational" ? "default" : "secondary"}
                      >
                        {shelter.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Emergency Hotline:</span>
                    <span className="font-semibold">115</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fire Department:</span>
                    <span className="font-semibold">114</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Police:</span>
                    <span className="font-semibold">113</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Medical Emergency:</span>
                    <span className="font-semibold">115</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenRiskMap;
