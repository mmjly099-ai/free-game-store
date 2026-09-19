export type AccountStatus = 'available' | 'reserved' | 'sold';
export type OrderStatus = 'new' | 'reviewing' | 'paid' | 'delivered' | 'completed' | 'cancelled';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface AccountProduct {
  id: string;
  uid: string;
  title: string;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  level: number;
  charactersCount?: number;
  server: string;
  region: string;
  description: string;
  images: string[];
  videoUrl?: string;
  features: string[];
  rating: number;
  reviewsCount: number;
  status: AccountStatus;
  isFeatured: boolean;
  isOffer: boolean;
  offerEndTime?: string;
  createdAt: string;
  category: string;
  rank?: string;
  rareItems?: string[];
  loginMethod?: string;
}

export interface OrderItem {
  accountId: string;
  accountTitle: string;
  accountUid: string;
  price: number;
  image?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  provider: string;
  accountNumber: string;
  accountName: string;
  instructions: string;
  note?: string;
  icon?: string;
  active: boolean;
  currency?: string;
  createdAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  accountId: string;
  accountTitle: string;
  accountUid: string;
  price: number;
  currency: string;
  paymentMethod: string;
  transferReference?: string;
  status: OrderStatus;
  createdAt: string;
  notes?: string;
  deliveryInfo?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  lastOrderAt: string;
}

export interface Review {
  id: string;
  accountId: string;
  accountTitle: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: ReviewStatus;
  isPinned?: boolean;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  accountIds: string[];
  bannerUrl: string;
  active: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface StoreSettings {
  storeName: string;
  storeSubtitle: string;
  logoUrl: string;
  heroBannerUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  whatsappNumber: string;
  telegramUrl: string;
  instagramUrl: string;
  discordUrl?: string;
  themePrimaryColor: string;
  announcementText: string;
  announcementEnabled: boolean;
  faqs: FAQItem[];
  termsOfSale: string;
  refundPolicy: string;
  privacyPolicy: string;
  currency: string;
  supportEmail: string;
}

export interface ActivityLog {
  id: string;
  adminName: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'account' | 'order' | 'review' | 'setting' | 'auth' | 'media';
}

export interface StoreNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'review' | 'system';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: 'superadmin' | 'admin' | 'moderator';
  lastLogin?: string;
}

export interface DashboardStats {
  totalAccounts: number;
  availableAccounts: number;
  soldAccounts: number;
  reservedAccounts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  averageRating: number;
  pendingReviewsCount: number;
  newOrdersCount: number;
}
