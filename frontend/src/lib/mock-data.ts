import type { Vehicle, Reservation, Payment } from "./types";

const agency = {
  _id: "ag1",
  name: "KriGo Casablanca",
  location: "Casablanca, Morocco",
};

export const vehicles: Vehicle[] = [
  {
    _id: "v1",
    type: "car",
    brand: "Mercedes",
    model: "C-Class 2024",
    price_per_day: 850,
    availability: true,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=500&fit=crop",
    description:
      "Experience luxury and performance with the Mercedes C-Class. Perfect for business trips and long-distance travel across Morocco.",
    agency,
    specs: { seats: 5, fuel: "Diesel", transmission: "Automatic", topSpeed: "250 km/h" },
  },
  {
    _id: "v2",
    type: "car",
    brand: "BMW",
    model: "3 Series",
    price_per_day: 750,
    availability: true,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=500&fit=crop",
    description:
      "The ultimate driving machine. BMW 3 Series offers dynamic handling and modern technology for an unforgettable road experience.",
    agency,
    specs: { seats: 5, fuel: "Gasoline", transmission: "Automatic", topSpeed: "240 km/h" },
  },
  {
    _id: "v3",
    type: "car",
    brand: "Dacia",
    model: "Duster",
    price_per_day: 350,
    availability: true,
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=500&fit=crop",
    description:
      "Rugged and reliable SUV perfect for exploring Moroccan landscapes. Great value for money with ample cargo space.",
    agency,
    specs: { seats: 5, fuel: "Diesel", transmission: "Manual", topSpeed: "180 km/h" },
  },
  {
    _id: "v4",
    type: "car",
    brand: "Renault",
    model: "Clio",
    price_per_day: 250,
    availability: false,
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=500&fit=crop",
    description:
      "Compact and fuel-efficient, the Renault Clio is ideal for city driving and navigating Moroccan medinas with ease.",
    agency,
    specs: { seats: 5, fuel: "Gasoline", transmission: "Manual", topSpeed: "190 km/h" },
  },
  {
    _id: "v5",
    type: "moto",
    brand: "Yamaha",
    model: "MT-07",
    price_per_day: 400,
    availability: true,
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&h=500&fit=crop",
    description:
      "A thrilling ride through the Atlas Mountains or coastal roads. The Yamaha MT-07 delivers pure riding excitement.",
    agency,
    specs: { seats: 2, fuel: "Gasoline", transmission: "Manual", topSpeed: "200 km/h" },
  },
  {
    _id: "v6",
    type: "moto",
    brand: "Honda",
    model: "CB500X",
    price_per_day: 350,
    availability: true,
    image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&h=500&fit=crop",
    description:
      "Versatile adventure motorcycle ready for any terrain. The Honda CB500X is your reliable companion on Moroccan roads.",
    agency,
    specs: { seats: 2, fuel: "Gasoline", transmission: "Manual", topSpeed: "180 km/h" },
  },
  {
    _id: "v7",
    type: "trottinette",
    brand: "Xiaomi",
    model: "Pro 2",
    price_per_day: 80,
    availability: true,
    image: "https://images.unsplash.com/photo-1604868189067-8a2dd87dba16?w=800&h=500&fit=crop",
    description:
      "Eco-friendly urban mobility at its finest. Perfect for exploring Marrakech or Rabat city centers without traffic hassle.",
    agency,
    specs: { range: "45 km", topSpeed: "25 km/h" },
  },
  {
    _id: "v8",
    type: "trottinette",
    brand: "Segway",
    model: "Ninebot Max",
    price_per_day: 100,
    availability: true,
    image: "https://images.unsplash.com/photo-1600132806608-8f91e4003b5e?w=800&h=500&fit=crop",
    description:
      "Premium electric scooter with extended range. Ideal for daily commutes and sightseeing in Moroccan cities.",
    agency,
    specs: { range: "65 km", topSpeed: "30 km/h" },
  },
  {
    _id: "v9",
    type: "car",
    brand: "Audi",
    model: "A4",
    price_per_day: 900,
    availability: true,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=500&fit=crop",
    description:
      "Sophisticated German engineering meets Moroccan roads. The Audi A4 offers premium comfort and cutting-edge technology.",
    agency,
    specs: { seats: 5, fuel: "Diesel", transmission: "Automatic", topSpeed: "245 km/h" },
  },
];

export const reservations: Reservation[] = [
  {
    _id: "r1",
    user: "user1",
    vehicle: vehicles[0],
    startDate: "2026-02-10",
    endDate: "2026-02-14",
    status: "accepted",
    totalPrice: 3400,
  },
  {
    _id: "r2",
    user: "user1",
    vehicle: vehicles[4],
    startDate: "2026-02-20",
    endDate: "2026-02-22",
    status: "pending",
    totalPrice: 800,
  },
  {
    _id: "r3",
    user: "user1",
    vehicle: vehicles[6],
    startDate: "2026-01-05",
    endDate: "2026-01-07",
    status: "cancelled",
    totalPrice: 160,
  },
  {
    _id: "r4",
    user: "user2",
    vehicle: vehicles[1],
    startDate: "2026-02-15",
    endDate: "2026-02-18",
    status: "pending",
    totalPrice: 2250,
  },
  {
    _id: "r5",
    user: "user2",
    vehicle: vehicles[7],
    startDate: "2026-03-01",
    endDate: "2026-03-03",
    status: "pending",
    totalPrice: 200,
  },
];

export const payments: Payment[] = [
  {
    _id: "p1",
    reservation: "r1",
    amount: 3400,
    currency: "MAD",
    method: "stripe",
    status: "completed",
    createdAt: "2026-02-08",
  },
  {
    _id: "p2",
    reservation: "r2",
    amount: 800,
    currency: "MAD",
    method: "paypal",
    status: "pending",
    createdAt: "2026-02-18",
  },
  {
    _id: "p3",
    reservation: "r3",
    amount: 160,
    currency: "MAD",
    method: "cash",
    status: "refunded",
    createdAt: "2026-01-04",
  },
];

export const unavailableDates: Date[] = [
  new Date("2026-02-10"),
  new Date("2026-02-11"),
  new Date("2026-02-12"),
  new Date("2026-02-13"),
  new Date("2026-02-14"),
];
