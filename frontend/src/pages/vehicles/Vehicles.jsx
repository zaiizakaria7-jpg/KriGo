import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { vehicleApi } from "@/lib/api";
import { VehicleCard } from "@/components/vehicle-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal, Search, X } from "lucide-react";

function Filters({
    type,
    setType,
    brand,
    setBrand,
    priceRange,
    setPriceRange,
    availableOnly,
    setAvailableOnly,
    searchQuery,
    setSearchQuery,
    brands // NEW: Pass dynamic brands
}) {
    return (
        <div className="space-y-6">
            <div>
                <Label className="mb-2 block text-sm font-medium text-foreground">Search</Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search vehicles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <div>
                <Label className="mb-2 block text-sm font-medium text-foreground">Vehicle Type</Label>
                <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                        <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="car">Cars</SelectItem>
                        <SelectItem value="moto">Motorcycles</SelectItem>
                        <SelectItem value="trottinette">Electric Scooters</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label className="mb-2 block text-sm font-medium text-foreground">Brand</Label>
                <Select value={brand} onValueChange={setBrand}>
                    <SelectTrigger>
                        <SelectValue placeholder="All brands" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Brands</SelectItem>
                        {brands.map((b) => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label className="mb-3 block text-sm font-medium text-foreground">
                    Max Price: {priceRange[0]} MAD/day
                </Label>
                <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={50}
                    max={1000}
                    step={50}
                />
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>50 MAD</span>
                    <span>1000 MAD</span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-foreground">Available only</Label>
                <Switch checked={availableOnly} onCheckedChange={setAvailableOnly} />
            </div>
        </div>
    );
}

export default function VehiclesPage() {
    const [searchParams] = useSearchParams();
    const initialType = searchParams.get("type") || "all";

    const [type, setType] = useState(initialType);
    const [brand, setBrand] = useState("all");
    const [priceRange, setPriceRange] = useState([1000]);
    const [availableOnly, setAvailableOnly] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch vehicles from API
    useEffect(() => {
        const fetchVehicles = async () => {
            setLoading(true);
            try {
                // We construct precise query params for the backend
                const params = {};
                if (type !== 'all') params.type = type;
                if (availableOnly) params.availability = 'true';
                if (searchQuery) params.search = searchQuery;
                params.maxPrice = priceRange[0];

                const data = await vehicleApi.getAll(params);
                setVehicles(data);
            } catch (error) {
                console.error("Failed to fetch vehicles", error);
                // Optionally show toast error here
            } finally {
                setLoading(false);
            }
        };

        // Debounce search slightly
        const timer = setTimeout(() => {
            fetchVehicles();
        }, 300);

        return () => clearTimeout(timer);
    }, [type, availableOnly, searchQuery, priceRange]); // priceRange change triggers fetch now

    // Client-side brand filtering (since backend might not have brand filter yet, or we want combo)
    // Actually, let's filter brands from the loaded vehicles to populate the dropdown
    const uniqueBrands = useMemo(() => Array.from(new Set(vehicles.map((v) => v.brand))), [vehicles]);

    const displayVehicles = useMemo(() => {
        return vehicles.filter((v) => {
            if (brand !== 'all' && v.brand !== brand) return false;
            return true;
        });
    }, [vehicles, brand]);


    const filterProps = {
        type, setType, brand, setBrand, priceRange, setPriceRange,
        availableOnly, setAvailableOnly, searchQuery, setSearchQuery,
        brands: uniqueBrands // Pass dynamic brands
    };

    function clearFilters() {
        setType("all");
        setBrand("all");
        setPriceRange([1000]);
        setAvailableOnly(false);
        setSearchQuery("");
    }

    const hasActiveFilters = type !== "all" || brand !== "all" || priceRange[0] < 1000 || availableOnly || searchQuery;

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Vehicle Catalog</h1>
                <p className="mt-1 text-muted-foreground">
                    Browse our fleet of {displayVehicles.length} vehicles across Morocco.
                </p>
            </div>

            <div className="flex gap-8">
                {/* Desktop Sidebar Filters */}
                <aside className="hidden w-64 shrink-0 lg:block">
                    <div className="sticky top-24 rounded-2xl border border-border bg-card p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="font-semibold text-card-foreground">Filters</h2>
                            {hasActiveFilters && (
                                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground">
                                    <X className="mr-1 h-3 w-3" />Clear
                                </Button>
                            )}
                        </div>
                        <Filters {...filterProps} />
                    </div>
                </aside>

                {/* Mobile Filter Sheet */}
                <div className="mb-4 lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm">
                                <SlidersHorizontal className="mr-2 h-4 w-4" />
                                Filters
                                {hasActiveFilters && (
                                    <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">!</span>
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-80">
                            <div className="mt-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-foreground">Filters</h2>
                                    {hasActiveFilters && (
                                        <Button variant="ghost" size="sm" onClick={clearFilters}>Clear all</Button>
                                    )}
                                </div>
                                <Filters {...filterProps} />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Vehicle Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="flex min-h-[400px] items-center justify-center text-muted-foreground">Loading vehicles...</div>
                    ) : (
                        <>
                            <div className="mb-4 flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    {displayVehicles.length} vehicle{displayVehicles.length !== 1 ? "s" : ""} found
                                </p>
                            </div>
                            {displayVehicles.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                                    {displayVehicles.map((vehicle) => (
                                        <VehicleCard key={vehicle._id} vehicle={vehicle} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
                                    <Search className="mb-4 h-10 w-10 text-muted-foreground/50" />
                                    <h3 className="text-lg font-semibold text-foreground">No vehicles found</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters.</p>
                                    <Button variant="outline" className="mt-4 bg-transparent" onClick={clearFilters}>
                                        Clear all filters
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
