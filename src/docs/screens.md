# Screen Documentation

## 🔓 Authentication Screens (All Users)

### 1. Login Screen `/auth/login`

- Email input
- Password input
- Remember me checkbox
- Forgot password link
- Login button

**Helper Functions:**

- `isAuthenticated()`
- `isValidEmail()`
- `handleError()`

### 2. Registration Screen `/auth/register`

- Name input
- Phone number input (Ghana format)
- Email input
- Password/Confirm Password
- Submit button

**Helper Functions:**

- `validateUserRegistration()`
- `formatPhoneNumber()`
- `isValidPhone()`
- `generateBusinessId()`

### 3. Forgot Password Screen `/auth/forgot-password`

- Phone number input
- Email input
- Reset instructions

**Helper Functions:**

- `formatPhoneNumber()`
- `isValidPhone()`
- `handleError()`

## 👑 Admin Screens `/admin/*`

### 1. Admin Dashboard `/admin/dashboard`

**Key Metrics Display:**

- Total active marketers/distributors
- Total sales volume (GH₵)
- Total commissions paid
- Stock movement summary
- Recent registrations

**Helper Functions:**

- `isAdmin()`
- `calculateNetworkGrowth()`
- `formatCurrency()`
- `calculateSalesMetrics()`

### 2. User Management `/admin/users`

**Features:**

- User list with filters
- Role assignment (Marketer/Distributor)
- User details view
- Network structure visualization
- Account status management

**Helper Functions:**

- `getDownlineStructure()`
- `getNetworkStats()`
- `hasRole()`
- `validateUserRegistration()`

### 3. Product Management `/admin/products`

**Features:**

- Product list
- Add/Edit product form
- Commission rate settings
- Stock level monitoring
- Price management (GH₵)

**Helper Functions:**

- `validateProduct()`
- `formatCurrency()`
- `generateBusinessId()`
- `handleError()`

### 4. Commission Management `/admin/commissions`

**Features:**

- Commission overview
- Payment status tracking
- Commission rate adjustments
- Payment processing interface

**Helper Functions:**

- `calculateMLMCommission()`
- `calculateUplineCommissions()`
- `formatCurrency()`
- `generateCommissionReport()`

### 5. Reports `/admin/reports`

**Features:**

- Sales reports
- Commission reports
- Stock movement reports
- Network growth reports
- Export functionality (PDF/Excel)

**Helper Functions:**

- `getDateRange()`
- `formatCurrency()`
- `calculateSalesMetrics()`
- `generateCommissionReport()`

## 📦 Distributor Screens `/distributor/*`

### 1. Distributor Dashboard `/distributor/dashboard`

**Key Metrics:**

- Current stock levels
- Recent transfers
- Stock requests
- Low stock alerts

**Helper Functions:**

- `isDistributor()`
- `calculateStockValue()`
- `getLowStockAlerts()`
- `formatCurrency()`

### 2. Stock Management `/distributor/stock`

**Features:**

- Current inventory view
- Stock transfer interface
- Transfer history
- Stock alerts configuration

**Helper Functions:**

- `hasEnoughStock()`
- `validateStockTransfer()`
- `updateUserStock()`
- `batchUpdateStock()`

### 3. Transfer History `/distributor/transfers`

**Features:**

- Transfer records
- Filter by date/product
- Transfer status tracking
- Receipt generation

**Helper Functions:**

- `formatDate()`
- `getDateRange()`
- `transferStockWithTransaction()`
- `formatCurrency()`

### 4. Marketer Management `/distributor/marketers`

**Features:**

- Assigned marketers list
- Stock allocation view
- Marketer performance metrics
- Stock request management

**Helper Functions:**

- `getDownlineStructure()`
- `calculateNetworkGrowth()`
- `getNetworkStats()`
- `hasEnoughStock()`

## 💼 Marketer Screens `/marketer/*`

### 1. Marketer Dashboard `/marketer/dashboard`

**Key Metrics:**

- Daily/Monthly sales
- Commission earnings
- Current stock levels
- Recent sales
- Network statistics

**Helper Functions:**

- `isMarketer()`
- `calculateEarnings()`
- `getNetworkStats()`
- `formatCurrency()`

### 2. Sales Interface `/marketer/sales`

**Features:**

- Product selection
- Quantity input
- Buyer information
- Payment processing
- Receipt generation

**Helper Functions:**

- `validateSale()`
- `hasEnoughStock()`
- `calculateMLMCommission()`
- `updateUserStock()`

### 3. Stock Management `/marketer/stock`

**Features:**

- Current inventory
- Stock request form
- Stock history
- Low stock alerts

**Helper Functions:**

- `hasEnoughStock()`
- `getLowStockAlerts()`
- `validateStockTransfer()`
- `formatCurrency()`

### 4. Network View `/marketer/network`

**Features:**

- Downline visualization
- Team performance metrics
- Commission breakdown
- Recruitment stats

**Helper Functions:**

- `getDownlineStructure()`
- `getAncestorChain()`
- `getNetworkStats()`
- `calculateNetworkGrowth()`

### 5. Commission History `/marketer/commissions`

**Features:**

- Commission breakdown
- Payment status
- Historical earnings
- Commission calculations

**Helper Functions:**

- `calculateEarnings()`
- `formatCurrency()`
- `getDateRange()`
- `generateCommissionReport()`

## 🎨 Common Components

### 1. Header Component

- Logo
- User profile menu
- Notifications
- Quick actions

### 2. Navigation Component

- Role-based menu items
- Quick links
- Collapse/Expand

### 3. Profile Settings `/settings`

- Personal information

### 4. Notification Center `/notifications`

- System notifications
- Stock alerts
- Commission notifications
- Transfer updates

## 📱 Mobile Responsiveness

All screens should be Mobile First Designed:

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

Key mobile considerations:

- Collapsible menus
- Touch-friendly inputs
- Simplified tables
- Mobile-first actions

## 🎯 Screen Requirements

### Authentication

- Firebase AUth

### Data Display

- Loading states
- Error handling
- Empty states
- Pagination
- Search/Filter capabilities

### Forms

- Input validation
- Ghana-specific formatting
- Error messages
- Success feedback
- Auto-save where appropriate

### Interactions

- Confirmation dialogs
- Toast notifications
- Progress indicators
- Hover states
