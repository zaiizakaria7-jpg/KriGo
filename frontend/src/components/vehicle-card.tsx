import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Bike, Zap, Users, Fuel, Settings2 } from "lucide-react";

type VehicleType = 'car' | 'moto' | 'trottinette';

const typeIcons: Record<VehicleType, typeof Car> = {
  car: Car,
  moto: Bike,
  trottinette: Zap,
};

const typeLabels: Record<VehicleType, string> = {
  car: "Car",
  moto: "Motorcycle",
  trottinette: "Scooter",
};

interface Vehicle {
  _id: string;
  type: VehicleType;
  brand: string;
  model: string;
  image?: string;
  availability: boolean;
  price_per_day: number;
  agency: {
    location: string;
  };
  specs?: {
    seats?: number;
    fuel?: string;
    transmission?: string;
    range?: string;
  };
}

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const TypeIcon = typeIcons[vehicle.type];

  return (
    <Card className="group overflow-hidden border-border bg-card transition-shadow hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={vehicle.image || "/placeholder.svg"}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge className="bg-card/90 text-card-foreground backdrop-blur-sm border-0">
            <TypeIcon className="mr-1 h-3 w-3" />
            {typeLabels[vehicle.type]}
          </Badge>
        </div>
        {!vehicle.availability && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/50">
            <Badge variant="destructive" className="text-sm">Unavailable</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-card-foreground">{vehicle.brand} {vehicle.model}</h3>
            <p className="text-sm text-muted-foreground">{vehicle.agency.location}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">{vehicle.price_per_day} MAD</p>
            <p className="text-xs text-muted-foreground">per day</p>
          </div>
        </div>
        {vehicle.specs && (
          <div className="mb-3 flex gap-3 text-xs text-muted-foreground">
            {vehicle.specs.seats && (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" /> {vehicle.specs.seats}
              </span>
            )}
            {vehicle.specs.fuel && (
              <span className="flex items-center gap-1">
                <Fuel className="h-3 w-3" /> {vehicle.specs.fuel}
              </span>
            )}
            {vehicle.specs.transmission && (
              <span className="flex items-center gap-1">
                <Settings2 className="h-3 w-3" /> {vehicle.specs.transmission}
              </span>
            )}
            {vehicle.specs.range && (
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3" /> {vehicle.specs.range}
              </span>
            )}
          </div>
        )}
        <Button asChild className="w-full" disabled={!vehicle.availability}>
          <Link to={`/vehicles/${vehicle._id}`}>
            {vehicle.availability ? "Book Now" : "Unavailable"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
