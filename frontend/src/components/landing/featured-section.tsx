import { useState, useEffect } from "react";
import { VehicleCard } from "@/components/vehicle-card";
import { vehicleApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function FeaturedSection() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const data = await vehicleApi.getAll();

        // Get one vehicle of each type
        const car = data?.find((v: any) => v.type === "car" && v.availability);
        const moto = data?.find((v: any) => v.type === "moto" && v.availability);
        const trottinette = data?.find((v: any) => v.type === "trottinette" && v.availability);

        const featuredVehicles = [car, moto, trottinette].filter(Boolean);
        setFeatured(featuredVehicles);
      } catch (error) {
        console.error("Error fetching featured vehicles:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
          <div className="text-center">Loading popular vehicles...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Popular vehicles
            </h2>
            <p className="mt-2 text-muted-foreground">
              Most booked rides this month across Morocco.
            </p>
          </div>
          <Button variant="ghost" asChild className="hidden md:flex">
            <Link to="/vehicles">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((vehicle: any) => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} />
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Button asChild>
            <Link to="/vehicles">
              View All Vehicles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
