# Migration Completion Checklist

## Phase 1: Setup ✅ COMPLETE

- [x] Create vite.config.js
- [x] Create index.html
- [x] Create src/main.jsx
- [x] Create src/App.jsx with all routes
- [x] Create src/layouts/MainLayout.jsx
- [x] Copy src/globals.css
- [x] Copy components/ to src/components/
- [x] Copy hooks/ to src/hooks/
- [x] Copy lib/ to src/lib/
- [x] Copy styles/ to src/styles/
- [x] Create all page stub files

## Phase 2: Update Dependencies

- [ ] Run: `npm install react-router-dom`
- [ ] Run: `npm install -D vite @vitejs/plugin-react`
- [ ] Run: `npm uninstall next`
- [ ] Update package.json scripts to use Vite
- [ ] Test: `npm run dev` starts without errors

## Phase 3: Migrate Core Pages (Priority 1)

- [x] Home.jsx ✅
- [ ] Vehicles.jsx
  - [ ] Copy from app/vehicles/page.tsx
  - [ ] Remove "use client"
  - [ ] Replace next/navigation with react-router-dom
  - [ ] Replace next/link with react-router-dom
  - [ ] Replace next/image with <img />
  - [ ] Remove TypeScript types
  - [ ] Test navigation
- [ ] VehicleDetail.jsx
  - [ ] Copy from app/vehicles/[id]/page.tsx
  - [ ] Update useParams import
  - [ ] Replace router hooks
  - [ ] Test dynamic routing
- [ ] Checkout.jsx
  - [ ] Copy from app/checkout/page.tsx
  - [ ] Update navigation
  - [ ] Test checkout flow
- [ ] Dashboard.jsx
  - [ ] Copy from app/dashboard/page.tsx
  - [ ] Update navigation
  - [ ] Test user dashboard

## Phase 4: Migrate Admin Pages (Priority 2)

### Admin Core
- [x] AdminRedirect.jsx ✅
- [x] AdminLogin.jsx ✅

### Agency Admin
- [x] AgencyDashboard.jsx ✅
- [ ] AgencyAnalytics.jsx
  - [ ] Copy from app/admin/agency/analytics/page.tsx
  - [ ] Update imports
  - [ ] Test analytics display
- [ ] AgencyReservations.jsx
  - [ ] Copy from app/admin/agency/reservations/page.tsx
  - [ ] Update imports
  - [ ] Test reservation management
- [ ] AgencyVehicles.jsx
  - [ ] Copy from app/admin/agency/vehicles/page.tsx
  - [ ] Update imports
  - [ ] Test vehicle management

### Super Admin
- [x] SuperDashboard.jsx ✅
- [ ] SuperActivity.jsx
  - [ ] Copy from app/admin/super/activity/page.tsx
  - [ ] Update imports
- [ ] SuperAgencies.jsx
  - [ ] Copy from app/admin/super/agencies/page.tsx
  - [ ] Update imports
- [ ] SuperAnalytics.jsx
  - [ ] Copy from app/admin/super/analytics/page.tsx
  - [ ] Update imports
- [ ] SuperReservations.jsx
  - [ ] Copy from app/admin/super/reservations/page.tsx
  - [ ] Update imports
- [ ] SuperSettings.jsx
  - [ ] Copy from app/admin/super/settings/page.tsx
  - [ ] Update imports
- [ ] SuperUsers.jsx
  - [ ] Copy from app/admin/super/users/page.tsx
  - [ ] Update imports
- [ ] SuperVehicles.jsx
  - [ ] Copy from app/admin/super/vehicles/page.tsx
  - [ ] Update imports

## Phase 5: Update Components

- [ ] Search for Next.js imports: `grep -r "from \"next" src/components/`
- [ ] Update navbar.tsx
  - [ ] Replace next/link with react-router-dom
  - [ ] Test navigation
- [ ] Update footer.tsx
  - [ ] Replace next/link with react-router-dom
  - [ ] Test links
- [ ] Update vehicle-card.tsx
  - [ ] Replace next/link and next/image
  - [ ] Test card display and navigation
- [ ] Update admin-shell.tsx
  - [ ] Replace next/navigation hooks
  - [ ] Test admin layout
- [ ] Update admin-sidebar.tsx
  - [ ] Replace next/link
  - [ ] Test sidebar navigation
- [ ] Check landing components
  - [ ] hero-section.tsx
  - [ ] category-section.tsx
  - [ ] featured-section.tsx
  - [ ] how-it-works.tsx

## Phase 6: Testing

### Public Routes
- [ ] Test: Navigate to `/`
- [ ] Test: Navigate to `/vehicles`
- [ ] Test: Navigate to `/vehicles/123`
- [ ] Test: Navigate to `/checkout`
- [ ] Test: Navigate to `/dashboard`

### Admin Routes
- [ ] Test: Navigate to `/admin` (should redirect)
- [ ] Test: Navigate to `/admin/login`
- [ ] Test: Login as super admin (super@krigo.ma / admin123)
- [ ] Test: Redirects to `/admin/super`
- [ ] Test: Navigate all super admin pages
- [ ] Test: Logout
- [ ] Test: Login as agency admin (casa@krigo.ma / agency123)
- [ ] Test: Redirects to `/admin/agency`
- [ ] Test: Navigate all agency admin pages

### Navigation
- [ ] Test: All navbar links work
- [ ] Test: All footer links work
- [ ] Test: All sidebar links work
- [ ] Test: Browser back/forward buttons work
- [ ] Test: Direct URL navigation works

### Functionality
- [ ] Test: Vehicle search/filter
- [ ] Test: Vehicle detail view
- [ ] Test: Checkout process
- [ ] Test: Dashboard displays correctly
- [ ] Test: Admin analytics display
- [ ] Test: Admin reservation management
- [ ] Test: Admin vehicle management

## Phase 7: Cleanup

- [ ] Verify all pages work correctly
- [ ] Check browser console for errors
- [ ] Test on different screen sizes
- [ ] Verify all images load
- [ ] Verify all styles apply correctly
- [ ] Delete app/ folder (after confirming everything works)
- [ ] Delete next.config.mjs
- [ ] Delete tsconfig.json (if not needed)
- [ ] Update .gitignore for Vite

## Phase 8: Production Build

- [ ] Run: `npm run build`
- [ ] Fix any build errors
- [ ] Run: `npm run preview`
- [ ] Test production build
- [ ] Verify all routes work in production

## Final Checklist

- [ ] All 19 pages migrated
- [ ] All components updated
- [ ] All tests passing
- [ ] No console errors
- [ ] Production build successful
- [ ] Documentation updated
- [ ] README.md reflects new structure

---

## Quick Commands Reference

```bash
# Install dependencies
npm install react-router-dom
npm install -D vite @vitejs/plugin-react
npm uninstall next

# Development
npm run dev

# Build
npm run build

# Preview production
npm run preview

# Search for Next.js imports
grep -r "from \"next" src/

# Search for "use client"
grep -r "use client" src/
```

---

## Progress Tracking

**Completed:** 5/19 pages (26%)

**Last Updated:** [Current Date]

**Estimated Completion:** 2-4 hours of focused work

---

## Notes

- Keep app/ folder until all pages are tested
- Test each page immediately after migration
- Check browser console for errors
- Verify admin authentication flows work correctly
- Test on multiple browsers if possible

---

**Good luck with the migration! 🚀**
