"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin } from "lucide-react";

// Helper to create custom marker icon
const createCustomIcon = () => {
    return L.divIcon({
        html: `
      <div class="relative flex items-center justify-center w-10 h-10 rounded-full bg-slate-950 border-2 border-white shadow-xl transform -translate-x-1/2 -translate-y-1/2 group hover:scale-110 transition-transform duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
      </div>
    `,
        className: "custom-leaflet-icon", // Use this class if additional global styles are needed
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
    });
};

const agencies = [
    {
        id: 1,
        name: "KriGo Oujda Center",
        position: [34.681123, -1.907727],
        address: "Bd Mohammed V, Oujda",
        type: "Headquarters",
        hours: "09:00 - 20:00"
    },
    {
        id: 2,
        name: "KriGo Airport Angads",
        position: [34.787222, -1.923889],
        address: "Oujda Angads Airport",
        type: "Pickup Point",
        hours: "24/7"
    },
    {
        id: 3,
        name: "KriGo Al Qods Partner",
        position: [34.670556, -1.932778],
        address: "Bd Al Qods, Oujda",
        type: "Partner Agency",
        hours: "08:30 - 19:00"
    }
];

export function AgencyMap() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <section className="py-24 bg-slate-50 dark:bg-slate-950/50">
                <div className="container px-4 mx-auto">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                            Our Locations
                        </h2>
                        <div className="w-full h-[500px] rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center">
                            <span className="text-slate-400 font-medium">Loading Map...</span>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-950/50 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
            <div className="absolute top-[100px] -left-[200px] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[0] -right-[200px] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="container px-4 mx-auto relative z-10">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-2">
                        <MapPin className="mr-1 h-3.5 w-3.5" />
                        Where to find us
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
                        Our Partner Agencies
                    </h2>
                    <p className="max-w-[700px] text-slate-600 dark:text-slate-400 md:text-lg">
                        Locate our official rental partners and pickup points across Oujda.
                        We are expanding to more cities soon.
                    </p>
                </div>

                <div className="mx-auto w-full max-w-6xl h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 relative group">
                    <MapContainer
                        center={[34.6850, -1.9100]}
                        zoom={12}
                        scrollWheelZoom={false}
                        style={{ height: "100%", width: "100%", zIndex: 1 }}
                        className="z-10"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        />
                        {/* Note: Using CartoDB Dark Matter tiles for premium dark theme look. 
                If light mode is preferred, we can switch based on theme or use standard OSM.
                For this premium design, dark map fits nicely. 
            */}

                        {agencies.map((agency) => (
                            <Marker
                                key={agency.id}
                                position={agency.position as [number, number]}
                                icon={createCustomIcon()}
                            >
                                <Popup className="custom-popup">
                                    <div className="p-1 min-w-[200px]">
                                        <h3 className="font-bold text-lg mb-1 text-slate-900">{agency.name}</h3>
                                        <p className="text-sm text-slate-600 mb-2">{agency.address}</p>
                                        <div className="flex items-center justify-between mt-3 text-xs">
                                            <span className="font-semibold text-primary">{agency.hours}</span>
                                            <span className="px-2 py-1 bg-slate-100 rounded-md text-slate-600 font-medium">
                                                {agency.type}
                                            </span>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>

                    {/* Overlay to ensure corners are rounded perfectly on all browsers */}
                    <div className="absolute inset-0 rounded-2xl border border-slate-200 dark:border-slate-800 pointer-events-none z-20 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]" />
                </div>
            </div>
        </section>
    );
}
