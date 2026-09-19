import React, { useState, useEffect } from 'react';
import {
  Shield,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Star,
  Settings,
  Tag,
  Activity,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Check,
  X,
  Eye,
  MessageCircle,
  Clock,
  ArrowUpRight,
  Upload,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight,
  Menu,
  KeyRound,
  AlertCircle,
  CreditCard
} from 'lucide-react';
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
  AccountStatus,
  OrderStatus,
  ReviewStatus,
  PaymentMethod,
} from '../../types';
import { api, formatPrice } from '../../lib/api';
import { PaymentsManager } from './PaymentsManager';

interface AdminDashboardProps {
  adminUser: AdminUser;
  settings: StoreSettings;
  onUpdateSettings: (newSettings: StoreSettings) => void;
  onClose: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminUser,
  settings: initialSettings,
  onUpdateSettings,
  onClose,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'accounts' | 'orders' | 'customers' | 'reviews' | 'offers' | 'payments' | 'settings' | 'logs'
  >('overview');

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [accounts, setAccounts] = useState<AccountProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);

  // Filters & Search in admin
  const [accountsSearch, setAccountsSearch] = useState('');
  const [ordersFilterStatus, setOrdersFilterStatus] = useState('all');

  // Account Modal State (Create / Edit)
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountProduct | null>(null);
  const [accountFormData, setAccountFormData] = useState({
    title: '',
    uid: '',
    price: 350,
    oldPrice: 450,
    discountPercent: 22,
    level: 70,
    charactersCount: 40,
    server: 'الشرق الأوسط (MEA)',
    region: 'الشرق الأوسط',
    description: '',
    images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80'],
    videoUrl: '',
    featuresStr: 'سكن الساكورا الكامل\nسلاح MP40 ماكس\nرقصة العرش الحصرية\nرانك هيروئيك',
    status: 'available' as AccountStatus,
    isFeatured: true,
    isOffer: false,
    category: 'حسابات فاخرة VIP',
    rank: 'هيروئيك 5 نجوم',
    rareItemsStr: 'ساكورا S1, هيب هوب S2, MP40 كوبرا',
    loginMethod: 'Google Play / رسمي'
  });

  // Image upload helper
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Order Delivery Modal State
  const [selectedOrderForDelivery, setSelectedOrderForDelivery] = useState<Order | null>(null);
  const [deliveryInfoText, setDeliveryInfoText] = useState('');

  // Change Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');

  // Load all data on mount
  useEffect(() => {
    loadAllAdminData();
  }, []);

  const showNotification = (msg: string, isErr = false) => {
    if (isErr) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(null), 4000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  const loadAllAdminData = async () => {
    try {
      setLoading(true);
      const [s, a, o, c, r, off, logs, sett, pm] = await Promise.all([
        api.getStats().catch(() => null),
        api.getAccounts().catch(() => []),
        api.getOrders().catch(() => []),
        api.getCustomers().catch(() => []),
        api.getReviews().catch(() => []),
        api.getOffers().catch(() => []),
        api.getActivityLogs().catch(() => []),
        api.getSettings().catch(() => initialSettings),
        api.getPaymentMethods(true).catch(() => [])
      ]);

      if (s) setStats(s);
      setAccounts(a);
      setOrders(o);
      setCustomers(c);
      setReviews(r);
      setOffers(off);
      setActivityLogs(logs);
      setSettings(sett);
      setPaymentMethods(pm);
    } catch (err: any) {
      showNotification(err.message || 'فشل تحميل بعض بيانات لوحة التحكم', true);
    } finally {
      setLoading(false);
    }
  };

  // --- ACCOUNT HANDLERS ---
  const handleOpenCreateAccount = () => {
    setEditingAccount(null);
    setAccountFormData({
      title: '',
      uid: '10' + Math.floor(10000000 + Math.random() * 90000000),
      price: 350,
      oldPrice: 450,
      discountPercent: 22,
      level: 70,
      charactersCount: 40,
      server: 'الشرق الأوسط (MEA)',
      region: 'الشرق الأوسط',
      description: 'حساب مميز ونادر جداً بكامل سكناته، جاهز للتسليم الفوري.',
      images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80'],
      videoUrl: '',
      featuresStr: 'سكن الساكورا الكامل\nسلاح MP40 ماكس\nرقصة العرش الحصرية\nرانك هيروئيك',
      status: 'available',
      isFeatured: true,
      isOffer: false,
      category: 'حسابات فاخرة VIP',
      rank: 'هيروئيك 5 نجوم',
      rareItemsStr: 'ساكورا S1, هيب هوب S2, MP40 كوبرا',
      loginMethod: 'Google Play / رسمي'
    });
    setAccountModalOpen(true);
  };

  const handleOpenEditAccount = (acc: AccountProduct) => {
    setEditingAccount(acc);
    setAccountFormData({
      title: acc.title,
      uid: acc.uid,
      price: acc.price,
      oldPrice: acc.oldPrice || 0,
      discountPercent: acc.discountPercent || 0,
      level: acc.level,
      charactersCount: acc.charactersCount || 40,
      server: acc.server,
      region: acc.region || 'الشرق الأوسط',
      description: acc.description,
      images: acc.images && acc.images.length > 0 ? acc.images : [settings.heroBannerUrl],
      videoUrl: acc.videoUrl || '',
      featuresStr: acc.features.join('\n'),
      status: acc.status,
      isFeatured: acc.isFeatured,
      isOffer: acc.isOffer,
      category: acc.category || 'حسابات فاخرة VIP',
      rank: acc.rank || 'هيروئيك',
      rareItemsStr: (acc.rareItems || []).join(', '),
      loginMethod: acc.loginMethod || 'Google Play'
    });
    setAccountModalOpen(true);
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountFormData.title.trim() || !accountFormData.uid.trim()) {
      showNotification('يرجى ملء اسم الحساب والمعرف UID', true);
      return;
    }

    const features = accountFormData.featuresStr
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const rareItems = accountFormData.rareItemsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: accountFormData.title.trim(),
      uid: accountFormData.uid.trim(),
      price: Number(accountFormData.price),
      oldPrice: Number(accountFormData.oldPrice) || undefined,
      discountPercent: Number(accountFormData.discountPercent) || undefined,
      level: Number(accountFormData.level),
      charactersCount: Number(accountFormData.charactersCount) || 30,
      server: accountFormData.server,
      region: accountFormData.region,
      description: accountFormData.description.trim(),
      images: accountFormData.images.length > 0 ? accountFormData.images : [settings.heroBannerUrl],
      videoUrl: accountFormData.videoUrl.trim() || undefined,
      features,
      status: accountFormData.status,
      isFeatured: accountFormData.isFeatured,
      isOffer: accountFormData.isOffer,
      category: accountFormData.category,
      rank: accountFormData.rank,
      rareItems,
      loginMethod: accountFormData.loginMethod,
      rating: editingAccount ? editingAccount.rating : 5.0,
      reviewsCount: editingAccount ? editingAccount.reviewsCount : 0,
    };

    try {
      if (editingAccount) {
        const updated = await api.updateAccount(editingAccount.id, payload);
        setAccounts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        showNotification('تم تحديث بيانات الحساب بنجاح');
      } else {
        const created = await api.createAccount(payload);
        setAccounts((prev) => [created, ...prev]);
        showNotification('تم إضافة الحساب الجديد بنجاح');
      }
      setAccountModalOpen(false);
      loadAllAdminData();
    } catch (err: any) {
      showNotification(err.message || 'فشل حفظ الحساب', true);
    }
  };

  const handleDuplicateAccount = async (id: string) => {
    try {
      const dup = await api.duplicateAccount(id);
      setAccounts((prev) => [dup, ...prev]);
      showNotification('تم نسخ الحساب بنجاح');
      loadAllAdminData();
    } catch (err: any) {
      showNotification(err.message || 'فشل نسخ الحساب', true);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا الحساب نهائياً؟')) return;
    try {
      await api.deleteAccount(id);
      setAccounts((prev) => prev.filter((a) => a.id !== id));
      showNotification('تم حذف الحساب بنجاح');
      loadAllAdminData();
    } catch (err: any) {
      showNotification(err.message || 'فشل حذف الحساب', true);
    }
  };

  const handleQuickStatusChange = async (acc: AccountProduct, newStatus: AccountStatus) => {
    try {
      const updated = await api.updateAccount(acc.id, { status: newStatus });
      setAccounts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      showNotification(`تم تغيير حالة الحساب إلى: ${newStatus}`);
      loadAllAdminData();
    } catch (err: any) {
      showNotification(err.message || 'فشل تغيير حالة الحساب', true);
    }
  };

  // Image handling in form
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setAccountFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()]
    }));
    setImageUrlInput('');
  };

  const handleRemoveImage = (idx: number) => {
    setAccountFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx)
    }));
  };

  const handleSetMainCover = (idx: number) => {
    setAccountFormData((prev) => {
      const imgs = [...prev.images];
      const [chosen] = imgs.splice(idx, 1);
      imgs.unshift(chosen);
      return { ...prev, images: imgs };
    });
  };

  const handleDirectFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showNotification('حجم الملف كبير جداً، الحد الأقصى 10 ميجابايت', true);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        if (file.type.startsWith('video/')) {
          setAccountFormData((prev) => ({ ...prev, videoUrl: base64 }));
          showNotification('تم تحميل الفيديو بنجاح');
        } else {
          setAccountFormData((prev) => ({
            ...prev,
            images: [base64, ...prev.images]
          }));
          showNotification('تم تحميل الصورة بنجاح وتعيينها كغلاف');
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // --- ORDERS HANDLERS ---
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus, deliveryInfo?: string) => {
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus, deliveryInfo);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      showNotification(`تم تحديث حالة الطلب #${updated.orderNumber} إلى ${newStatus}`);
      setSelectedOrderForDelivery(null);
      loadAllAdminData();
    } catch (err: any) {
      showNotification(err.message || 'فشل تحديث حالة الطلب', true);
    }
  };

  // --- REVIEWS HANDLERS ---
  const handleUpdateReviewStatus = async (reviewId: string, newStatus: ReviewStatus, isPinned?: boolean) => {
    try {
      const updated = await api.updateReviewStatus(reviewId, newStatus, isPinned);
      setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      showNotification(`تم تعيين حالة التقييم إلى: ${newStatus}`);
      loadAllAdminData();
    } catch (err: any) {
      showNotification(err.message || 'فشل تحديث التقييم', true);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm('هل تريد حذف هذا التقييم نهائياً؟')) return;
    try {
      await api.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      showNotification('تم حذف التقييم');
      loadAllAdminData();
    } catch (err: any) {
      showNotification(err.message || 'فشل حذف التقييم', true);
    }
  };

  // --- SETTINGS HANDLERS ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await api.updateSettings(settings);
      setSettings(updated);
      onUpdateSettings(updated);
      showNotification('تم حفظ إعدادات المتجر ونصوص الواجهة بنجاح');
    } catch (err: any) {
      showNotification(err.message || 'فشل حفظ الإعدادات', true);
    }
  };

  // --- CHANGE PASSWORD ---
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.changeAdminPassword(adminUser.username, oldPass, newPass);
      showNotification('تم تغيير كلمة مرور المشرف بنجاح');
      setShowPasswordModal(false);
      setOldPass('');
      setNewPass('');
    } catch (err: any) {
      showNotification(err.message || 'فشل تغيير كلمة المرور', true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#0a0d14] text-slate-100 flex flex-col font-['Cairo',sans-serif]">
      
      {/* Top Navbar */}
      <header className="h-16 bg-[#0f1420] border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center">
              <Shield className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5">
                <span>لوحة التحكم الإدارية</span>
                <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                  {adminUser.role}
                </span>
              </h2>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={loadAllAdminData}
            title="تحديث البيانات"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-red-400' : ''}`} />
          </button>

          <button
            onClick={() => setShowPasswordModal(true)}
            title="تغيير كلمة المرور"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <KeyRound className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">معاينة المتجر</span>
          </button>

          <button
            onClick={onLogout}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 text-xs font-bold border border-red-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">تسجيل خروج</span>
          </button>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Sidebar (Desktop & Mobile Drawer) */}
        <aside
          className={`fixed md:relative inset-y-0 right-0 z-40 w-64 bg-[#0d111a] border-l border-slate-800 p-4 flex flex-col justify-between transition-transform duration-300 ${
            mobileNavOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
          }`}
        >
          <div className="space-y-1">
            <div className="pb-3 mb-2 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">أقسام الإدارة</span>
              <button onClick={() => setMobileNavOpen(false)} className="md:hidden text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            {[
              { id: 'overview', label: 'نظرة عامة والإحصائيات', icon: LayoutDashboard },
              { id: 'accounts', label: 'إدارة الحسابات', icon: Package, badge: accounts.length },
              { id: 'orders', label: 'إدارة الطلبات', icon: ShoppingBag, badge: stats?.newOrdersCount },
              { id: 'payments', label: 'طرق وحسابات الدفع', icon: CreditCard, badge: paymentMethods.length },
              { id: 'customers', label: 'إدارة العملاء', icon: Users, badge: customers.length },
              { id: 'reviews', label: 'إدارة التقييمات', icon: Star, badge: stats?.pendingReviewsCount },
              { id: 'offers', label: 'العروض والخصومات', icon: Tag, badge: offers.length },
              { id: 'settings', label: 'إعدادات ومحتوى المتجر', icon: Settings },
              { id: 'logs', label: 'سجل النشاطات والأمان', icon: Activity },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                        isActive ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Admin User Info Footer */}
          <div className="pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs">
                {adminUser.username.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-bold text-white block truncate">{adminUser.name}</span>
                <span className="text-[10px] text-slate-400 font-mono block truncate">{adminUser.username}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#0a0d14]">
          
          {/* Notifications Alert Banner */}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">نظرة عامة على المتجر</h3>
                  <p className="text-xs text-slate-400">إحصائيات المبيعات، الحسابات، والنشاطات الأخيرة</p>
                </div>
                <button
                  onClick={handleOpenCreateAccount}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-600/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة حساب Free Fire جديد</span>
                </button>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-[#111622] border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-semibold block mb-1">إجمالي الحسابات</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-white">{stats?.totalAccounts ?? accounts.length}</span>
                    <span className="text-xs text-emerald-400 font-bold">{stats?.availableAccounts ?? 0} متاح</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#111622] border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-semibold block mb-1">الحسابات المباعة</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-amber-400">{stats?.soldAccounts ?? 0}</span>
                    <span className="text-xs text-slate-400">تم تسليمها</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#111622] border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-semibold block mb-1">إجمالي الطلبات</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-blue-400">{stats?.totalOrders ?? orders.length}</span>
                    <span className="text-xs text-red-400 font-bold">{stats?.newOrdersCount ?? 0} جديد</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#111622] border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-semibold block mb-1">إجمالي المبيعات المؤكدة</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-emerald-400">
                      {formatPrice(stats?.totalRevenue ?? 0, settings.currency)}
                    </span>
                    <span className="text-xs text-slate-400">{customers.length} عميل</span>
                  </div>
                </div>
              </div>

              {/* Two Column Grid: Recent Orders & Recent Accounts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Recent Orders */}
                <div className="p-5 rounded-2xl bg-[#111622] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-orange-400" />
                      <span>أحدث الطلبات</span>
                    </h4>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-red-400 hover:text-red-300 font-bold"
                    >
                      عرض الكل ({orders.length})
                    </button>
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order.id}
                        className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-mono font-bold text-amber-400">{order.orderNumber}</span>
                            <span className="text-white font-bold">{order.customerName}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{order.accountTitle}</p>
                        </div>
                        <div className="text-left">
                          <span className="font-bold text-white block">
                            {formatPrice(order.price, settings.currency)}
                          </span>
                          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Accounts */}
                <div className="p-5 rounded-2xl bg-[#111622] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Package className="w-4 h-4 text-red-400" />
                      <span>أحدث الحسابات المضافة</span>
                    </h4>
                    <button
                      onClick={() => setActiveTab('accounts')}
                      className="text-xs text-red-400 hover:text-red-300 font-bold"
                    >
                      عرض الكل ({accounts.length})
                    </button>
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {accounts.slice(0, 5).map((acc) => (
                      <div
                        key={acc.id}
                        className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={acc.images[0] || settings.heroBannerUrl}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-white line-clamp-1 block">{acc.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono">UID: {acc.uid} | لفل {acc.level}</span>
                          </div>
                        </div>
                        <div className="text-left shrink-0">
                          <span className="font-bold text-amber-400 block">{formatPrice(acc.price, settings.currency)}</span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              acc.status === 'available'
                                ? 'bg-emerald-500/10 text-emerald-300'
                                : acc.status === 'reserved'
                                ? 'bg-amber-500/10 text-amber-300'
                                : 'bg-red-500/10 text-red-300'
                            }`}
                          >
                            {acc.status === 'available' ? 'متاح' : acc.status === 'reserved' ? 'محجوز' : 'مباع'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: ACCOUNTS MANAGEMENT */}
          {activeTab === 'accounts' && (
            <div className="space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">إدارة حسابات Free Fire</h3>
                  <p className="text-xs text-slate-400">إضافة، تعديل، رفع صور وفيديو، وحذف الحسابات وتغيير حالتها</p>
                </div>

                <button
                  id="admin-add-account-btn"
                  onClick={handleOpenCreateAccount}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ إضافة حساب جديد</span>
                </button>
              </div>

              {/* Search in accounts */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={accountsSearch}
                  onChange={(e) => setAccountsSearch(e.target.value)}
                  placeholder="ابحث بالحساب أو الـ UID أو السيرفر..."
                  className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-[#111622] border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Accounts Table */}
              <div className="bg-[#111622] border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs text-slate-300">
                    <thead className="bg-[#0e131d] text-slate-400 font-bold border-b border-slate-800 text-[11px]">
                      <tr>
                        <th className="p-3.5">الحساب</th>
                        <th className="p-3.5">الـ UID</th>
                        <th className="p-3.5">السعر</th>
                        <th className="p-3.5">اللفل</th>
                        <th className="p-3.5">السيرفر</th>
                        <th className="p-3.5">الحالة</th>
                        <th className="p-3.5 text-center">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {accounts
                        .filter(
                          (a) =>
                            !accountsSearch.trim() ||
                            a.title.includes(accountsSearch) ||
                            a.uid.includes(accountsSearch) ||
                            a.server.includes(accountsSearch)
                        )
                        .map((acc) => (
                          <tr key={acc.id} className="hover:bg-slate-850/50 transition-colors">
                            <td className="p-3.5">
                              <div className="flex items-center gap-3">
                                <img
                                  src={acc.images[0] || settings.heroBannerUrl}
                                  alt=""
                                  className="w-12 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                                />
                                <div>
                                  <span className="font-bold text-white block line-clamp-1">{acc.title}</span>
                                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                    {acc.isFeatured && (
                                      <span className="text-amber-400 font-bold bg-amber-400/10 px-1.5 py-0.2 rounded">
                                        مميز ⭐
                                      </span>
                                    )}
                                    {acc.isOffer && (
                                      <span className="text-red-400 font-bold bg-red-400/10 px-1.5 py-0.2 rounded">
                                        عرض 🔥
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5 font-mono text-amber-300 font-bold">{acc.uid}</td>
                            <td className="p-3.5">
                              <span className="font-extrabold text-white">
                                {formatPrice(acc.price, settings.currency)}
                              </span>
                              {acc.oldPrice && (
                                <span className="text-[10px] text-slate-500 line-through block">
                                  {formatPrice(acc.oldPrice, settings.currency)}
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 font-bold text-amber-400">LVL {acc.level}</td>
                            <td className="p-3.5">{acc.server}</td>
                            <td className="p-3.5">
                              <select
                                value={acc.status}
                                onChange={(e) => handleQuickStatusChange(acc, e.target.value as AccountStatus)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                                  acc.status === 'available'
                                    ? 'bg-emerald-950 border-emerald-500/50 text-emerald-300'
                                    : acc.status === 'reserved'
                                    ? 'bg-amber-950 border-amber-500/50 text-amber-300'
                                    : 'bg-rose-950 border-rose-500/50 text-rose-300'
                                }`}
                              >
                                <option value="available">متاح للبيع</option>
                                <option value="reserved">محجوز</option>
                                <option value="sold">تم البيع</option>
                              </select>
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => handleOpenEditAccount(acc)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white"
                                  title="تعديل الحساب والوسائط"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDuplicateAccount(acc.id)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white"
                                  title="نسخ الحساب"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteAccount(acc.id)}
                                  className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-800 text-red-300 hover:text-white"
                                  title="حذف الحساب"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">إدارة طلبات الشراء</h3>
                  <p className="text-xs text-slate-400">تحديث حالات الطلبات، مراجعة التحويلات، وتسليم بيانات الحسابات</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">فلترة الحالة:</span>
                  <select
                    value={ordersFilterStatus}
                    onChange={(e) => setOrdersFilterStatus(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[#111622] border border-slate-800 text-xs text-white focus:outline-none"
                  >
                    <option value="all">جميع الطلبات ({orders.length})</option>
                    <option value="new">جديد</option>
                    <option value="reviewing">قيد المراجعة</option>
                    <option value="paid">تم تأكيد الدفع</option>
                    <option value="delivered">تم التسليم</option>
                    <option value="completed">مكتمل</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-[#111622] border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs text-slate-300">
                    <thead className="bg-[#0e131d] text-slate-400 font-bold border-b border-slate-800 text-[11px]">
                      <tr>
                        <th className="p-3.5">رقم الطلب</th>
                        <th className="p-3.5">المشتري</th>
                        <th className="p-3.5">الحساب المطلوب</th>
                        <th className="p-3.5">المبلغ</th>
                        <th className="p-3.5">طريقة الدفع</th>
                        <th className="p-3.5">حالة الطلب</th>
                        <th className="p-3.5">التاريخ</th>
                        <th className="p-3.5 text-center">إجراء وتسليم</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {orders
                        .filter((o) => ordersFilterStatus === 'all' || o.status === ordersFilterStatus)
                        .map((order) => {
                          const cleanPhone = order.customerPhone.replace(/\D/g, '');
                          return (
                            <tr key={order.id} className="hover:bg-slate-850/50 transition-colors">
                              <td className="p-3.5 font-mono font-bold text-amber-400">
                                #{order.orderNumber}
                              </td>
                              <td className="p-3.5">
                                <span className="font-bold text-white block">{order.customerName}</span>
                                <span className="text-[11px] text-slate-400 font-mono">{order.customerPhone}</span>
                              </td>
                              <td className="p-3.5">
                                <span className="font-semibold text-white block line-clamp-1">{order.accountTitle}</span>
                                <span className="text-[10px] text-slate-400 font-mono">UID: {order.accountUid}</span>
                              </td>
                              <td className="p-3.5 font-extrabold text-white">
                                {formatPrice(order.price, settings.currency)}
                              </td>
                              <td className="p-3.5 text-slate-300">{order.paymentMethod}</td>
                              <td className="p-3.5">
                                <select
                                  value={order.status}
                                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900 border border-slate-700 text-white"
                                >
                                  <option value="new">جديد</option>
                                  <option value="reviewing">قيد المراجعة</option>
                                  <option value="paid">تم تأكيد الدفع</option>
                                  <option value="delivered">تم التسليم</option>
                                  <option value="completed">مكتمل</option>
                                  <option value="cancelled">ملغي</option>
                                </select>
                              </td>
                              <td className="p-3.5 text-slate-400 text-[11px]">
                                {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                              </td>
                              <td className="p-3.5">
                                <div className="flex items-center justify-center gap-1.5">
                                  {/* Direct WhatsApp Contact Button */}
                                  <a
                                    href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                      `مرحباً ${order.customerName}، معك متجر ${settings.storeName} بخصوص طلبك رقم ${order.orderNumber}.`
                                    )}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400"
                                    title="تواصل واتساب مع المشتري"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                  </a>

                                  {/* Set delivery credentials */}
                                  <button
                                    onClick={() => {
                                      setSelectedOrderForDelivery(order);
                                      setDeliveryInfoText(order.deliveryInfo || '');
                                    }}
                                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold"
                                    title="تسجيل بيانات التسليم"
                                  >
                                    بيانات التسليم
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: CUSTOMERS MANAGEMENT */}
          {activeTab === 'customers' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">إدارة العملاء والمشترين</h3>
                <p className="text-xs text-slate-400">سجل العملاء، عدد الطلبات، وإجمالي المشتريات</p>
              </div>

              <div className="bg-[#111622] border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs text-slate-300">
                    <thead className="bg-[#0e131d] text-slate-400 font-bold border-b border-slate-800 text-[11px]">
                      <tr>
                        <th className="p-3.5">اسم العميل</th>
                        <th className="p-3.5">رقم الهاتف</th>
                        <th className="p-3.5">البريد الإلكتروني</th>
                        <th className="p-3.5">عدد الطلبات</th>
                        <th className="p-3.5">إجمالي المشتريات</th>
                        <th className="p-3.5">تاريخ التسجيل</th>
                        <th className="p-3.5 text-center">تواصل</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {customers.map((cust) => {
                        const cleanPhone = cust.phone.replace(/\D/g, '');
                        return (
                          <tr key={cust.id} className="hover:bg-slate-850/50 transition-colors">
                            <td className="p-3.5 font-bold text-white">{cust.name}</td>
                            <td className="p-3.5 font-mono text-slate-300">{cust.phone}</td>
                            <td className="p-3.5 text-slate-400">{cust.email || '—'}</td>
                            <td className="p-3.5 font-bold text-amber-400">{cust.totalOrders} طلب</td>
                            <td className="p-3.5 font-extrabold text-emerald-400">
                              {formatPrice(cust.totalSpent, settings.currency)}
                            </td>
                            <td className="p-3.5 text-slate-400 text-[11px]">
                              {new Date(cust.createdAt).toLocaleDateString('ar-SA')}
                            </td>
                            <td className="p-3.5 text-center">
                              <a
                                href={`https://wa.me/${cleanPhone}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: REVIEWS MANAGEMENT */}
          {activeTab === 'reviews' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">إدارة التقييمات والآراء</h3>
                <p className="text-xs text-slate-400">اعتماد تقييمات العملاء، رفضها، أو تثبيتها (لا تظهر التقييمات للعامة إلا بعد موافقة الإدارة)</p>
              </div>

              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      rev.status === 'pending'
                        ? 'bg-amber-950/20 border-amber-500/40'
                        : rev.status === 'approved'
                        ? 'bg-[#111622] border-slate-800'
                        : 'bg-rose-950/20 border-rose-500/30 opacity-70'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{rev.customerName}</span>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            rev.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : rev.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {rev.status === 'approved' ? 'معتمد' : rev.status === 'pending' ? 'بانتظار الموافقة' : 'مرفوض'}
                        </span>
                        {rev.isPinned && (
                          <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                            مثبت ⭐
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-slate-400 block font-semibold">
                        الحساب: {rev.accountTitle}
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed italic">"{rev.comment}"</p>
                      <span className="text-[10px] text-slate-500 block">
                        {new Date(rev.createdAt).toLocaleDateString('ar-SA')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {rev.status !== 'approved' && (
                        <button
                          onClick={() => handleUpdateReviewStatus(rev.id, 'approved', rev.isPinned)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                        >
                          موافقة واعتماد
                        </button>
                      )}
                      {rev.status !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateReviewStatus(rev.id, 'rejected', false)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                        >
                          رفض
                        </button>
                      )}
                      <button
                        onClick={() => handleUpdateReviewStatus(rev.id, rev.status, !rev.isPinned)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                          rev.isPinned ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {rev.isPinned ? 'إلغاء التثبيت' : 'تثبيت'}
                      </button>
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="p-2 rounded-xl bg-red-950/60 text-red-300 hover:bg-red-800"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: OFFERS MANAGEMENT */}
          {activeTab === 'offers' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">نظام العروض والتخفيضات</h3>
                  <p className="text-xs text-slate-400">إدارة البنرات، نسب الخصم، وتحديد الحسابات المشمولة بالعرض</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {offers.map((off) => (
                  <div key={off.id} className="p-5 rounded-2xl bg-[#111622] border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-black">
                        خصم {off.discountPercent}%
                      </span>
                      <span className="text-xs text-emerald-400 font-bold">
                        {off.active ? 'العرض نشط حالياً' : 'غير نشط'}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">{off.title}</h4>
                    <p className="text-xs text-slate-300">{off.description}</p>
                    <div className="text-[11px] text-slate-400 font-mono">
                      صالح حتى: {new Date(off.endDate).toLocaleDateString('ar-SA')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: STORE CONTENT & SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">إدارة محتوى المتجر والإعدادات</h3>
                <p className="text-xs text-slate-400">
                  تعديل اسم المتجر، أرقام الواتساب، البانرات، وشروط البيع بدون تعديل أي سطر كود!
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                
                {/* General Brand Settings */}
                <div className="p-5 rounded-2xl bg-[#111622] border border-slate-800 space-y-4">
                  <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                    المعلومات الأساسية
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">اسم المتجر:</label>
                      <input
                        type="text"
                        value={settings.storeName}
                        onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">وصف المتجر المختصر:</label>
                      <input
                        type="text"
                        value={settings.storeSubtitle}
                        onChange={(e) => setSettings({ ...settings, storeSubtitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">العملة الافتراضية:</label>
                      <select
                        value={settings.currency}
                        onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      >
                        <option value="SAR">ريال سعودي (SAR)</option>
                        <option value="USD">دولار أمريكي (USD)</option>
                        <option value="AED">درهم إماراتي (AED)</option>
                        <option value="EGP">جنيه مصري (EGP)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">رابط بانر الهيرو Hero Image URL:</label>
                      <input
                        type="text"
                        value={settings.heroBannerUrl}
                        onChange={(e) => setSettings({ ...settings, heroBannerUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Hero Texts */}
                <div className="p-5 rounded-2xl bg-[#111622] border border-slate-800 space-y-4">
                  <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                    نصوص الواجهة الرئيسية (Hero Section)
                  </h4>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">العنوان الرئيسي الجذاب:</label>
                    <input
                      type="text"
                      value={settings.heroTitle}
                      onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">الوصف الفرعي تحت العنوان:</label>
                    <textarea
                      rows={2}
                      value={settings.heroSubtitle}
                      onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Contact & Social Links (Critical Item #15) */}
                <div className="p-5 rounded-2xl bg-[#111622] border border-slate-800 space-y-4">
                  <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                    وسائل التواصل والواتساب (يتم استخدامه في إرسال الطلبات)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1 font-bold text-emerald-400">
                        رقم واتساب المتجر (مع الرمز الدولي مثل +966...):
                      </label>
                      <input
                        type="text"
                        required
                        value={settings.whatsappNumber}
                        onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-emerald-500/50 text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">قناة Telegram:</label>
                      <input
                        type="text"
                        value={settings.telegramUrl}
                        onChange={(e) => setSettings({ ...settings, telegramUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">حساب Instagram:</label>
                      <input
                        type="text"
                        value={settings.instagramUrl}
                        onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">سيرفر Discord (اختياري):</label>
                      <input
                        type="text"
                        value={settings.discordUrl || ''}
                        onChange={(e) => setSettings({ ...settings, discordUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Announcement Bar */}
                <div className="p-5 rounded-2xl bg-[#111622] border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-sm font-bold text-white">شريط الإعلانات العلوي</h4>
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.announcementEnabled}
                        onChange={(e) => setSettings({ ...settings, announcementEnabled: e.target.checked })}
                        className="accent-red-500"
                      />
                      <span>تفعيل الشريط</span>
                    </label>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">نص الإعلان العلوي:</label>
                    <input
                      type="text"
                      value={settings.announcementText}
                      onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Policies Editor */}
                <div className="p-5 rounded-2xl bg-[#111622] border border-slate-800 space-y-4">
                  <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                    السياسات والشروط
                  </h4>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">شروط البيع والاستخدام:</label>
                    <textarea
                      rows={3}
                      value={settings.termsOfSale}
                      onChange={(e) => setSettings({ ...settings, termsOfSale: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">سياسة الاسترجاع والضمان:</label>
                    <textarea
                      rows={3}
                      value={settings.refundPolicy}
                      onChange={(e) => setSettings({ ...settings, refundPolicy: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-xl shadow-red-600/20 cursor-pointer"
                >
                  حفظ جميع الإعدادات وتطبيقها فورياً
                </button>
              </form>
            </div>
          )}

          {/* TAB 8: ACTIVITY LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">سجل العمليات والأمان</h3>
                <p className="text-xs text-slate-400">سجل تدقيق كامل للعمليات والتعديلات التي يقوم بها المشرف</p>
              </div>

              <div className="bg-[#111622] border border-slate-800 rounded-2xl overflow-hidden shadow-lg p-4">
                <div className="space-y-2 max-h-[650px] overflow-y-auto">
                  {activityLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-white">{log.action}</span>
                          <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                            {log.adminName}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300">{log.details}</p>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString('ar-SA')} -{' '}
                        {new Date(log.timestamp).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: PAYMENTS MANAGEMENT */}
          {activeTab === 'payments' && (
            <PaymentsManager
              paymentMethods={paymentMethods}
              onRefresh={loadAllAdminData}
              onShowMessage={showNotification}
            />
          )}

        </main>
      </div>

      {/* MODAL: CREATE / EDIT ACCOUNT */}
      {accountModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-[#111622] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6">
            
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0d111a]">
              <h3 className="font-bold text-base text-white">
                {editingAccount ? 'تعديل بيانات الحساب' : 'إضافة حساب Free Fire جديد'}
              </h3>
              <button
                onClick={() => setAccountModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAccount} className="p-5 overflow-y-auto max-h-[80vh] space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1 font-bold">اسم الحساب الكامل *</label>
                  <input
                    type="text"
                    required
                    value={accountFormData.title}
                    onChange={(e) => setAccountFormData({ ...accountFormData, title: e.target.value })}
                    placeholder="مثال: حساب ساكورا وهيب هوب لفل 79"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1 font-bold">رقم/معرف الحساب UID *</label>
                  <input
                    type="text"
                    required
                    value={accountFormData.uid}
                    onChange={(e) => setAccountFormData({ ...accountFormData, uid: e.target.value })}
                    placeholder="UID: 1098472910"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1 font-bold">السعر النهائي (SAR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={accountFormData.price}
                    onChange={(e) => setAccountFormData({ ...accountFormData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">السعر قبل الخصم (اختياري)</label>
                  <input
                    type="number"
                    value={accountFormData.oldPrice || ''}
                    onChange={(e) => setAccountFormData({ ...accountFormData, oldPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">نسبة الخصم %</label>
                  <input
                    type="number"
                    value={accountFormData.discountPercent || ''}
                    onChange={(e) => setAccountFormData({ ...accountFormData, discountPercent: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1 font-bold">مستوى الحساب (Level) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={accountFormData.level}
                    onChange={(e) => setAccountFormData({ ...accountFormData, level: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1 font-bold">السيرفر *</label>
                  <select
                    value={accountFormData.server}
                    onChange={(e) => setAccountFormData({ ...accountFormData, server: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="الشرق الأوسط (MEA)">الشرق الأوسط (MEA)</option>
                    <option value="أوروبا (EU)">أوروبا (EU)</option>
                    <option value="أمريكا الشمالية (NA)">أمريكا الشمالية (NA)</option>
                    <option value="سنغافورة (SG)">سنغافورة (SG)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">الحالة الحالية</label>
                  <select
                    value={accountFormData.status}
                    onChange={(e) => setAccountFormData({ ...accountFormData, status: e.target.value as AccountStatus })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                  >
                    <option value="available">متاح للبيع</option>
                    <option value="reserved">محجوز</option>
                    <option value="sold">تم البيع</option>
                  </select>
                </div>
              </div>

              {/* Media Management (Multiple Images & Video) */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center justify-between">
                  <span>معرض الصور والفيديو</span>
                  <span className="text-[10px] text-slate-400 font-normal">يمكنك رفع عدة صور وتحديد الغلاف</span>
                </h4>

                {/* Upload from device / Add URL */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-8 flex gap-2">
                    <input
                      type="text"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="رابط صورة مباشرة (URL)..."
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3 py-1.5 rounded-lg bg-slate-700 text-white text-xs font-bold shrink-0"
                    >
                      إضافة رابط
                    </button>
                  </div>

                  <div className="sm:col-span-4">
                    <label className="w-full py-1.5 px-3 rounded-lg bg-red-600/30 hover:bg-red-600/50 border border-red-500/40 text-red-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>رفع من الجهاز</span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleDirectFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Current Images List */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {accountFormData.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-24 h-16 rounded-lg overflow-hidden border border-slate-700 group bg-black"
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetMainCover(idx)}
                            className="p-1 rounded bg-amber-500 text-black text-[9px] font-bold"
                            title="تعيين كصورة رئيسية"
                          >
                            غلاف
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1 rounded bg-red-600 text-white"
                          title="حذف الصورة"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      {idx === 0 && (
                        <span className="absolute top-1 right-1 bg-amber-500 text-black text-[9px] font-black px-1 rounded">
                          الغلاف
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Video URL */}
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">رابط فيديو للحساب (YouTube أو MP4):</label>
                  <input
                    type="text"
                    value={accountFormData.videoUrl}
                    onChange={(e) => setAccountFormData({ ...accountFormData, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Features & Description */}
              <div>
                <label className="text-[11px] text-slate-400 block mb-1 font-bold">
                  مميزات الحساب (اكتب كل ميزة في سطر):
                </label>
                <textarea
                  rows={3}
                  value={accountFormData.featuresStr}
                  onChange={(e) => setAccountFormData({ ...accountFormData, featuresStr: e.target.value })}
                  placeholder="سكن الساكورا الكامل&#10;شوتجن الحمم دبل دامج&#10;رقصة العرش"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1 font-bold">وصف الحساب التفصيلي:</label>
                <textarea
                  rows={3}
                  value={accountFormData.description}
                  onChange={(e) => setAccountFormData({ ...accountFormData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">العناصر النادرة (مفصولة بفواصل):</label>
                  <input
                    type="text"
                    value={accountFormData.rareItemsStr}
                    onChange={(e) => setAccountFormData({ ...accountFormData, rareItemsStr: e.target.value })}
                    placeholder="ساكورا, هيب هوب, كريمينال"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">طريقة تسجيل الدخول / الربط:</label>
                  <input
                    type="text"
                    value={accountFormData.loginMethod}
                    onChange={(e) => setAccountFormData({ ...accountFormData, loginMethod: e.target.value })}
                    placeholder="Google Play رسمي / Facebook"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              {/* Featured & Offer Checkboxes */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accountFormData.isFeatured}
                    onChange={(e) => setAccountFormData({ ...accountFormData, isFeatured: e.target.checked })}
                    className="accent-red-500"
                  />
                  <span>تمييز الحساب كـ (حساب مميز ⭐)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accountFormData.isOffer}
                    onChange={(e) => setAccountFormData({ ...accountFormData, isOffer: e.target.checked })}
                    className="accent-red-500"
                  />
                  <span>تضمين في قسم (أقوى العروض 🔥)</span>
                </label>
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAccountModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg shadow-red-600/20"
                >
                  {editingAccount ? 'حفظ التعديلات' : 'إضافة الحساب فورياً'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: ORDER DELIVERY CREDENTIALS */}
      {selectedOrderForDelivery && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#111622] border border-slate-700 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">
                بيانات التسليم للطلب #{selectedOrderForDelivery.orderNumber}
              </h3>
              <button onClick={() => setSelectedOrderForDelivery(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                اكتب بيانات تسجيل الدخول التي ستظهر للمشتري في صفحة تتبع الطلب:
              </label>
              <textarea
                rows={4}
                value={deliveryInfoText}
                onChange={(e) => setDeliveryInfoText(e.target.value)}
                placeholder="البريد: user@gmail.com&#10;كلمة المرور: XXXXXX&#10;رمز التحقق: 123456"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedOrderForDelivery(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                onClick={() =>
                  handleUpdateOrderStatus(
                    selectedOrderForDelivery.id,
                    'delivered',
                    deliveryInfoText
                  )
                }
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                حفظ وتسليم الحساب
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CHANGE ADMIN PASSWORD */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-sm bg-[#111622] border border-slate-700 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">تغيير كلمة مرور المشرف</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">كلمة المرور الحالية:</label>
                <input
                  type="password"
                  required
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">كلمة المرور الجديدة:</label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold"
                >
                  تحديث كلمة المرور
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
