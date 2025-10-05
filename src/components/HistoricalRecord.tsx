import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, TrendingUp, DollarSign, Users, Loader2 } from "lucide-react";
import { mockApi } from "@/services/mockApi";

export const HistoricalRecords = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await mockApi.getHistoricalEvents();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching historical events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-card-foreground flex items-center gap-3">
            <Clock className="h-8 w-8 text-primary" />
            Historical Disaster Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-card-foreground flex items-center gap-3">
          <Clock className="h-8 w-8 text-primary" />
          Historical Disaster Records
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-secondary/30 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground text-lg">{event.type}</h4>
                    <Badge variant="outline" className="border-primary text-primary">
                      {event.intensity}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {event.date}
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-1 text-destructive">
                    <Users className="h-4 w-4" />
                    <span className="font-semibold">{event.casualties}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">casualties</p>
                  <div className="flex items-center gap-1 text-warning mt-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold">{event.economicLoss}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">economic loss</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
