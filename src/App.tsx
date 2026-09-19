import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AccountsCatalog } from './components/AccountsCatalog';
import { AccountDetailModal } from './components/AccountDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { OffersSection } from './components/OffersSection';
import { HowToBuy } from './components/HowToBuy';
import { FAQSection } from './components/FAQSection';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import {
  AccountProduct,
  StoreSettings,
  Offer,
  Review,
  AdminUser,
  Order
} from './types';
import { api } from './lib/api';
import { MessageCircle, ShoppingCart, Check, Flame, X } from 'lucide-react';

export default function App() {
  // Store Data States
  const [currency, setCurrency] = useState('YER');
  const [activeSection, setActiveSection] = useState('home');

  const [settings, setSettings] = useState<StoreSettings>({
    storeName: 'Free Game | متجر حسابات فري فاير',
    storeSubtitle: 'متجر Free Game المتخصص في بيع وشراء حسابات لعبة Free Fire النادرة بأسعار تنافسية وضمان 100%',
    logoUrl: '',
    heroTitle: 'حسابات Free Fire نادرة وأسطورية بأسعار تنافسية',
    heroSubtitle: 'سكنات الساكورا، أسلحة الإيفو ماكس، رقصات نادرة، وحسابات لفل 70+ مع تسليم فوري وضمان أمان كامل',
    heroBannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&auto=format&fit=crop&q=80',
    whatsappNumber: '+967777506778',
    telegramUrl: 'https://t.me/freefirestore',
    instagramUrl: 'https://instagram.com/freefirestore',
    currency: 'YER',
    themePrimaryColor: '#ff4655',
    announcementText: '🔥 خصومات نارية تصل إلى 35% على حسابات الساكورا والإيفو ماكس بمناسبة التحديث الجديد!',
    announcementEnabled: true,
    faqs: [],
    termsOfSale: 'جميع الحسابات يتم فحصها والتأكد من صحة بياناتها قبل التسليم. يتم تسليم البريد وكلمة السر الأصلية للمشتري مباشرة.',
    refundPolicy: 'نضمن لك استبدال الحساب أو استرجاع المبلغ في حال وجود أي مشكلة في بيانات الدخول خلال فترة الضمان.',
    privacyPolicy: 'نلتزم بالحفاظ على سرية وأمان جميع بيانات العملاء والطلبات.',
    supportEmail: 'support@ff-firestore.com',
  });

  const [accounts, setAccounts] = useState<AccountProduct[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  // Modal States
  const [selectedAccountForDetail, setSelectedAccountForDetail] = useState<AccountProduct | null>(null);
  const [selectedAccountForCheckout, setSelectedAccountForCheckout] = useState<AccountProduct | null>(null);
  const [showOrderTracking, setShowOrderTracking] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Cart / Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  // Load initial store data
  useEffect(() => {
    loadStoreData();
    try {
      const savedUser = localStorage.getItem('ff_admin_user');
      if (savedUser) {
        setAdminUser(JSON.parse(savedUser));
      }
    } catch {
      // ignore
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadStoreData = async () => {
    try {
      setLoading(true);
      const [sett, accs, offs, revs] = await Promise.all([
        api.getSettings().catch(() => settings),
        api.getAccounts().catch(() => []),
        api.getOffers().catch(() => []),
        api.getReviews({ status: 'approved' }).catch(() => [])
      ]);

      setSettings(sett);
      if (sett.currency) {
        setCurrency(sett.currency);
      }
      setAccounts(accs);
      setOffers(offs);
      setReviews(revs);
    } catch (err) {
      console.error('Error loading store data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddToCart = (account: AccountProduct) => {
    setCartCount((prev) => prev + 1);
    showToast(`تمت إضافة "${account.title}" إلى قائمة الاهتمام`);
  };

  const handleBuyNow = (account: AccountProduct) => {
    setSelectedAccountForCheckout(account);
  };

  const handleOrderSuccess = (order: Order) => {
    // Refresh accounts so status reflects reservation
    loadStoreData();
  };

  const cleanWhatsApp = settings.whatsappNumber.replace(/\D/g, '');

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col font-['Cairo',sans-serif] selection:bg-red-600 selection:text-white relative pb-20 lg:pb-0">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#121722] border border-red-500/50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fadeIn">
          <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-xs">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white mr-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        settings={settings}
        currency={currency}
        onCurrencyChange={setCurrency}
        onOpenSearch={() => handleNavigate('accounts')}
        onOpenTracking={() => setShowOrderTracking(true)}
        onOpenAdmin={() => {
          if (adminUser) {
            setShowAdminDashboard(true);
          } else {
            setShowAdminLogin(true);
          }
        }}
        onNavigate={(sec) => {
          setActiveSection(sec);
          handleNavigate(sec);
        }}
        activeSection={activeSection}
        cartCount={cartCount}
        onOpenCart={() => handleNavigate('accounts')}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <HeroSection
          settings={settings}
          onBrowseAccounts={() => handleNavigate('accounts')}
          onViewOffers={() => handleNavigate('offers')}
          totalAvailable={accounts.filter((a) => a.status === 'available').length}
        />

        {/* Offers & Flash Sales Section */}
        <OffersSection
          offers={offers}
          accounts={accounts}
          currency={currency}
          onViewDetails={(acc) => setSelectedAccountForDetail(acc)}
          onBuyNow={handleBuyNow}
        />

        {/* Main Accounts Catalog with live search & filters */}
        <AccountsCatalog
          accounts={accounts}
          currency={currency}
          onViewDetails={(acc) => setSelectedAccountForDetail(acc)}
          onBuyNow={handleBuyNow}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* How To Buy Steps */}
        <HowToBuy />

        {/* Customer Reviews */}
        <ReviewsSection reviews={reviews} />

        {/* FAQs Section */}
        {settings.faqs && settings.faqs.length > 0 && (
          <FAQSection faqs={settings.faqs} />
        )}

      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onNavigate={handleNavigate}
        onOpenAdmin={() => {
          if (adminUser) {
            setShowAdminDashboard(true);
          } else {
            setShowAdminLogin(true);
          }
        }}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenTracking={() => setShowOrderTracking(true)}
        cartCount={cartCount}
        onOpenCart={() => handleNavigate('accounts')}
        settings={settings}
      />

      {/* Desktop Floating WhatsApp Quick Contact Button */}
      <a
        href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
          'مرحباً متجر Free Fire، أود الاستفسار عن الحسابات المتوفرة لديكم.'
        )}`}
        target="_blank"
        rel="noreferrer"
        className="hidden sm:flex fixed bottom-6 left-6 z-40 p-3.5 sm:p-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white shadow-2xl shadow-emerald-500/30 items-center gap-2 group transition-all duration-300 hover:scale-105"
        title="تواصل معنا مباشرة عبر WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-bold text-xs">
          دعم واتساب فوري
        </span>
      </a>

      {/* MODALS */}

      {/* Account Detail Modal */}
      {selectedAccountForDetail && (
        <AccountDetailModal
          account={selectedAccountForDetail}
          settings={settings}
          currency={settings.currency}
          onClose={() => setSelectedAccountForDetail(null)}
          onBuyNow={handleBuyNow}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Checkout Modal */}
      {selectedAccountForCheckout && (
        <CheckoutModal
          account={selectedAccountForCheckout}
          settings={settings}
          currency={settings.currency}
          onClose={() => setSelectedAccountForCheckout(null)}
          onOrderSuccess={handleOrderSuccess}
        />
      )}

      {/* Order Tracking Modal */}
      {showOrderTracking && (
        <OrderTrackingModal
          settings={settings}
          currency={settings.currency}
          onClose={() => setShowOrderTracking(false)}
        />
      )}

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLoginModal
          onClose={() => setShowAdminLogin(false)}
          onSuccess={(user) => {
            setAdminUser(user);
            setShowAdminLogin(false);
            setShowAdminDashboard(true);
          }}
        />
      )}

      {/* Admin Dashboard */}
      {showAdminDashboard && adminUser && (
        <AdminDashboard
          adminUser={adminUser}
          settings={settings}
          onUpdateSettings={(newSettings) => {
            setSettings(newSettings);
          }}
          onClose={() => {
            setShowAdminDashboard(false);
            loadStoreData();
          }}
          onLogout={() => {
            setAdminUser(null);
            setShowAdminDashboard(false);
            localStorage.removeItem('admin_token');
          }}
        />
      )}

    </div>
  );
}
