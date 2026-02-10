"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarDays, Search, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

export function HeroSection() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [vehicleType, setVehicleType] = useState("");

  function handleSearch() {
    const params = new URLSearchParams();
    if (vehicleType) params.set("type", vehicleType);
    if (dateRange?.from) params.set("from", dateRange.from.toISOString());
    if (dateRange?.to) params.set("to", dateRange.to.toISOString());
    navigate(`/vehicles?${params.toString()}`);
  }

  return (
    <section className="relative overflow-hidden bg-slate-950 min-h-[600px] lg:min-h-[700px] flex items-start pt-12 lg:pt-20">
      <div className="absolute inset-0 z-0">
        {/* Placeholder for the new image - ensure to add hero-bg.jpg to public folder */}
        <img
          src="/hero-bg.png"
          alt="Explore Morocco with KriGo"
          className="h-full w-full object-cover object-right opacity-90"
        />
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>
      <div className="relative z-10 w-full max-w-7xl px-4 py-8 lg:px-12 lg:py-12">
        <div className="max-w-xl">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-cyan-400/90">
            Vehicle Rental in Morocco
          </p>
          <h1 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-white md:text-4xl">
            Rent your freedom.
            {/* <br /> */}
            <span className="text-primary block mt-1">Explore Morocco.</span>
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-300/90">
            Premium cars, motorcycles, and electric scooters ready to take you anywhere. From Casablanca to Marrakech.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-background/95 backdrop-blur-sm p-4 shadow-2xl md:p-6 w-full max-w-md">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Select value={vehicleType} onValueChange={setVehicleType}>
              <SelectTrigger className="h-12 border-border/50 bg-background/50">
                <SelectValue placeholder="Vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="moto">Motorcycle</SelectItem>
                <SelectItem value="trottinette">Electric Scooter</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-12 justify-start font-normal text-muted-foreground border-border/50 bg-background/50">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <span className="text-foreground">
                        {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d")}
                      </span>
                    ) : (
                      <span className="text-foreground">{format(dateRange.from, "MMM d, yyyy")}</span>
                    )
                  ) : (
                    "Pick dates"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  disabled={{ before: new Date() }}
                />
              </PopoverContent>
            </Popover>

            <Button className="h-12 text-base shadow-lg shadow-primary/20" onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-8 text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="font-medium">25+ Premium Vehicles</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="font-medium">Major Cities</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="font-medium">Best Support</span>
          </div>
        </div>
      </div>
    </section>
  );
}
