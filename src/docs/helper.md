# Helper Functions Documentation

## 🔐 Authentication Helpers

```typescript
// Email/Password Authentication Helpers
const loginWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential>

// Check if user is authenticated
const isAuthenticated = (): boolean

// Get current user data with full profile
const getCurrentUser = async (): Promise<{
  userId: string;
  phone: string;
  email: string;
  name: string;
  role: "marketer" | "distributor" | "admin";
  stock: Record<string, number>;
  commission: number;
  referrerId: string;
  ancestors: string[];
  directDescendants: string[];
  lastPurchaseDate: FirebaseFirestore.Timestamp;
}>

// Email validation
const isValidEmail = (email: string): boolean

// Role verification helpers
const isAdmin = (): boolean
const isMarketer = (): boolean
const isDistributor = (): boolean

// Check specific role permission
const hasRole = (role: "marketer" | "distributor" | "admin"): boolean

// Check if user can perform specific actions
const canTransferStock = (userId: string): boolean
const canMakeSale = (userId: string): boolean
const canManageProducts = (userId: string): boolean
```

## 📞 Phone Number Helpers

```typescript
// Format phone to E.164 for Ghana numbers
const formatPhoneNumber = (
  phone: string,
  countryCode: string = '+233'  // Ghana country code
): string

// Validate Ghana phone number format
const isValidPhone = (
  phone: string,
  countryCode: string = '+233'
): boolean

// Format display phone number for Ghana
const formatDisplayPhone = (
  phone: string,
  format: 'national' | 'international' = 'national'
): string  // e.g., "024 123 4567" or "+233 24 123 4567"
```

## 💰 Financial Helpers

```typescript
// Calculate multi-level commission for a sale
const calculateMLMCommission = (
  saleAmount: number,
  commissionRate: number,
  level: number,
  maxLevels: number = 5
): number

// Calculate total commission for upline
const calculateUplineCommissions = (
  sale: Sale,
  uplineChain: User[],
  product: Product
): CommissionDistribution[]

// Format currency for Ghana Cedis
const formatCurrency = (
  amount: number,
  currency: string = 'GHS',
  locale: string = 'en-GH'
): string  // e.g., "GH₵ 100.00"

// Calculate total earnings for period
const calculateEarnings = (
  commissions: Commission[],
  startDate: Date,
  endDate: Date
): number
```

## 📦 Stock Management Helpers

```typescript
// Check if user has sufficient stock
const hasEnoughStock = (
  userStock: Record<string, number>,
  productId: string,
  quantity: number
): boolean

// Calculate total stock value
const calculateStockValue = (
  stock: Record<string, number>,
  products: Product[]
): number

// Get low stock alerts
const getLowStockAlerts = (
  stock: Record<string, number>,
  products: Product[]
): LowStockAlert[]

// Validate stock transfer
const validateStockTransfer = (
  fromUser: User,
  toUser: User,
  productId: string,
  quantity: number
): { valid: boolean; error?: string }

// Update stock levels
const updateUserStock = async (
  userId: string,
  productId: string,
  quantity: number,
  operation: 'add' | 'subtract'
): Promise<void>
```

## 🌳 MLM Tree Helpers

```typescript
// Get complete upline chain with commission calculation
const getAncestorChain = async (
  userId: string,
  maxLevels: number = 5
): Promise<{
  user: User;
  level: number;
  commissionRate: number;
}[]>

// Get complete downline structure
const getDownlineStructure = async (
  userId: string,
  maxDepth?: number
): Promise<TreeNode>

// Calculate network statistics
const getNetworkStats = async (
  userId: string
): Promise<{
  totalDownline: number;
  activeMarketers: number;
  totalSales: number;
  networkVolume: number;
}>

// Find common ancestor
const findCommonAncestor = async (
  user1Id: string,
  user2Id: string
): Promise<User | null>
```

## 📊 Data Validation Helpers

```typescript
// Comprehensive sale validation
const validateSale = (
  sale: Sale,
  marketer: User,
  buyer: User | null,
  product: Product
): ValidationResult

// Validate stock transfer between users
const validateStockTransfer = (
  transfer: StockTransfer,
  fromUser: User,
  toUser: User,
  product: Product
): ValidationResult

// Validate Ghana-specific user registration data
const validateUserRegistration = (
  userData: UserRegistration,
  referrer?: User
): ValidationResult & {
  validGhanaPhone: boolean;
  validGhanaRegion: boolean;
}

// Validate Ghana business registration
const validateBusinessRegistration = (
  tinNumber: string,  // Ghana Tax Identification Number
  registrationNumber: string  // Business registration
): ValidationResult

// Validate product data
const validateProduct = (
  product: Product
): ValidationResult
```

## ⏰ Date Helpers

```typescript
// Format timestamp with Ghana timezone
const formatDate = (
  timestamp: FirebaseFirestore.Timestamp,
  format: string = 'DD/MM/YYYY HH:mm:ss',
  timezone: string = 'Africa/Accra'
): string

// Get date range for reports
const getDateRange = (
  range: 'today' | 'week' | 'month' | 'year'
): { start: Date; end: Date }

// Check if date is within Ghana business hours
const isBusinessHours = (
  date: Date,
  businessHours: BusinessHours = {
    start: '08:00',
    end: '17:00',
    timezone: 'Africa/Accra',
    workDays: [1, 2, 3, 4, 5, 6]  // Monday to Saturday
  }
): boolean

// Get relative time
const getRelativeTime = (
  timestamp: FirebaseFirestore.Timestamp
): string
```

## 🔄 Firebase Data Converters

```typescript
// Complete type-safe converters for all collections
const userConverter: FirestoreDataConverter<User>
const productConverter: FirestoreDataConverter<Product>
const saleConverter: FirestoreDataConverter<Sale>
const commissionConverter: FirestoreDataConverter<Commission>
const stockTransferConverter: FirestoreDataConverter<StockTransfer>

// Batch update helpers
const batchUpdateStock = async (
  batch: WriteBatch,
  updates: StockUpdate[]
): Promise<void>

// Transaction helpers
const transferStockWithTransaction = async (
  transfer: StockTransfer
): Promise<void>
```

## 📊 Analytics Helpers

```typescript
// Calculate sales analytics
const calculateSalesMetrics = (
  sales: Sale[],
  period: 'day' | 'week' | 'month'
): SalesMetrics

// Generate commission reports
const generateCommissionReport = async (
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<CommissionReport>

// Calculate network growth
const calculateNetworkGrowth = async (
  userId: string,
  period: 'month' | 'quarter' | 'year'
): Promise<NetworkGrowth>
```

## 🎯 Common Utility Functions

```typescript
// Deep clone with type safety
const deepClone = <T>(obj: T): T

// Debounce function with cancellation
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): DebouncedFunction<T>

// Generate unique business ID
const generateBusinessId = (
  type: 'user' | 'product' | 'sale' | 'transfer',
  prefix?: string
): string

// Error handler with logging
const handleError = (
  error: Error,
  context: string,
  userId?: string
): void
```

Each helper function includes comprehensive error handling, logging, and type safety. Implementation details should follow best practices and include proper documentation.
