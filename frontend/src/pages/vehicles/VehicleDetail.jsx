import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { vehicleApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Car, Bike, Zap, Users, Fuel, Settings2,
    MapPin, ArrowLeft, ShieldCheck, Clock, Gauge, ChevronLeft, ChevronRight,
} from "lucide-react";
import { differenceInDays, format } from "date-fns";
import { toast } from "sonner";

const typeIcons = { car: Car, moto: Bike, trottinette: Zap };
const typeLabels = { car: "Car", moto: "Motorcycle", trottinette: "Electric Scooter" };

export default function VehicleDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    // const vehicle = vehicles.find((v) => v._id === id);
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [dateRange, setDateRange] = useState();
    const [imageIndex, setImageIndex] = useState(0);

    useEffect(() => {
        const fetchVehicle = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = await vehicleApi.getById(id);
                setVehicle(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching vehicle:", err);
                setError("Failed to load vehicle details.");
            } finally {
                setLoading(false);
            }
        };

        fetchVehicle();
    }, [id]);

    const days = useMemo(() => {
        if (dateRange?.from) {
            const end = dateRange.to || dateRange.from;
            return differenceInDays(end, dateRange.from) + 1;
        }
        return 0;
    }, [dateRange]);

    const totalPrice = vehicle ? days * vehicle.price_per_day : 0;

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

    if (error || !vehicle) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold text-foreground">Vehicle not found</h2>
                <p className="mt-2 text-muted-foreground">{error || "The vehicle you are looking for does not exist."}</p>
                <Button className="mt-4" asChild>
                    <Link to="/vehicles">Back to Catalog</Link>
                </Button>
            </div>
        );
    }

    const TypeIcon = typeIcons[vehicle.type] || Car; // Fallback icon

    function handleBooking() {
        if (!dateRange?.from) {
            toast.error("Please select your rental dates.");
            return;
        }
        if (days < 1) {
            toast.error("Minimum rental period is 1 day.");
            return;
        }
        const endDate = dateRange.to || dateRange.from;
        const params = new URLSearchParams({
            vehicle: vehicle._id,
            from: dateRange.from.toISOString(),
            to: endDate.toISOString(),
            total: totalPrice.toString(),
        });
        navigate(`/checkout?${params.toString()}`);
    }

    // Simulate multiple images or use the single one
    const images = vehicle.images && vehicle.images.length > 0 ? vehicle.images : [vehicle.image || "/placeholder.svg"];

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
            <Button variant="ghost" size="sm" asChild className="mb-6">
                <Link to="/vehicles">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Catalog
                </Link>
            </Button>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Left: Images & Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Image Gallery */}
                    <div className="relative overflow-hidden rounded-2xl">
                        <div className="relative aspect-[16/9]">
                            <img
                                src={images[imageIndex] || "/placeholder.svg"}
                                alt={`${vehicle.brand} ${vehicle.model}`}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={() => setImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm transition-colors hover:bg-background"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm transition-colors hover:bg-background"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </>
                        )}
                        <div className="absolute bottom-3 left-3 flex gap-2">
                            <Badge className="bg-background/90 text-foreground backdrop-blur-sm border-0">
                                <TypeIcon className="mr-1 h-3 w-3" />
                                {typeLabels[vehicle.type]}
                            </Badge>
                            {vehicle.availability ? (
                                <Badge className="bg-emerald-500/90 text-emerald-50 border-0">Available</Badge>
                            ) : (
                                <Badge variant="destructive">Unavailable</Badge>
                            )}
                        </div>
                    </div>

                    {/* Thumbnails */}
                    <div className="flex gap-2">
                        {images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setImageIndex(i)}
                                className={`relative h-16 w-24 overflow-hidden rounded-lg border-2 transition-colors ${i === imageIndex ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                                    }`}
                            >
                                <img src={img || "/placeholder.svg"} alt="" className="object-cover w-full h-full" />
                            </button>
                        ))}
                    </div>

                    {/* Vehicle Info */}
                    <div>
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">
                                    {vehicle.brand} {vehicle.model}
                                </h1>
                                <p className="mt-1 flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    {vehicle.agency.location}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-primary">{vehicle.price_per_day} MAD</p>
                                <p className="text-sm text-muted-foreground">per day</p>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        <p className="leading-relaxed text-muted-foreground">{vehicle.description}</p>

                        {/* Specs */}
                        {vehicle.specs && (
                            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                                {vehicle.specs.seats && (
                                    <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
                                        <Users className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Seats</p>
                                            <p className="font-medium text-foreground">{vehicle.specs.seats}</p>
                                        </div>
                                    </div>
                                )}
                                {vehicle.specs.fuel && (
                                    <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
                                        <Fuel className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Fuel</p>
                                            <p className="font-medium text-foreground">{vehicle.specs.fuel}</p>
                                        </div>
                                    </div>
                                )}
                                {vehicle.specs.transmission && (
                                    <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
                                        <Settings2 className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Transmission</p>
                                            <p className="font-medium text-foreground">{vehicle.specs.transmission}</p>
                                        </div>
                                    </div>
                                )}
                                {vehicle.specs.topSpeed && (
                                    <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
                                        <Gauge className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Top Speed</p>
                                            <p className="font-medium text-foreground">{vehicle.specs.topSpeed}</p>
                                        </div>
                                    </div>
                                )}
                                {vehicle.specs.range && (
                                    <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
                                        <Zap className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Range</p>
                                            <p className="font-medium text-foreground">{vehicle.specs.range}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Booking Panel */}
                <div>
                    <Card className="sticky top-24 border-border">
                        <CardHeader>
                            <CardTitle className="text-lg text-card-foreground">Book this vehicle</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div>
                                <p className="mb-2 text-sm font-medium text-card-foreground">Select dates</p>
                                <Calendar
                                    mode="range"
                                    selected={dateRange}
                                    onSelect={setDateRange}
                                    disabled={[
                                        { before: new Date() },
                                        ...(vehicle.unavailableDates || []).map((d) => new Date(d))
                                    ]}
                                    className="rounded-xl border border-border"
                                />
                            </div>

                            {dateRange?.from && (
                                <div className="space-y-2 rounded-xl bg-muted p-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {format(dateRange.from, "MMM d")} - {format(dateRange.to || dateRange.from, "MMM d, yyyy")}
                                        </span>
                                        <span className="text-foreground">{days} day{days !== 1 ? "s" : ""}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {vehicle.price_per_day} MAD x {days} day{days !== 1 ? "s" : ""}
                                        </span>
                                        <span className="text-foreground">{totalPrice} MAD</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-semibold">
                                        <span className="text-foreground">Total</span>
                                        <span className="text-primary">{totalPrice} MAD</span>
                                    </div>
                                </div>
                            )}

                            <Button
                                className="w-full"
                                size="lg"
                                disabled={!vehicle.availability || !dateRange?.from}
                                onClick={handleBooking}
                            >
                                {vehicle.availability ? "Proceed to Checkout" : "Unavailable"}
                            </Button>

                            <div className="space-y-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-primary" /> Full insurance included
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-primary" /> Free cancellation up to 24h before
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
