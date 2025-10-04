import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HistoricalEvent {
  id: string;
  type: string;
  location: string;
  date: string;
  intensity: string;
  casualties?: number;
}

const historicalEvents: HistoricalEvent[] = [
  { id: "1", type: "Earthquake", location: "Japan", date: "2011-03-11", intensity: "9.1 Magnitude", casualties: 15899 },
  { id: "2", type: "Tsunami", location: "Indonesia", date: "2004-12-26", intensity: "Severe", casualties: 227898 },
  { id: "3", type: "Cyclone", location: "Myanmar", date: "2008-05-02", intensity: "Category 4", casualties: 138366 },
  { id: "4", type: "Flood", location: "Pakistan", date: "2010-07-29", intensity: "High", casualties: 1985 },
  { id: "5", type: "Wildfire", location: "Australia", date: "2020-01-08", intensity: "Extreme", casualties: 34 },
];

export const HistoricalRecords = () => {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-card-foreground flex items-center gap-2">
          Historical Records
          <Badge variant="secondary" className="bg-primary text-primary-foreground">
            {historicalEvents.length} Events
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {historicalEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">{event.type}</h4>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{event.location}</span>
                </div>
                <p className="text-sm text-muted-foreground">{event.date}</p>
              </div>
              <div className="text-right space-y-1">
                <Badge variant="outline" className="border-primary text-primary">{event.intensity}</Badge>
                {event.casualties && (
                  <p className="text-sm text-muted-foreground">{event.casualties.toLocaleString()} casualties</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
