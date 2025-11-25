# Merchant Operations Dashboard

A comprehensive React-based dashboard for managing merchant operations, built with Vite and Tailwind CSS.

## Features Implemented

### 1. Layout ✅
- **Top Navigation**: Displays "Merchant Ops Dashboard" with logout functionality
- **Sidebar**: Navigation between Dashboard and Merchants pages
- **Responsive Design**: Fully responsive for desktop and mobile devices
- **Collapsible Sidebar**: Can be toggled on/off

### 2. Dashboard Page ✅
- **Summary Statistics**:
  - Total Volume across all merchants
  - Active Merchants count
  - Average Success Rate (100% - avg chargeback ratio)
  - High Risk Count
- **Visualizations**:
  - Risk Level Distribution (bar chart)
  - Merchant Status Distribution (bar chart)
  - Top Merchants by Volume (table)
- **Dynamic Calculations**: All stats calculated from merchant data
- **Loading States**: Skeleton screens while data loads

### 3. Merchants Page ✅
- **Merchant Table** with columns:
  - Name & Description
  - Country
  - Status (active, paused, blocked)
  - Monthly Volume
  - Chargeback Ratio (%)
  - Risk Level (low, medium, high)
  - Actions

- **Interactive Features**:
  - Search by merchant name (real-time)
  - Filter by status (all, active, paused, blocked)
  - Filter by risk level (all, low, medium, high)
  - Sort by name, volume, or chargeback ratio (ascending/descending)
  - Active filter display with quick remove
  - Results count display

- **Empty States**: Shows helpful message when no results found

### 4. Merchant Detail View ✅
- **Modal** that displays:
  - All merchant details (ID, country, volume, chargeback ratio, description)
  - Editable status and risk level
  
- **Business Logic**:
  - ⚠️ Warning when chargebackRatio > 2% AND status is active
  - 🔒 Confirmation required when setting status to active while risk is high
  
### 5. Add/Edit Merchant Form ✅
- **Form Fields**:
  - Name (required, min 3 characters)
  - Country (required)
  - Monthly Volume (required, number > 0)
  - Chargeback Ratio (required, 0-100%)
  - Status (required dropdown)
  - Risk Level (required dropdown)
  - Description (optional)

- **Validation**:
  - Real-time validation on field blur
  - Error messages displayed for invalid fields
  - Submit button disabled when form is invalid
  - Clear visual indicators for required fields

### UX Features ✅
- ✨ Clean, modern layout with consistent spacing
- 🎨 Consistent typography and component styles
- 🖱️ Hover states on all interactive elements
- 💀 Loading skeletons for async operations
- 📭 Empty states with helpful messages
- ✅ Clear validation & error feedback
- 🎯 Color-coded status and risk badges
- 🔍 Real-time search with highlighting
- 📱 Mobile-responsive design
- ⚡ Smooth transitions and animations

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Tailwind CSS 4** - Styling
- **Heroicons** - Icon library

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── Components/
│   ├── ProtectedRoute.jsx
│   ├── Sidebar/
│   │   ├── Sidebar.jsx
│   │   └── SidebarMenus.jsx
│   ├── TopNav/
│   │   └── TopNav.jsx
│   └── UI/
│       ├── Button.jsx
│       └── Input.jsx
├── Pages/
│   ├── Dashboard/
│   │   └── Dashboard.jsx
│   ├── Login/
│   │   └── Login.jsx
│   └── Merchants/
│       ├── MerchantDetailPage.jsx
│       ├── MerchantForm.jsx
│       ├── Merchants.jsx
│       └── MerchantTable.jsx
├── data/
│   └── merchants.json
├── App.jsx
└── main.jsx
```

## Key Functionality

### Dashboard Analytics
- Aggregates data from all merchants
- Calculates key metrics dynamically
- Visualizes risk and status distributions
- Displays top performers

### Merchant Management
- Full CRUD operations (Create, Read, Update)
- Advanced filtering and search
- Business rule enforcement
- Validation and error handling

### Business Rules
1. **High Chargeback Warning**: Shows warning when active merchant has >2% chargeback
2. **High Risk Activation**: Requires confirmation to activate high-risk merchants
3. **Form Validation**: Enforces data quality with comprehensive validation

## Demo Login
- Any credentials will work for demo purposes
- Login state persists in localStorage

## Assignment Completion

All requirements from the Frontend React Assignment have been fully implemented:
- ✅ Layout with top nav and sidebar
- ✅ Dashboard with 3+ stats and visualization
- ✅ Merchants page with table/list
- ✅ Search, filter, and sort functionality
- ✅ Merchant detail view with update capability
- ✅ Business logic rules with warnings
- ✅ Add/Edit form with validation
- ✅ Clean UX with proper spacing, typography, and feedback
- ✅ Responsive design
- ✅ Loading states and empty states

## Notes

This is a frontend-only application using static JSON data. All state management is handled in-memory and resets on page reload.
