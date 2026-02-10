# Next.js to React (Vite) Migration Guide

## Project Structure Mapping

### Complete File Migration Map

```
Next.js (app/)                          →  React (src/)
================================================================================
app/globals.css                         →  src/globals.css
app/layout.tsx                          →  src/layouts/MainLayout.jsx
app/page.tsx                            →  src/pages/Home.jsx

app/vehicles/page.tsx                   →  src/pages/vehicles/Vehicles.jsx
app/vehicles/[id]/page.tsx              →  src/pages/vehicles/VehicleDetail.jsx

app/checkout/page.tsx                   →  src/pages/checkout/Checkout.jsx
app/dashboard/page.tsx                  →  src/pages/dashboard/Dashboard.jsx

app/admin/page.tsx                      →  src/pages/admin/AdminRedirect.jsx
app/admin/login/page.tsx                →  src/pages/admin/login/AdminLogin.jsx

app/admin/agency/page.tsx               →  src/pages/admin/agency/AgencyDashboard.jsx
app/admin/agency/analytics/page.tsx     →  src/pages/admin/agency/analytics/AgencyAnalytics.jsx
app/admin/agency/reservations/page.tsx  →  src/pages/admin/agency/reservations/AgencyReservations.jsx
app/admin/agency/vehicles/page.tsx      →  src/pages/admin/agency/vehicles/AgencyVehicles.jsx

app/admin/super/page.tsx                →  src/pages/admin/super/SuperDashboard.jsx
app/admin/super/activity/page.tsx       →  src/pages/admin/super/activity/SuperActivity.jsx
app/admin/super/agencies/page.tsx       →  src/pages/admin/super/agencies/SuperAgencies.jsx
app/admin/super/analytics/page.tsx      →  src/pages/admin/super/analytics/SuperAnalytics.jsx
app/admin/super/reservations/page.tsx   →  src/pages/admin/super/reservations/SuperReservations.jsx
app/admin/super/settings/page.tsx       →  src/pages/admin/super/settings/SuperSettings.jsx
app/admin/super/users/page.tsx          →  src/pages/admin/super/users/SuperUsers.jsx
app/admin/super/vehicles/page.tsx       →  src/pages/admin/super/vehicles/SuperVehicles.jsx

components/                             →  src/components/ (keep as-is)
hooks/                                  →  src/hooks/ (keep as-is)
lib/                                    →  src/lib/ (keep as-is)
public/                                 →  public/ (keep as-is)
styles/                                 →  src/styles/ (keep as-is)
```

## Code Changes Required

### 1. Next.js-specific Imports → React Router

```javascript
// BEFORE (Next.js)
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// AFTER (React Router)
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
// Image: use standard <img /> tag
```

### 2. Router Methods

```javascript
// BEFORE (Next.js)
const router = useRouter();
router.push("/path");
router.replace("/path");
router.back();

// AFTER (React Router)
const navigate = useNavigate();
navigate("/path");
navigate("/path", { replace: true });
navigate(-1);
```

### 3. Dynamic Routes

```javascript
// BEFORE (Next.js)
// File: app/vehicles/[id]/page.tsx
import { useParams } from "next/navigation";
const { id } = useParams();

// AFTER (React Router)
// File: src/pages/vehicles/VehicleDetail.jsx
// Route in App.jsx: <Route path="/vehicles/:id" element={<VehicleDetail />} />
import { useParams } from "react-router-dom";
const { id } = useParams();
```

### 4. Link Component

```javascript
// BEFORE (Next.js)
<Link href="/vehicles">View Vehicles</Link>

// AFTER (React Router)
<Link to="/vehicles">View Vehicles</Link>
```

### 5. Image Component

```javascript
// BEFORE (Next.js)
<Image src="/logo.png" alt="Logo" width={100} height={100} />

// AFTER (React)
<img src="/logo.png" alt="Logo" width="100" height="100" />
```

### 6. Client Components

```javascript
// BEFORE (Next.js)
"use client";  // Remove this directive

// AFTER (React)
// No directive needed - all components are client-side by default
```

### 7. TypeScript to JavaScript

```javascript
// BEFORE (.tsx)
export default function Page(): JSX.Element {
  const [count, setCount] = useState<number>(0);
}

// AFTER (.jsx)
export default function Page() {
  const [count, setCount] = useState(0);
}
```

### 8. Metadata (Next.js) → HTML (React)

```javascript
// BEFORE (Next.js layout.tsx)
export const metadata = {
  title: "KriGo - Rent Your Freedom",
  description: "Premium vehicle rental"
};

// AFTER (React index.html)
<head>
  <title>KriGo - Rent Your Freedom</title>
  <meta name="description" content="Premium vehicle rental" />
</head>
```

## Routing Setup

### App.jsx Routes

```javascript
<Routes>
  {/* Public Routes */}
  <Route path="/" element={<Home />} />
  <Route path="/vehicles" element={<Vehicles />} />
  <Route path="/vehicles/:id" element={<VehicleDetail />} />
  <Route path="/checkout" element={<Checkout />} />
  <Route path="/dashboard" element={<Dashboard />} />

  {/* Admin Routes */}
  <Route path="/admin" element={<AdminRedirect />} />
  <Route path="/admin/login" element={<AdminLogin />} />
  
  {/* Admin Agency Routes */}
  <Route path="/admin/agency" element={<AgencyDashboard />} />
  <Route path="/admin/agency/analytics" element={<AgencyAnalytics />} />
  <Route path="/admin/agency/reservations" element={<AgencyReservations />} />
  <Route path="/admin/agency/vehicles" element={<AgencyVehicles />} />
  
  {/* Admin Super Routes */}
  <Route path="/admin/super" element={<SuperDashboard />} />
  <Route path="/admin/super/activity" element={<SuperActivity />} />
  <Route path="/admin/super/agencies" element={<SuperAgencies />} />
  <Route path="/admin/super/analytics" element={<SuperAnalytics />} />
  <Route path="/admin/super/reservations" element={<SuperReservations />} />
  <Route path="/admin/super/settings" element={<SuperSettings />} />
  <Route path="/admin/super/users" element={<SuperUsers />} />
  <Route path="/admin/super/vehicles" element={<SuperVehicles />} />
</Routes>
```

## Package.json Changes

### Dependencies to Add

```json
{
  "dependencies": {
    "react-router-dom": "^6.22.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.1.0",
    "eslint": "^8.56.0"
  }
}
```

### Dependencies to Remove

```json
{
  "dependencies": {
    "next": "16.1.6",  // Remove
    "next-themes": "^0.4.6"  // Remove (or keep if compatible)
  }
}
```

### Scripts to Update

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  }
}
```

## Files Created

### New Configuration Files

1. **vite.config.js** - Vite configuration with path aliases
2. **index.html** - HTML entry point
3. **src/main.jsx** - React entry point
4. **src/App.jsx** - Main app with routing
5. **src/layouts/MainLayout.jsx** - Layout wrapper

### Migrated Pages (Completed)

✅ src/pages/Home.jsx
✅ src/pages/admin/AdminRedirect.jsx
✅ src/pages/admin/login/AdminLogin.jsx

### Remaining Pages to Migrate

The following pages need to be copied from `app/` to `src/pages/` with the changes listed above:

- [ ] src/pages/vehicles/Vehicles.jsx
- [ ] src/pages/vehicles/VehicleDetail.jsx
- [ ] src/pages/checkout/Checkout.jsx
- [ ] src/pages/dashboard/Dashboard.jsx
- [ ] src/pages/admin/agency/AgencyDashboard.jsx
- [ ] src/pages/admin/agency/analytics/AgencyAnalytics.jsx
- [ ] src/pages/admin/agency/reservations/AgencyReservations.jsx
- [ ] src/pages/admin/agency/vehicles/AgencyVehicles.jsx
- [ ] src/pages/admin/super/SuperDashboard.jsx
- [ ] src/pages/admin/super/activity/SuperActivity.jsx
- [ ] src/pages/admin/super/agencies/SuperAgencies.jsx
- [ ] src/pages/admin/super/analytics/SuperAnalytics.jsx
- [ ] src/pages/admin/super/reservations/SuperReservations.jsx
- [ ] src/pages/admin/super/settings/SuperSettings.jsx
- [ ] src/pages/admin/super/users/SuperUsers.jsx
- [ ] src/pages/admin/super/vehicles/SuperVehicles.jsx

## Minimal Changes Summary

### What Changed:
1. ✅ File extensions: `.tsx` → `.jsx`
2. ✅ Imports: `next/navigation` → `react-router-dom`
3. ✅ Router hooks: `useRouter()` → `useNavigate()`
4. ✅ Link component: `href` → `to`
5. ✅ Image component: `<Image />` → `<img />`
6. ✅ Removed: `"use client"` directives
7. ✅ Removed: TypeScript type annotations
8. ✅ Removed: Next.js metadata exports

### What Stayed the Same:
- ✅ All component logic
- ✅ All JSX structure
- ✅ All styling (Tailwind classes)
- ✅ All business logic
- ✅ All data fetching patterns
- ✅ All UI components
- ✅ All hooks
- ✅ All utilities
- ✅ All context providers

## Next Steps

1. **Copy remaining components and lib files to src/**
   ```bash
   xcopy /E /I components src\components
   xcopy /E /I hooks src\hooks
   xcopy /E /I lib src\lib
   xcopy /E /I styles src\styles
   ```

2. **Migrate remaining pages** (follow the pattern from completed pages)

3. **Update package.json**
   ```bash
   npm install react-router-dom
   npm install -D vite @vitejs/plugin-react
   npm uninstall next
   ```

4. **Test the application**
   ```bash
   npm run dev
   ```

5. **Fix any import errors** in components that reference Next.js-specific features
