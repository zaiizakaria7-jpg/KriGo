export type VehicleType = "car" | "moto" | "trottinette";

export interface Vehicle {
  _id: string;
  type: VehicleType;
  brand: string;
  model: string;
  price_per_day: number;
  availability: boolean;
  image: string;
  description: string;
  agency: Agency;
  specs?: {
    seats?: number;
    fuel?: string;
    transmission?: string;
    topSpeed?: string;
    range?: string;
  };
}

export interface Agency {
  _id: string;
  name: string;
  location: string;
}

export interface Reservation {
  _id: string;
  user: string;
  vehicle: Vehicle;
  startDate: string;
  endDate: string;
  status: "pending" | "accepted" | "refused" | "cancelled";
  totalPrice: number;
}

export interface Payment {
  _id: string;
  reservation: string;
  amount: number;
  currency: string;
  method: "stripe" | "paypal" | "cash";
  status: "pending" | "completed" | "failed" | "refunded";
  createdAt: string;
}
