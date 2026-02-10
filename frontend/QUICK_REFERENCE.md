# Next.js to React (Vite) Migration - Quick Reference

## 📊 Project Status

### ✅ Structure Complete
All 19 pages have placeholder files created in the correct React structure.

### ✅ Fully Migrated Pages (5/19)
1. ✅ `src/pages/Home.jsx`
2. ✅ `src/pages/admin/AdminRedirect.jsx`
3. ✅ `src/pages/admin/login/AdminLogin.jsx`
4. ✅ `src/pages/admin/agency/AgencyDashboard.jsx`
5. ✅ `src/pages/admin/super/SuperDashboard.jsx`

### 🔄 Placeholder Pages (14/19)
These have stub files - need content migration:
- Vehicles.jsx, VehicleDetail.jsx, Checkout.jsx, Dashboard.jsx
- AgencyAnalytics.jsx, AgencyReservations.jsx, AgencyVehicles.jsx
- SuperActivity.jsx, SuperAgencies.jsx, SuperAnalytics.jsx
- SuperReservations.jsx, SuperSettings.jsx, SuperUsers.jsx, SuperVehicles.jsx

---

## 🗺️ Complete File Mapping

| Next.js (app/) | React (src/pages/) | Status |
|----------------|-------------------|--------|
| `app/page.tsx` | `src/pages/Home.jsx` | ✅ Done |
| `app/vehicles/page.tsx` | `src/pages/vehicles/Vehicles.jsx` | 🔄 Stub |
| `app/vehicles/[id]/page.tsx` | `src/pages/vehicles/VehicleDetail.jsx` | 🔄 Stub |
| `app/checkout/page.tsx` | `src/pages/checkout/Checkout.jsx` | 🔄 Stub |
| `app/dashboard/page.tsx` | `src/pages/dashboard/Dashboard.jsx` | 🔄 Stub |
| `app/admin/page.tsx` | `src/pages/admin/AdminRedirect.jsx` | ✅ Done |
| `app/admin/login/page.tsx` | `src/pages/admin/login/AdminLogin.jsx` | ✅ Done |
| `app/admin/agency/page.tsx` | `src/pages/admin/agency/AgencyDashboard.jsx` | ✅ Done |
| `app/admin/agency/analytics/page.tsx` | `src/pages/admin/agency/analytics/AgencyAnalytics.jsx` | 🔄 Stub |
| `app/admin/agency/reservations/page.tsx` | `src/pages/admin/agency/reservations/AgencyReservations.jsx` | 🔄 Stub |
| `app/admin/agency/vehicles/page.tsx` | `src/pages/admin/agency/vehicles/AgencyVehicles.jsx` | 🔄 Stub |
| `app/admin/super/page.tsx` | `src/pages/admin/super/SuperDashboard.jsx` | ✅ Done |
| `app/admin/super/activity/page.tsx` | `src/pages/admin/super/activity/SuperActivity.jsx` | 🔄 Stub |
| `app/admin/super/agencies/page.tsx` | `src/pages/admin/super/agencies/SuperAgencies.jsx` | 🔄 Stub |
| `app/admin/super/analytics/page.tsx` | `src/pages/admin/super/analytics/SuperAnalytics.jsx` | 🔄 Stub |
| `app/admin/super/reservations/page.tsx` | `src/pages/admin/super/reservations/SuperReservations.jsx` | 🔄 Stub |
| `app/admin/super/settings/page.tsx` | `src/pages/admin/super/settings/SuperSettings.jsx` | 🔄 Stub |
| `app/admin/super/users/page.tsx` | `src/pages/admin/super/users/SuperUsers.jsx` | 🔄 Stub |
| `app/admin/super/vehicles/page.tsx` | `src/pages/admin/super/vehicles/SuperVehicles.jsx` | 🔄 Stub |

---

## 🔄 Quick Migration Checklist

For each stub page, follow these steps:

### 1. Open both files side-by-side
```
Source: app/[path]/page.tsx
Target: src/pages/[path]/[Name].jsx
```

### 2. Copy & Transform (5 steps)

#### ❌ Remove:
```javascript
"use client";  // Delete this line
```

#### 🔄 Replace Imports:
```javascript
// BEFORE
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// AFTER
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
// Use <img /> instead of Image
```

#### 🔄 Replace Router:
```javascript
// BEFORE
const router = useRouter();
router.push("/path");

// AFTER
const navigate = useNavigate();
navigate("/path");
```

#### 🔄 Replace Links:
```javascript
// BEFORE
<Link href="/vehicles">

// AFTER
<Link to="/vehicles">
```

#### 🔄 Remove Types:
```javascript
// BEFORE
function Component(): JSX.Element {
  const [data, setData] = useState<DataType>([]);
}

// AFTER
function Component() {
  const [data, setData] = useState([]);
}
```

### 3. Save & Test
```bash
npm run dev
```

---

## 📦 Package.json Commands

### Before Migration (Next.js)
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

### After Migration (Vite)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Install Dependencies
```bash
npm install react-router-dom
npm install -D vite @vitejs/plugin-react
npm uninstall next
```

---

## 🎯 Routes Configuration

All routes are already configured in `src/App.jsx`:

```javascript
<Routes>
  {/* Public */}
  <Route path="/" element={<Home />} />
  <Route path="/vehicles" element={<Vehicles />} />
  <Route path="/vehicles/:id" element={<VehicleDetail />} />
  <Route path="/checkout" element={<Checkout />} />
  <Route path="/dashboard" element={<Dashboard />} />
  
  {/* Admin */}
  <Route path="/admin" element={<AdminRedirect />} />
  <Route path="/admin/login" element={<AdminLogin />} />
  <Route path="/admin/agency" element={<AgencyDashboard />} />
  <Route path="/admin/agency/analytics" element={<AgencyAnalytics />} />
  <Route path="/admin/agency/reservations" element={<AgencyReservations />} />
  <Route path="/admin/agency/vehicles" element={<AgencyVehicles />} />
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

---

## 🚀 Next Steps

### Priority 1: Core Pages (User-facing)
1. Migrate `Vehicles.jsx` - Main product listing
2. Migrate `VehicleDetail.jsx` - Product details
3. Migrate `Checkout.jsx` - Booking flow
4. Migrate `Dashboard.jsx` - User dashboard

### Priority 2: Admin Agency Pages
5. Migrate `AgencyAnalytics.jsx`
6. Migrate `AgencyReservations.jsx`
7. Migrate `AgencyVehicles.jsx`

### Priority 3: Admin Super Pages
8. Migrate remaining 7 super admin pages

### Priority 4: Component Updates
After all pages are migrated, update components that use Next.js features:
- `navbar.tsx` - likely uses next/link
- `footer.tsx` - likely uses next/link
- `vehicle-card.tsx` - likely uses next/link or next/image
- `admin-sidebar.tsx` - likely uses next/link

---

## 📝 Example Migration

### Before (Next.js)
```typescript
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function VehiclesPage(): JSX.Element {
  const router = useRouter();
  
  const handleClick = () => {
    router.push("/checkout");
  };
  
  return (
    <div>
      <Link href="/vehicles/123">
        <Image src="/car.jpg" alt="Car" width={300} height={200} />
      </Link>
    </div>
  );
}
```

### After (React)
```javascript
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Vehicles() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate("/checkout");
  };
  
  return (
    <div>
      <Link to="/vehicles/123">
        <img src="/car.jpg" alt="Car" width="300" height="200" />
      </Link>
    </div>
  );
}
```

---

## ✅ What's Already Done

1. ✅ Vite configuration with @ alias
2. ✅ index.html with metadata
3. ✅ src/main.jsx entry point
4. ✅ src/App.jsx with all routes
5. ✅ src/layouts/MainLayout.jsx
6. ✅ src/globals.css
7. ✅ All folders copied (components, hooks, lib, styles)
8. ✅ All 19 page files created (5 complete, 14 stubs)
9. ✅ Complete routing setup

---

## 🎉 Ready to Run

Once you migrate the remaining pages and update package.json:

```bash
npm install
npm run dev
```

The app will start on `http://localhost:3000`

---

## 📚 Documentation Files

- `MIGRATION_GUIDE.md` - Detailed transformation guide
- `IMPLEMENTATION_STATUS.md` - Complete status and next steps
- `QUICK_REFERENCE.md` - This file

---

## ⚠️ Important Notes

1. **DO NOT delete `app/` folder** until all pages are migrated and tested
2. **Test each page** after migration
3. **Keep all business logic identical** - only change routing code
4. **Preserve all styling** - Tailwind classes work as-is
5. **Admin authentication is critical** - test login flows thoroughly

---

## 🆘 Common Issues & Solutions

### Issue: Import errors for @/components
**Solution:** Check that vite.config.js has the @ alias configured

### Issue: useNavigate not working
**Solution:** Ensure component is inside <BrowserRouter> in main.jsx

### Issue: Dynamic routes not working
**Solution:** Use useParams() from react-router-dom, route defined with :id

### Issue: Images not loading
**Solution:** Place images in /public folder, reference as /image.jpg

---

**Migration Progress: 26% Complete (5/19 pages)**
**Estimated Time to Complete: 2-4 hours for remaining pages**
