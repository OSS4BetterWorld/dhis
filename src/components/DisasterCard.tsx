import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface DisasterCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  severity: "high" | "medium" | "low";
  lastEvent?: string;
}

export const DisasterCard = ({ title, description, icon: Icon, severity, lastEvent }: DisasterCardProps) => {
  const severityColors = {
    high: "bg-destructive text-destructive-foreground",
    medium: "bg-warning text-foreground",
    low: "bg-success text-primary-foreground"
  };

  return (
    <Link to={`/hazard/${title.toLowerCase()}`} className="block">
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-card cursor-pointer">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-xl bg-gradient-primary">
              <Icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <Badge className={severityColors[severity]} variant="secondary">
              {severity.toUpperCase()}
            </Badge>
          </div>
          <CardTitle className="text-xl font-semibold text-card-foreground">{title}</CardTitle>
          <CardDescription className="text-muted-foreground">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {lastEvent && (
            <p className="text-sm text-muted-foreground">
              Last recorded: <span className="font-medium text-foreground">{lastEvent}</span>
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
