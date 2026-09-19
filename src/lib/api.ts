import {
  AccountProduct,
  Order,
  Customer,
  Review,
  Offer,
  StoreSettings,
  ActivityLog,
  StoreNotification,
  AdminUser,
  DashboardStats,
  PaymentMethod,
} from '../types';

export const CURRENCY_RATES: Record<string, { symbol: string; rate: number; label: string }> = {
  YER: { symbol: 'ر.ي', rate: 140, label: 'ريال يمني (YER)' },
  SAR: { symbol: 'ر.س', rate: 1, label: 'ريال سعودي (SAR)' },
  USD: { symbol: '$', rate: 0.27, label: 'دولار أمريكي (USD)' },
  AED: { symbol: 'د.إ', rate: 0.98, label: 'درهم إماراتي (AED)' },
  EGP: { symbol: 'ج.م', rate: 13.2, label: 'جنيه مصري (EGP)' },
};

export function formatPrice(priceInSAR: number, currency: string = 'YER'): string {
  const curr = CURRENCY_RATES[currency] || CURRENCY_RATES.YER || CURRENCY_RATES.SAR;
  const converted = Math.round(priceInSAR * curr.rate);
  return `${converted} ${curr.symbol}`;
}

export function formatWhatsAppUrl(numberStr: string, messageText?: string): string {
  let cleaned = (numberStr || '777506778').replace(/\D/g, '');
  if (cleaned.startsWith('00')) cleaned = cleaned.slice(2);
  if (cleaned.startsWith('0')) cleaned = cleaned.slice(1);
  if (cleaned.length === 9 && cleaned.startsWith('7')) {
    cleaned = '967' + cleaned;
  }
  const query = messageText ? `?text=${encodeURIComponent(messageText)}` : '';
  return `https://wa.me/${cleaned}${query}`;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('ff_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Settings
  async getSettings(): Promise<StoreSettings> {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('فشل جلب إعدادات المتجر');
    return res.json();
  },

  async updateSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('فشل تحديث إعدادات المتجر');
    return res.json();
  },

  // Accounts
  async getAccounts(params?: {
    search?: string;
    server?: string;
    status?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minLevel?: number;
    sort?: string;
  }): Promise<AccountProduct[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.server) query.append('server', params.server);
    if (params?.status) query.append('status', params.status);
    if (params?.category) query.append('category', params.category);
    if (params?.minPrice !== undefined) query.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice !== undefined) query.append('maxPrice', params.maxPrice.toString());
    if (params?.minLevel !== undefined) query.append('minLevel', params.minLevel.toString());
    if (params?.sort) query.append('sort', params.sort);

    const res = await fetch(`/api/accounts?${query.toString()}`);
    if (!res.ok) throw new Error('فشل تحميل قائمة الحسابات');
    return res.json();
  },

  async getAccountById(id: string): Promise<AccountProduct> {
    const res = await fetch(`/api/accounts/${id}`);
    if (!res.ok) throw new Error('الحساب غير موجود');
    return res.json();
  },

  async createAccount(data: Omit<AccountProduct, 'id' | 'createdAt'>): Promise<AccountProduct> {
    const res = await fetch('/api/accounts', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('فشل إضافة الحساب');
    return res.json();
  },

  async updateAccount(id: string, data: Partial<AccountProduct>): Promise<AccountProduct> {
    const res = await fetch(`/api/accounts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('فشل تعديل الحساب');
    return res.json();
  },

  async duplicateAccount(id: string): Promise<AccountProduct> {
    const res = await fetch(`/api/accounts/${id}/duplicate`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('فشل نسخ الحساب');
    return res.json();
  },

  async deleteAccount(id: string): Promise<boolean> {
    const res = await fetch(`/api/accounts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('فشل حذف الحساب');
    return true;
  },

  // Orders
  async createOrder(data: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    accountId: string;
    paymentMethod: string;
    transferReference?: string;
    notes?: string;
  }): Promise<{ order: Order; whatsappMessage: string }> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'فشل إتمام الطلب');
    }
    return res.json();
  },

  async getOrders(status?: string): Promise<Order[]> {
    const query = status && status !== 'all' ? `?status=${status}` : '';
    const res = await fetch(`/api/orders${query}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('فشل جلب الطلبات');
    return res.json();
  },

  async updateOrderStatus(id: string, status: Order['status'], deliveryInfo?: string): Promise<Order> {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, deliveryInfo }),
    });
    if (!res.ok) throw new Error('فشل تحديث حالة الطلب');
    return res.json();
  },

  async trackOrder(orderNumber: string, phone: string): Promise<{ order: Order; account: any }> {
    const query = new URLSearchParams({ orderNumber, phone });
    const res = await fetch(`/api/orders/track?${query.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'لم يتم العثور على الطلب');
    }
    return res.json();
  },

  // Customers
  async getCustomers(): Promise<Customer[]> {
    const res = await fetch('/api/customers', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('فشل جلب العملاء');
    return res.json();
  },

  // Reviews
  async getReviews(params?: { accountId?: string; status?: string }): Promise<Review[]> {
    const query = new URLSearchParams();
    if (params?.accountId) query.append('accountId', params.accountId);
    if (params?.status) query.append('status', params.status);

    const res = await fetch(`/api/reviews?${query.toString()}`);
    if (!res.ok) throw new Error('فشل جلب التقييمات');
    return res.json();
  },

  async submitReview(data: {
    accountId: string;
    customerName: string;
    rating: number;
    comment: string;
  }): Promise<Review> {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'فشل إرسال التقييم');
    }
    return res.json();
  },

  async updateReviewStatus(id: string, status: Review['status'], isPinned?: boolean): Promise<Review> {
    const res = await fetch(`/api/reviews/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, isPinned }),
    });
    if (!res.ok) throw new Error('فشل تحديث التقييم');
    return res.json();
  },

  async deleteReview(id: string): Promise<boolean> {
    const res = await fetch(`/api/reviews/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('فشل حذف التقييم');
    return true;
  },

  // Offers
  async getOffers(): Promise<Offer[]> {
    const res = await fetch('/api/offers');
    if (!res.ok) throw new Error('فشل جلب العروض');
    return res.json();
  },

  async createOffer(data: Omit<Offer, 'id'>): Promise<Offer> {
    const res = await fetch('/api/offers', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('فشل إضافة العرض');
    return res.json();
  },

  async updateOffer(id: string, data: Partial<Offer>): Promise<Offer> {
    const res = await fetch(`/api/offers/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('فشل تعديل العرض');
    return res.json();
  },

  async deleteOffer(id: string): Promise<boolean> {
    const res = await fetch(`/api/offers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('فشل حذف العرض');
    return true;
  },

  // Stats & Logs
  async getStats(): Promise<DashboardStats> {
    const res = await fetch('/api/dashboard/stats', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('فشل تحميل الإحصائيات');
    return res.json();
  },

  async getActivityLogs(): Promise<ActivityLog[]> {
    const res = await fetch('/api/activity-logs', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('فشل تحميل سجل النشاط');
    return res.json();
  },

  async getNotifications(): Promise<StoreNotification[]> {
    const res = await fetch('/api/notifications', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('فشل تحميل الإشعارات');
    return res.json();
  },

  async markNotificationRead(id: string): Promise<void> {
    await fetch(`/api/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
  },

  // Admin Auth
  async adminLogin(username: string, password: string): Promise<{ token: string; admin: AdminUser }> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'بيانات تسجيل الدخول غير صحيحة');
    }
    const data = await res.json();
    localStorage.setItem('ff_admin_token', data.token);
    localStorage.setItem('ff_admin_user', JSON.stringify(data.admin));
    return data;
  },

  async changeAdminPassword(username: string, oldPassword: string, newPassword: string): Promise<boolean> {
    const res = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ username, oldPassword, newPassword }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'فشل تغيير كلمة المرور');
    }
    return true;
  },

  // Payment Methods
  async getPaymentMethods(all = false): Promise<PaymentMethod[]> {
    const url = all ? '/api/payment-methods?all=true' : '/api/payment-methods';
    const res = await fetch(url);
    if (!res.ok) throw new Error('فشل جلب طرق الدفع');
    return res.json();
  },

  async createPaymentMethod(data: Partial<PaymentMethod>): Promise<PaymentMethod> {
    const res = await fetch('/api/payment-methods', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'فشل إضافة طريقة الدفع');
    }
    return res.json();
  },

  async updatePaymentMethod(id: string, data: Partial<PaymentMethod>): Promise<PaymentMethod> {
    const res = await fetch(`/api/payment-methods/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'فشل تعديل طريقة الدفع');
    }
    return res.json();
  },

  async deletePaymentMethod(id: string): Promise<boolean> {
    const res = await fetch(`/api/payment-methods/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'فشل حذف طريقة الدفع');
    }
    return true;
  },

  async togglePaymentMethod(id: string): Promise<PaymentMethod> {
    const res = await fetch(`/api/payment-methods/${id}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'فشل تغيير حالة طريقة الدفع');
    }
    return res.json();
  },
};
