export type AdminRole = "super_admin" | "admin_agency";

export interface AdminUser {
  _id: string;
  email: string;
  password: string; // mock only - plain text for demo
  name: string;
  role: AdminRole;
  agencyId?: string; // only for admin_agency
  avatar?: string;
  status: "active" | "suspended";
  createdAt: string;
  lastLogin?: string;
}

export interface AgencyAccount {
  _id: string;
  name: string;
  location: string;
  adminId: string;
  vehicleCount: number;
  reservationCount: number;
  revenue: number;
  status: "active" | "suspended";
  createdAt: string;
}

export interface ActivityLog {
  _id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface SiteSettings {
  siteName: string;
  currency: string;
  maintenanceMode: boolean;
  allowNewBookings: boolean;
  commissionRate: number;
}
