import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Building2, 
  Factory, 
  Landmark, 
  MapPin,
  AlertCircle,
  Heart,
  GraduationCap,
  Zap,
  Radio,
  Plane,
  Package,
  ShoppingBag,
  Sprout
} from "lucide-react";

interface PopulationData {
  region: string;
  density: number;
  type: "urban" | "rural";
  population: number;
}

interface VulnerableGroup {
  category: string;
  count: number;
  percentage: number;
  icon: typeof Users;
}

interface Infrastructure {
  name: string;
  type: string;
  location: string;
  status: "operational" | "at-risk" | "damaged";
  icon: typeof Building2;
}

interface Asset {
  name: string;
  type: string;
  value: string;
  employees?: number;
  icon: typeof Factory;
}

interface Heritage {
  name: string;
  type: string;
  significance: "high" | "medium" | "low";
  yearBuilt?: string;
}

const populationData: PopulationData[] = [
  { region: "Central District", density: 8500, type: "urban", population: 450000 },
  { region: "Northern Zone", density: 6200, type: "urban", population: 320000 },
  { region: "Eastern Villages", density: 450, type: "rural", population: 85000 },
  { region: "Western Plains", density: 380, type: "rural", population: 62000 }
];

const vulnerableGroups: VulnerableGroup[] = [
  { category: "Children (0-14)", count: 185000, percentage: 20, icon: Users },
  { category: "Elderly (65+)", count: 138000, percentage: 15, icon: Heart },
  { category: "Disabled", count: 92000, percentage: 10, icon: AlertCircle },
  { category: "Low-income households", count: 230000, percentage: 25, icon: Users }
];

const criticalInfrastructure: Infrastructure[] = [
  { name: "Central Hospital", type: "Healthcare", location: "Central District", status: "operational", icon: Heart },
  { name: "Regional Medical Center", type: "Healthcare", location: "Northern Zone", status: "operational", icon: Heart },
  { name: "State University", type: "Education", location: "Central District", status: "operational", icon: GraduationCap },
  { name: "Primary School Network", type: "Education", location: "Multiple", status: "at-risk", icon: GraduationCap },
  { name: "Main Power Plant", type: "Energy", location: "Western Plains", status: "operational", icon: Zap },
  { name: "Telecom Tower Hub", type: "Communication", location: "Central District", status: "operational", icon: Radio },
  { name: "International Airport", type: "Transport", location: "Northern Zone", status: "operational", icon: Plane }
];

const economicAssets: Asset[] = [
  { name: "Industrial Park Alpha", type: "Manufacturing", value: "$450M", employees: 3500, icon: Factory },
  { name: "Distribution Center", type: "Logistics", value: "$180M", employees: 850, icon: Package },
  { name: "Shopping Mall Complex", type: "Commercial", value: "$220M", employees: 1200, icon: ShoppingBag },
  { name: "Agricultural Cooperative", type: "Agriculture", value: "$95M", employees: 2100, icon: Sprout }
];

const culturalHeritage: Heritage[] = [
  { name: "Ancient Temple Complex", type: "Religious Site", significance: "high", yearBuilt: "1420" },
  { name: "Historical Monument", type: "Monument", significance: "high", yearBuilt: "1856" },
  { name: "National Archives", type: "Archive", significance: "high", yearBuilt: "1932" },
  { name: "Old Town Hall", type: "Historic Building", significance: "medium", yearBuilt: "1889" }
];

export const ExposureInformation = () => {
  const statusColors = {
    operational: "bg-success text-primary-foreground",
    "at-risk": "bg-warning text-foreground",
    damaged: "bg-destructive text-destructive-foreground"
  };

  const significanceColors = {
    high: "bg-destructive text-destructive-foreground",
    medium: "bg-warning text-foreground",
    low: "bg-success text-primary-foreground"
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Exposure Information</h2>
        <p className="text-muted-foreground">Who and what is at risk in disaster-prone areas</p>
      </div>

      {/* Population Density */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-card-foreground flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Population Density
          </CardTitle>
          <CardDescription>Urban and rural population distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {populationData.map((data) => (
              <div key={data.region} className="p-4 rounded-lg bg-secondary/30 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">{data.region}</h4>
                  <Badge variant="outline" className="border-primary text-primary">
                    {data.type.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Population: <span className="font-medium text-foreground">{data.population.toLocaleString()}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Density: <span className="font-medium text-foreground">{data.density} per km²</span>
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vulnerable Groups */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-card-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Vulnerable Groups
          </CardTitle>
          <CardDescription>At-risk populations requiring priority protection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vulnerableGroups.map((group) => (
              <div key={group.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <group.icon className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">{group.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{group.count.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{group.percentage}% of population</p>
                  </div>
                </div>
                <Progress value={group.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Critical Infrastructure */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-card-foreground flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Critical Infrastructure
          </CardTitle>
          <CardDescription>Essential facilities and services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criticalInfrastructure.map((infra) => (
              <div
                key={infra.name}
                className="flex items-start gap-3 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="p-2 rounded-lg bg-gradient-primary">
                  <infra.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-foreground">{infra.name}</h4>
                    <Badge className={statusColors[infra.status]} variant="secondary">
                      {infra.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{infra.type}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {infra.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Economic Assets */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-card-foreground flex items-center gap-2">
            <Factory className="h-6 w-6 text-primary" />
            Economic Assets
          </CardTitle>
          <CardDescription>Key economic infrastructure and employment centers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {economicAssets.map((asset) => (
              <div
                key={asset.name}
                className="flex items-start gap-3 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="p-2 rounded-lg bg-gradient-primary">
                  <asset.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-semibold text-foreground">{asset.name}</h4>
                  <p className="text-sm text-muted-foreground">{asset.type}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground">
                      Value: <span className="font-medium text-foreground">{asset.value}</span>
                    </span>
                    {asset.employees && (
                      <span className="text-muted-foreground">
                        Employees: <span className="font-medium text-foreground">{asset.employees.toLocaleString()}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cultural Heritage */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-card-foreground flex items-center gap-2">
            <Landmark className="h-6 w-6 text-primary" />
            Cultural Heritage Sites
          </CardTitle>
          <CardDescription>Protected historical and cultural monuments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {culturalHeritage.map((heritage) => (
              <div
                key={heritage.name}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">{heritage.name}</h4>
                    <Badge className={significanceColors[heritage.significance]} variant="secondary">
                      {heritage.significance} significance
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{heritage.type}</p>
                </div>
                {heritage.yearBuilt && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Built</p>
                    <p className="text-lg font-semibold text-foreground">{heritage.yearBuilt}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
