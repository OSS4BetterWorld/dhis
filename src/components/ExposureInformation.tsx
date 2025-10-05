import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Building2,
  Factory,
  Landmark,
  MapPin,
  Heart,
  Zap,
  Radio,
  Warehouse,
  ShoppingBag,
  Sprout,
  Loader2,
} from "lucide-react";
import { mockApi } from "@/services/mockApi";

export const ExposureInformation = () => {
  const [exposureData, setExposureData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExposureData = async () => {
      setLoading(true);
      try {
        const data = await mockApi.getExposureData();
        setExposureData(data);
      } catch (error) {
        console.error("Error fetching exposure data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExposureData();
  }, []);

  if (loading || !exposureData) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-card-foreground flex items-center gap-3">
            <MapPin className="h-8 w-8 text-primary" />
            Exposure Information
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-foreground">Urban Population</h4>
              </div>
              <p className="text-3xl font-bold text-foreground mb-2">
                {exposureData.population.urban.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total urban residents</p>
            </div>
            <div className="p-6 rounded-lg bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
              <div className="flex items-center gap-2 mb-4">
                <Sprout className="h-5 w-5 text-success" />
                <h4 className="font-semibold text-foreground">Rural Population</h4>
              </div>
              <p className="text-3xl font-bold text-foreground mb-2">
                {exposureData.population.rural.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total rural residents</p>
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-warning" />
                <span className="font-medium text-foreground">Children (0-14 years)</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {exposureData.population.vulnerableGroups.children.toLocaleString()}
              </p>
              <Progress value={22.5} className="h-2 mt-2" />
            </div>
            <div className="p-4 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="h-5 w-5 text-destructive" />
                <span className="font-medium text-foreground">Elderly (65+ years)</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {exposureData.population.vulnerableGroups.elderly.toLocaleString()}
              </p>
              <Progress value={11} className="h-2 mt-2" />
            </div>
            <div className="p-4 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">Disabled</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {exposureData.population.vulnerableGroups.disabled.toLocaleString()}
              </p>
              <Progress value={5} className="h-2 mt-2" />
            </div>
            <div className="p-4 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-accent" />
                <span className="font-medium text-foreground">Low-Income Households</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {exposureData.population.vulnerableGroups.lowIncome.toLocaleString()}
              </p>
              <Progress value={24} className="h-2 mt-2" />
            </div>
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 rounded-lg bg-secondary/30">
              <Heart className="h-8 w-8 text-destructive mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{exposureData.infrastructure.hospitals}</p>
              <p className="text-xs text-muted-foreground">Hospitals</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/30">
              <Building2 className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{exposureData.infrastructure.schools}</p>
              <p className="text-xs text-muted-foreground">Schools</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/30">
              <Zap className="h-8 w-8 text-warning mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{exposureData.infrastructure.powerPlants}</p>
              <p className="text-xs text-muted-foreground">Power Plants</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/30">
              <Radio className="h-8 w-8 text-success mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{exposureData.infrastructure.commTowers}</p>
              <p className="text-xs text-muted-foreground">Comm Towers</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/30">
              <MapPin className="h-8 w-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{exposureData.infrastructure.transportHubs}</p>
              <p className="text-xs text-muted-foreground">Transport Hubs</p>
            </div>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-secondary/30">
              <Factory className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{exposureData.economicAssets.factories}</p>
              <p className="text-xs text-muted-foreground">Factories</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/30">
              <Warehouse className="h-8 w-8 text-warning mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{exposureData.economicAssets.warehouses}</p>
              <p className="text-xs text-muted-foreground">Warehouses</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/30">
              <ShoppingBag className="h-8 w-8 text-success mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{exposureData.economicAssets.commercial}</p>
              <p className="text-xs text-muted-foreground">Commercial</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/30">
              <Sprout className="h-8 w-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{exposureData.economicAssets.farms}</p>
              <p className="text-xs text-muted-foreground">Farms</p>
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
              <Landmark className="h-10 w-10 text-accent mx-auto mb-3" />
              <p className="text-3xl font-bold text-foreground mb-1">{exposureData.culturalHeritage.temples}</p>
              <p className="text-sm text-muted-foreground">Temples</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <Landmark className="h-10 w-10 text-primary mx-auto mb-3" />
              <p className="text-3xl font-bold text-foreground mb-1">{exposureData.culturalHeritage.monuments}</p>
              <p className="text-sm text-muted-foreground">Monuments</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20">
              <Building2 className="h-10 w-10 text-warning mx-auto mb-3" />
              <p className="text-3xl font-bold text-foreground mb-1">{exposureData.culturalHeritage.archives}</p>
              <p className="text-sm text-muted-foreground">Archives</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
