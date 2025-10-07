import { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, MapPin, Navigation, Package, Users, Clock, CheckCircle2, XCircle, PlayCircle } from 'lucide-react';
import { mockIncidentApi, type IncidentReport, type RescueTeam } from '@/services/mockIncidentData';
import { useToast } from '@/hooks/use-toast';

const containerStyle = {
  width: '100%',
  height: '600px'
};

const center = {
  lat: 10.7769,
  lng: 106.7009
};

const IncidentReportPage = () => {
  const googleMapsApiKey = 'AIzaSyDNnlU13kUEQjf1qUbGEdui0nP2SOLdExU';
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [rescueTeams, setRescueTeams] = useState<RescueTeam[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<RescueTeam | null>(null);
  const [showEvidence, setShowEvidence] = useState(false);
  const { toast } = useToast();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleMapsApiKey
  });

  useEffect(() => {
    loadData();
    // Simulate real-time updates
    const interval = setInterval(() => {
      updateRealTimeData();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const [incidentsData, teamsData] = await Promise.all([
      mockIncidentApi.getIncidents(),
      mockIncidentApi.getRescueTeams()
    ]);
    setIncidents(incidentsData);
    setRescueTeams(teamsData);
  };

  const updateRealTimeData = () => {
    setRescueTeams(prev => prev.map(team => {
      if (team.status === 'en-route' && team.route && team.route.length > 1) {
        const newRoute = team.route.slice(1);
        return {
          ...team,
          currentLocation: team.route[1],
          route: newRoute.length > 0 ? newRoute : undefined,
          status: newRoute.length === 0 ? 'on-site' : 'en-route'
        };
      }
      return team;
    }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#f59e0b';
      case 'low': return '#84cc16';
      default: return '#6b7280';
    }
  };

  const getTeamIcon = (type: string) => {
    const baseUrl = 'https://maps.google.com/mapfiles/ms/icons/';
    switch (type) {
      case 'rescue': return baseUrl + 'red-dot.png';
      case 'medical': return baseUrl + 'blue-dot.png';
      case 'delivery': return baseUrl + 'green-dot.png';
      default: return baseUrl + 'yellow-dot.png';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, "destructive" | "default" | "secondary" | "outline"> = {
      critical: 'destructive',
      high: 'destructive',
      medium: 'default',
      low: 'secondary'
    };
    return variants[priority] || 'default';
  };

  const getResourceIcon = (type: string) => {
    const icons: Record<string, string> = {
      medical: '🏥',
      food: '🍱',
      water: '💧',
      boat: '🚤',
      blanket: '🛏️',
      fuel: '⛽',
      other: '📦'
    };
    return icons[type] || '📦';
  };

  const getUrgentIcon = (type: string) => {
    const icons: Record<string, string> = {
      injured: '🩹',
      child: '👶',
      infant: '🍼',
      pregnant: '🤰',
      elderly: '👴',
      disabled: '♿'
    };
    return icons[type] || '⚠️';
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Incident Report Management</h1>
              <p className="text-muted-foreground mt-1">Real-time monitoring and response coordination</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                {incidents.filter(i => i.status !== 'resolved').length} Active
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {rescueTeams.filter(t => t.status !== 'standby').length} Teams Deployed
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Live Incident Map</CardTitle>
                <CardDescription>Click on markers to view incident details</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoaded && (
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={13}
                  >
                    {/* Incident Markers */}
                    {incidents.map((incident) => (
                      <Marker
                        key={incident.id}
                        position={incident.location}
                        icon={{
                          path: google.maps.SymbolPath.CIRCLE,
                          scale: 12,
                          fillColor: getSeverityColor(incident.severity),
                          fillOpacity: 0.8,
                          strokeColor: '#fff',
                          strokeWeight: 2
                        }}
                        onClick={() => {
                          setSelectedIncident(incident);
                          setShowEvidence(false);
                        }}
                      />
                    ))}

                    {/* Rescue Team Markers and Routes */}
                    {rescueTeams.map((team) => (
                      <div key={team.id}>
                        <Marker
                          position={team.currentLocation}
                          icon={getTeamIcon(team.type)}
                          onClick={() => setSelectedTeam(team)}
                        />
                        {team.route && (
                          <Polyline
                            path={team.route}
                            options={{
                              strokeColor: team.type === 'rescue' ? '#dc2626' : team.type === 'medical' ? '#2563eb' : '#16a34a',
                              strokeOpacity: 0.7,
                              strokeWeight: 3
                            }}
                          />
                        )}
                      </div>
                    ))}

                    {/* Incident InfoWindow */}
                    {selectedIncident && !showEvidence && (
                      <InfoWindow
                        position={selectedIncident.location}
                        onCloseClick={() => setSelectedIncident(null)}
                      >
                        <div className="p-2 max-w-xs">
                          <h3 className="font-bold text-lg mb-2">{selectedIncident.type}</h3>
                          <p className="text-sm mb-2">{selectedIncident.description}</p>
                          <div className="flex gap-2 mb-2">
                            <Badge style={{ backgroundColor: getSeverityColor(selectedIncident.severity) }}>
                              {selectedIncident.severity}
                            </Badge>
                            <Badge variant="outline">{selectedIncident.status}</Badge>
                          </div>
                          <Button size="sm" onClick={() => setShowEvidence(true)}>
                            View Evidence
                          </Button>
                        </div>
                      </InfoWindow>
                    )}

                    {/* Evidence InfoWindow */}
                    {selectedIncident && showEvidence && (
                      <InfoWindow
                        position={selectedIncident.location}
                        onCloseClick={() => {
                          setShowEvidence(false);
                          setSelectedIncident(null);
                        }}
                      >
                        <div className="p-2 max-w-sm">
                          <h3 className="font-bold mb-2">Evidence</h3>
                          <div className="space-y-2">
                            {selectedIncident.evidence.photos.length > 0 && (
                              <div>
                                <p className="text-sm font-medium mb-1">Photos:</p>
                                <div className="grid grid-cols-2 gap-2">
                                  {selectedIncident.evidence.photos.map((photo, idx) => (
                                    <img key={idx} src={photo} alt={`Evidence ${idx + 1}`} className="w-full h-20 object-cover rounded" />
                                  ))}
                                </div>
                              </div>
                            )}
                            {selectedIncident.evidence.videos.length > 0 && (
                              <div>
                                <p className="text-sm font-medium mb-1">Videos:</p>
                                <div className="flex gap-2">
                                  {selectedIncident.evidence.videos.map((_, idx) => (
                                    <Button key={idx} size="sm" variant="outline">
                                      <PlayCircle className="w-4 h-4 mr-1" />
                                      Video {idx + 1}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </InfoWindow>
                    )}

                    {/* Team InfoWindow */}
                    {selectedTeam && (
                      <InfoWindow
                        position={selectedTeam.currentLocation}
                        onCloseClick={() => setSelectedTeam(null)}
                      >
                        <div className="p-2">
                          <h3 className="font-bold mb-1">{selectedTeam.name}</h3>
                          <p className="text-sm mb-1">Type: {selectedTeam.type}</p>
                          <p className="text-sm mb-1">Status: {selectedTeam.status}</p>
                          <p className="text-sm mb-1">Members: {selectedTeam.members}</p>
                          {selectedTeam.eta && <p className="text-sm font-medium">ETA: {selectedTeam.eta}</p>}
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-1">
            <Tabs defaultValue="resources" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="urgent">Urgent</TabsTrigger>
                <TabsTrigger value="teams">Teams</TabsTrigger>
              </TabsList>

              {/* Resource Needs */}
              <TabsContent value="resources" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Resource Needs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {incidents.flatMap(incident => 
                      incident.resourceNeeds.map(resource => (
                        <Card key={resource.id} className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{getResourceIcon(resource.type)}</span>
                              <div>
                                <p className="font-medium capitalize">{resource.type}</p>
                                <p className="text-sm text-muted-foreground">Qty: {resource.quantity}</p>
                              </div>
                            </div>
                            <Badge variant={getPriorityBadge(resource.priority)}>
                              {resource.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4" />
                            <span className="text-muted-foreground">{incident.location.address}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            {resource.status === 'needed' && <XCircle className="w-4 h-4 text-destructive" />}
                            {resource.status === 'en-route' && <Navigation className="w-4 h-4 text-primary" />}
                            {resource.status === 'delivered' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                            <span className="text-sm capitalize">{resource.status}</span>
                          </div>
                        </Card>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Urgent Cases */}
              <TabsContent value="urgent" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Urgent Cases
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {incidents.flatMap(incident =>
                      incident.urgentCases.map(urgentCase => (
                        <Card key={urgentCase.id} className="p-4 border-l-4 border-destructive">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{getUrgentIcon(urgentCase.type)}</span>
                              <div>
                                <p className="font-medium capitalize">{urgentCase.type}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {urgentCase.description}
                                </p>
                              </div>
                            </div>
                            <Badge variant="destructive">
                              {urgentCase.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm mt-2">
                            <MapPin className="w-4 h-4" />
                            <span className="text-muted-foreground">{incident.location.address}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={urgentCase.status === 'evacuated' ? 'outline' : 'default'}>
                              {urgentCase.status}
                            </Badge>
                          </div>
                        </Card>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Rescue Teams */}
              <TabsContent value="teams" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Rescue Teams
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {rescueTeams.map(team => (
                      <Card key={team.id} className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium">{team.name}</p>
                            <p className="text-sm text-muted-foreground capitalize">{team.type} Team</p>
                          </div>
                          <Badge variant={team.status === 'on-site' ? 'default' : 'outline'}>
                            {team.status}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{team.members} members</span>
                          </div>
                          {team.eta && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>ETA: {team.eta}</span>
                            </div>
                          )}
                          <div className="mt-2">
                            <p className="font-medium mb-1">Resources:</p>
                            <div className="flex flex-wrap gap-1">
                              {team.resources.map((resource, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {resource}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentReportPage;
