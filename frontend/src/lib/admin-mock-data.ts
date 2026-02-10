import type {
  AdminUser,
  AgencyAccount,
  ActivityLog,
  SiteSettings,
} from "./admin-types";

export const adminUsers: AdminUser[] = [
  {
    _id: "sa1",
    email: "super@krigo.ma",
    password: "admin123",
    name: "Youssef El Amrani",
    role: "super_admin",
    status: "active",
    createdAt: "2025-01-01",
    lastLogin: "2026-02-06",
    avatar: "YE",
  },
  {
    _id: "aa1",
    email: "casa@krigo.ma",
    password: "agency123",
    name: "Karim Bennani",
    role: "admin_agency",
    agencyId: "ag1",
    status: "active",
    createdAt: "2025-03-15",
    lastLogin: "2026-02-05",
    avatar: "KB",
  },
  {
    _id: "aa2",
    email: "rabat@krigo.ma",
    password: "agency456",
    name: "Fatima Zahra",
    role: "admin_agency",
    agencyId: "ag2",
    status: "active",
    createdAt: "2025-06-20",
    lastLogin: "2026-02-04",
    avatar: "FZ",
  },
  {
    _id: "aa3",
    email: "marrakech@krigo.ma",
    password: "agency789",
    name: "Omar Idrissi",
    role: "admin_agency",
    agencyId: "ag3",
    status: "suspended",
    createdAt: "2025-08-10",
    lastLogin: "2026-01-20",
    avatar: "OI",
  },
];

export const agencies: AgencyAccount[] = [
  {
    _id: "ag1",
    name: "KriGo Casablanca",
    location: "Casablanca, Morocco",
    adminId: "aa1",
    vehicleCount: 9,
    reservationCount: 45,
    revenue: 127500,
    status: "active",
    createdAt: "2025-03-15",
  },
  {
    _id: "ag2",
    name: "KriGo Rabat",
    location: "Rabat, Morocco",
    adminId: "aa2",
    vehicleCount: 6,
    reservationCount: 28,
    revenue: 84000,
    status: "active",
    createdAt: "2025-06-20",
  },
  {
    _id: "ag3",
    name: "KriGo Marrakech",
    location: "Marrakech, Morocco",
    adminId: "aa3",
    vehicleCount: 4,
    reservationCount: 15,
    revenue: 42000,
    status: "suspended",
    createdAt: "2025-08-10",
  },
];

export const activityLogs: ActivityLog[] = [
  {
    _id: "log1",
    userId: "sa1",
    userName: "Youssef El Amrani",
    action: "Created agency account",
    target: "KriGo Marrakech",
    timestamp: "2025-08-10T10:30:00",
  },
  {
    _id: "log2",
    userId: "aa1",
    userName: "Karim Bennani",
    action: "Accepted reservation",
    target: "Mercedes C-Class - Ahmed E.",
    timestamp: "2026-02-05T14:20:00",
  },
  {
    _id: "log3",
    userId: "sa1",
    userName: "Youssef El Amrani",
    action: "Suspended account",
    target: "Omar Idrissi (Marrakech)",
    timestamp: "2026-01-25T09:15:00",
  },
  {
    _id: "log4",
    userId: "aa2",
    userName: "Fatima Zahra",
    action: "Added vehicle",
    target: "Toyota Corolla - Rabat",
    timestamp: "2026-02-04T16:45:00",
  },
  {
    _id: "log5",
    userId: "aa1",
    userName: "Karim Bennani",
    action: "Refused reservation",
    target: "BMW 3 Series - Sara M.",
    timestamp: "2026-02-03T11:00:00",
  },
  {
    _id: "log6",
    userId: "sa1",
    userName: "Youssef El Amrani",
    action: "Updated site settings",
    target: "Commission rate changed to 12%",
    timestamp: "2026-02-02T08:30:00",
  },
  {
    _id: "log7",
    userId: "aa1",
    userName: "Karim Bennani",
    action: "Updated vehicle",
    target: "Dacia Duster - Price updated",
    timestamp: "2026-02-01T13:10:00",
  },
  {
    _id: "log8",
    userId: "sa1",
    userName: "Youssef El Amrani",
    action: "Created agency account",
    target: "KriGo Rabat",
    timestamp: "2025-06-20T10:00:00",
  },
];

export const defaultSettings: SiteSettings = {
  siteName: "KriGo",
  currency: "MAD",
  maintenanceMode: false,
  allowNewBookings: true,
  commissionRate: 12,
};

// Revenue data for charts
export const monthlyRevenue = [
  { month: "Sep", revenue: 45000 },
  { month: "Oct", revenue: 62000 },
  { month: "Nov", revenue: 58000 },
  { month: "Dec", revenue: 71000 },
  { month: "Jan", revenue: 89000 },
  { month: "Feb", revenue: 95000 },
];

export const vehicleTypeDistribution = [
  { type: "Cars", count: 14, fill: "hsl(160, 84%, 39%)" },
  { type: "Motorcycles", count: 6, fill: "hsl(220, 14%, 50%)" },
  { type: "Scooters", count: 5, fill: "hsl(45, 93%, 47%)" },
];

export const bookingsByStatus = [
  { status: "Accepted", count: 32, fill: "hsl(160, 84%, 39%)" },
  { status: "Pending", count: 8, fill: "hsl(45, 93%, 47%)" },
  { status: "Refused", count: 5, fill: "hsl(0, 84%, 60%)" },
  { status: "Cancelled", count: 3, fill: "hsl(220, 14%, 50%)" },
];
