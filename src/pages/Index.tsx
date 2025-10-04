import { DisasterCard } from "@/components/DisasterCard";
import { HistoricalRecords } from "@/components/HistoricalRecord";
import { MonitoringDashboard } from "@/components/MonitoringDashboard";
import { 
  CloudRain, 
  Waves, 
  Wind, 
  Flame, 
  Mountain, 
  Activity,
  AlertTriangle,
  Factory
} from "lucide-react";

const Index = () => {
  const disasterTypes = [
    {
      title: "Earthquake",
      description: "Seismic activity and ground movement monitoring",
      icon: Activity,
      severity: "medium" as const,
      lastEvent: "2024-03-15, 5.2 magnitude"
    },
    {
      title: "Flood",
      description: "Water level tracking and flood risk assessment",
      icon: CloudRain,
      severity: "high" as const,
      lastEvent: "2024-10-02, Regional flooding"
    },
    {
      title: "Tsunami",
      description: "Ocean wave monitoring and coastal alerts",
      icon: Waves,
      severity: "low" as const,
      lastEvent: "2023-11-08, Minor warning"
    },
    {
      title: "Cyclone",
      description: "Storm system tracking and wind monitoring",
      icon: Wind,
      severity: "medium" as const,
      lastEvent: "2024-09-20, Category 3"
    },
    {
      title: "Wildfire",
      description: "Fire hotspot detection and spread prediction",
      icon: Flame,
      severity: "high" as const,
      lastEvent: "2024-10-01, Active fires"
    },
    {
      title: "Landslide",
      description: "Slope stability and soil movement analysis",
      icon: Mountain,
      severity: "medium" as const,
      lastEvent: "2024-08-12, Minor slides"
    },
    {
      title: "Epidemic",
      description: "Disease outbreak tracking and health monitoring",
      icon: AlertTriangle,
      severity: "low" as const,
      lastEvent: "2024-07-30, Contained"
    },
    {
      title: "Industrial Accident",
      description: "Facility monitoring and hazardous material tracking",
      icon: Factory,
      severity: "low" as const,
      lastEvent: "2024-06-15, Minor incident"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="bg-gradient-primary text-primary-foreground py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">
              Disaster Hazard Identification System
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl">
              Real-time monitoring, historical analysis, and predictive insights for natural and man-made disasters
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-12 space-y-12">
        {/* Disaster Types Grid */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Monitored Hazard Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {disasterTypes.map((disaster) => (
              <DisasterCard key={disaster.title} {...disaster} />
            ))}
          </div>
        </section>

        {/* Historical Records */}
        <section>
          <HistoricalRecords />
        </section>

        {/* Monitoring Dashboard */}
        <section>
          <MonitoringDashboard />
        </section>
      </div>
    </div>
  );
};

export default Index;
