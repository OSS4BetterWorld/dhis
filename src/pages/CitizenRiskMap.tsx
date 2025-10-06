import { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader, Polygon, Marker, InfoWindow } from "@react-google-maps/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Phone, Shield, Home } from "lucide-react";
import { mockApi, RiskZone, Shelter } from "@/services/mockRiskData";
import { Link } from "react-router-dom";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const center = {
  lat: 21.0245,
  lng: 105.8342,
};

const CitizenRiskMap = () => {
  const [riskZones, setRiskZones] = useState<RiskZone[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [selectedZone, setSelectedZone] = useState<RiskZone | null>(null);
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  const [loading, setLoading] = useState(true);
  const googleMapsApiKey = 'AIzaSyDNnlU13kUEQjf1qUbGEdui0nP2SOLdExU';

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapsApiKey,
  });

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

  const getRiskBadgeColor = (level: string) => {
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
                {isLoaded && !loading ? (
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={13}
                    options={{
                      mapTypeControl: true,
                      streetViewControl: false,
                      fullscreenControl: true,
                    }}
                  >
                    {/* Risk Zone Polygons */}
                    {riskZones.map((zone) => {
                      const paths = zone.coordinates.map((coord) => ({
                        lat: coord[1],
                        lng: coord[0],
                      }));

                      return (
                        <Polygon
                          key={zone.id}
                          paths={paths}
                          options={{
                            fillColor: getRiskColor(zone.riskLevel),
                            fillOpacity: 0.4,
                            strokeColor: getRiskColor(zone.riskLevel),
                            strokeOpacity: 1,
                            strokeWeight: 2,
                            clickable: true,
                          }}
                          onClick={() => setSelectedZone(zone)}
                        />
                      );
                    })}

                    {/* Shelter Markers */}
                    {shelters.map((shelter) => (
                      <Marker
                        key={shelter.id}
                        position={{ lat: shelter.coordinates[1], lng: shelter.coordinates[0] }}
                        icon={{
                          path: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
                          fillColor: "hsl(213 94% 25%)",
                          fillOpacity: 1,
                          strokeColor: "#ffffff",
                          strokeWeight: 2,
                          scale: 1.5,
                        }}
                        onClick={() => setSelectedShelter(shelter)}
                      />
                    ))}

                    {/* Shelter Info Window */}
                    {selectedShelter && (
                      <InfoWindow
                        position={{
                          lat: selectedShelter.coordinates[1],
                          lng: selectedShelter.coordinates[0],
                        }}
                        onCloseClick={() => setSelectedShelter(null)}
                      >
                        <div style={{ padding: "8px", minWidth: "200px" }}>
                          <h3 style={{ fontWeight: 600, marginBottom: "4px", fontSize: "14px" }}>
                            {selectedShelter.name}
                          </h3>
                          <p style={{ fontSize: "12px", color: "#666", margin: "2px 0" }}>
                            Capacity: {selectedShelter.capacity}
                          </p>
                          <p style={{ fontSize: "12px", color: "#666", margin: "2px 0" }}>
                            Contact: {selectedShelter.contact}
                          </p>
                          <p style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>
                            Status: {selectedShelter.status}
                          </p>
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                ) : (
                  <div className="w-full h-[600px] flex items-center justify-center bg-muted">
                    <p className="text-muted-foreground">Loading map...</p>
                  </div>
                )}
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
                    <Badge className={getRiskBadgeColor(selectedZone.riskLevel)}>
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
