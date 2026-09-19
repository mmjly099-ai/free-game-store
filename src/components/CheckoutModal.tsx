import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Check,
  MessageCircle,
  CreditCard,
  Phone,
  User,
  Mail,
  FileText,
  Flame,
  ArrowRight,
  Sparkles,
  Clock,
  Copy,
  Building,
  Smartphone,
  Zap,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AccountProduct, StoreSettings, Order, PaymentMethod } from '../types';
import { formatPrice, formatWhatsAppUrl, api } from '../lib/api';

interface CheckoutModalProps {
  account: AccountProduct | null;
  settings: StoreSettings;
  currency: string;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

const FALLBACK_YEMENI_METHODS: PaymentMethod[] = [
  {
    id: 'pay-kuraimi',
    name: 'بنك الكريمي (حساب / إكسبرس)',
    provider: 'kuraimi',
    accountNumber: '300482910',
    accountName: 'متجر فري فاير - اليمن',
    instructions: 'قم بالتحويل عبر تطبيق الكريمي جوال أو إرسال حوالة كريمي إكسبرس، ثم أرسل إشعار أو رقم العملية على واتساب.',
    note: 'تحويل فوري ومباشر عبر بنك الكريمي',
    icon: '🏦',
    active: true,
    currency: 'YER / SAR / USD'
  },
  {
    id: 'pay-jeeb',
    name: 'محفظة جيب (Jeeb)',
    provider: 'jeeb',
    accountNumber: '775123456',
    accountName: 'متجر Free Fire الرسمي',
    instructions: 'افتح تطبيق جيب وقم بالتحويل إلى رقم المحفظة الموضح ثم انسخ رقم العملية لتأكيد استلام الحساب فوراً.',
    note: 'دفع فوري عبر محفظة جيب الإلكترونية',
    icon: '📱',
    active: true,
    currency: 'YER'
  },
  {
    id: 'pay-onecash',
    name: 'محفظة ون كاش (OneCash)',
    provider: 'onecash',
    accountNumber: '780987654',
    accountName: 'متجر فري فاير ون كاش',
    instructions: 'ادفع عبر تطبيق OneCash إلى رقم الحساب أعلاه مع كتابة رقم طلبك في الملاحظات.',
    note: 'دفع سريع ومباشر عبر OneCash بنك اليمن والكويت',
    icon: '⚡',
    active: true,
    currency: 'YER'
  },
  {
    id: 'pay-exchange',
    name: 'حوالة صرافة يمنية (النجم / الامتياز / يمن إكسبرس)',
    provider: 'exchange',
    accountNumber: 'صنعاء / عدن (باسم المستلم)',
    accountName: 'أمين محمد علي القديمي',
    instructions: 'أرسل الحوالة عبر أي شبكة صرافة (النجم، الامتياز، يمن إكسبرس، داديه) وأرسل صورة السند عبر واتساب.',
    note: 'متاح عبر جميع فروع وشبكات الصرافة في اليمن',
    icon: '💸',
    active: true,
    currency: 'YER / SAR'
  }
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  account,
  settings,
  currency,
  onClose,
  onOrderSuccess,
}) => {
  if (!account) return null;

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [transferReference, setTransferReference] = useState('');
  const [notes, setNotes] = useState('');

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(FALLBACK_YEMENI_METHODS);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>('pay-kuraimi');
  const [copiedNumber, setCopiedNumber] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Success state
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [whatsappText, setWhatsappText] = useState('');

  // Fetch dynamic payment methods from server
  useEffect(() => {
    let mounted = true;
    api.getPaymentMethods(false)
      .then((methods) => {
        if (mounted && methods && methods.length > 0) {
          setPaymentMethods(methods);
          setSelectedPaymentId(methods[0].id);
        }
      })
      .catch(() => {
        // use fallbacks gracefully
      });
    return () => {
      mounted = false;
    };
  }, []);

  const selectedMethod = paymentMethods.find(m => m.id === selectedPaymentId) || paymentMethods[0];

  const handleCopyAccount = () => {
    if (!selectedMethod?.accountNumber) return;
    navigator.clipboard.writeText(selectedMethod.accountNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim() || !customerPhone.trim()) {
      setError('يرجى كتابة الاسم الكامل ورقم الهاتف لتسليم بيانات الحساب');
      return;
    }

    try {
      setLoading(true);
      const res = await api.createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        accountId: account.id,
        paymentMethod: selectedMethod ? selectedMethod.name : 'تحويل يمني',
        transferReference: transferReference.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      setCreatedOrder(res.order);
      setWhatsappText(res.whatsappMessage);
      onOrderSuccess(res.order);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff4655', '#ffaa00', '#10b981', '#3b82f6'],
        });
      } catch (err) {
        // ignore if not supported
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء إنشاء الطلب، يرجى المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenWhatsApp = () => {
    window.open(formatWhatsAppUrl(settings.whatsappNumber || '777506778', whatsappText), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-6 animate-fadeIn">
      <div
        id="checkout-modal"
        className="relative w-full max-w-2xl bg-[#111622] border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-3 sm:my-6"
      >
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800 flex items-center justify-between bg-[#0d111a]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                {createdOrder ? 'تم تأكيد طلبك بنجاح!' : 'شراء حساب Free Fire (دفع يمني سريع)'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {createdOrder ? 'تواصل فوراً عبر واتساب لاستلام معلومات تسجيل الدخول' : 'تسليم فوري ومباشر عبر واتساب مع ضمان الحماية'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 max-h-[85vh] overflow-y-auto">
          {createdOrder ? (
            /* SUCCESS VIEW */
            <div className="text-center py-2 sm:py-4 space-y-4 sm:space-y-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500/50 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <Check className="w-8 h-8 text-emerald-400" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  تهانينا! تم تسجيل وتأكيد الطلب
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  رقم طلبك:{' '}
                  <span className="font-mono text-amber-400 bg-slate-900 px-3 py-1 rounded-xl border border-slate-700 inline-block mt-1 sm:mt-0">
                    {createdOrder.orderNumber}
                  </span>
                </h3>
              </div>

              {/* Order Info Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-right space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">اسم الحساب:</span>
                  <span className="font-bold text-white">{account.title}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">معرف UID:</span>
                  <span className="font-mono text-amber-300 font-bold">{account.uid}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">المبلغ المطلوب:</span>
                  <span className="font-extrabold text-emerald-400 text-sm">
                    {formatPrice(account.price, currency)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">طريقة التحويل:</span>
                  <span className="text-white font-bold">{createdOrder.paymentMethod}</span>
                </div>
                {createdOrder.transferReference && (
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">رقم الحوالة/العملية:</span>
                    <span className="font-mono text-amber-400 font-bold">{createdOrder.transferReference}</span>
                  </div>
                )}
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">المشتري:</span>
                  <span className="text-white">{createdOrder.customerName} ({createdOrder.customerPhone})</span>
                </div>
              </div>

              {/* WHATSAPP BUTTON */}
              <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 text-center space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  اضغط الزر الأخضر أدناه لإرسال تفاصيل طلبك مباشرة إلى خدمة العملاء عبر واتساب واستلام بيانات الحساب وطريقة تأمينه فوراً:
                </p>

                <button
                  id="send-order-whatsapp-btn"
                  onClick={handleOpenWhatsApp}
                  className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer min-h-[48px]"
                >
                  <MessageCircle className="w-5 h-5 fill-current shrink-0" />
                  <span>إرسال الطلب واستلام الحساب عبر WhatsApp</span>
                </button>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all"
                >
                  العودة لتصفح المتجر
                </button>
              </div>
            </div>
          ) : (
            /* CHECKOUT FORM VIEW */
            <form onSubmit={handleSubmitOrder} className="space-y-4 sm:space-y-5">
              
              {/* Account Summary Strip */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={account.images[0] || settings.heroBannerUrl}
                    alt={account.title}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">{account.title}</h4>
                    <span className="text-[11px] font-mono text-slate-400 block truncate">
                      UID: {account.uid} | مستوى {account.level}
                    </span>
                  </div>
                </div>
                <div className="text-left shrink-0">
                  <span className="text-[11px] text-slate-400 block">المبلغ:</span>
                  <span className="text-sm sm:text-base font-black text-amber-400">
                    {formatPrice(account.price, currency)}
                  </span>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
                  <span>⚠️ {error}</span>
                </div>
              )}

              {/* 1. Customer Information */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-red-400" />
                  <span>معلومات المشتري (للتواصل وتسليم الحساب):</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1 font-semibold">الاسم الكامل *</label>
                    <input
                      id="checkout-customer-name"
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="مثال: صالح محمد اليافعي"
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-colors min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1 font-semibold">رقم الواتساب أو الهاتف *</label>
                    <input
                      id="checkout-customer-phone"
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="مثال: 771234567 أو 731234567"
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-red-500 transition-colors min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">البريد الإلكتروني (اختياري)</label>
                    <input
                      id="checkout-customer-email"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-red-500 transition-colors min-h-[42px]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">ملاحظات أو طلبات خاصة (اختياري)</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="أي استفسار أو تفضيل تود إبلاغنا به..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-red-500 transition-colors min-h-[42px]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Payment Method Selector (Yemeni Methods) */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-orange-400" />
                    <span>اختر طريقة التحويل والدفع:</span>
                  </h4>
                  <span className="text-[10px] text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                    طرق دفع يمنية معتمدة
                  </span>
                </div>

                {/* Methods Buttons Carousel / Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {paymentMethods.map((method) => {
                    const isSelected = selectedPaymentId === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedPaymentId(method.id)}
                        className={`p-2.5 sm:p-3 rounded-2xl border text-right transition-all flex flex-col justify-between cursor-pointer min-h-[64px] ${
                          isSelected
                            ? 'border-orange-500 bg-orange-500/15 shadow-md ring-1 ring-orange-500/40'
                            : 'border-slate-800 bg-slate-900/70 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-lg">{method.icon || '💳'}</span>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px]">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="text-xs font-extrabold text-white block leading-tight">
                            {method.name}
                          </span>
                          {method.currency && (
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {method.currency}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Detailed Information Box for Selected Method */}
                {selectedMethod && (
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-[#0e131d] border border-orange-500/30 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{selectedMethod.icon}</span>
                        <span className="text-xs font-extrabold text-white">{selectedMethod.name}</span>
                      </div>
                      {selectedMethod.note && (
                        <span className="text-[10px] text-orange-400 font-medium">{selectedMethod.note}</span>
                      )}
                    </div>

                    {/* Account Number & Copy Button */}
                    <div className="p-3 rounded-xl bg-black/50 border border-slate-800 flex items-center justify-between gap-2">
                      <div className="overflow-hidden">
                        <span className="text-[10px] text-slate-400 block font-semibold">
                          رقم الحساب / رقم المحفظة المعتمد:
                        </span>
                        <span className="text-sm sm:text-base font-mono font-black text-amber-400 tracking-wider block truncate">
                          {selectedMethod.accountNumber}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyAccount}
                        className="px-3 py-2 rounded-xl bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 hover:text-white border border-orange-500/30 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer min-h-[38px]"
                      >
                        {copiedNumber ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">تم النسخ!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>نسخ الرقم</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Account Name */}
                    {selectedMethod.accountName && (
                      <div className="flex items-center justify-between text-xs px-1">
                        <span className="text-slate-400">اسم المستلم:</span>
                        <span className="font-bold text-white">{selectedMethod.accountName}</span>
                      </div>
                    )}

                    {/* Instructions */}
                    {selectedMethod.instructions && (
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 text-[11px] text-slate-300 leading-relaxed">
                        <span className="font-bold text-slate-200 block mb-0.5">طريقة التحويل:</span>
                        {selectedMethod.instructions}
                      </div>
                    )}

                    {/* Transfer Reference Input */}
                    <div className="pt-1">
                      <label className="text-[11px] text-slate-300 block mb-1 font-bold">
                        رقم الحوالة أو إشعار العملية (اختياري / لتسريع التسليم):
                      </label>
                      <input
                        type="text"
                        value={transferReference}
                        onChange={(e) => setTransferReference(e.target.value)}
                        placeholder="مثال: رقم الحوالة 829104 أو رقم السند..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-orange-500 transition-colors min-h-[42px]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Trust Badge */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5 text-[11px] text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ضمان أمان رسمي 100%. سيتم تزويدك ببيانات الحساب فور إتمام التحويل عبر واتساب.</span>
              </div>

              {/* Submit Button */}
              <button
                id="submit-order-btn"
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 hover:from-red-500 hover:to-orange-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-red-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[50px] active:scale-[0.99]"
              >
                {loading ? (
                  <span>جاري تسجيل الطلب...</span>
                ) : (
                  <>
                    <Check className="w-5 h-5 stroke-[2.5]" />
                    <span>تأكيد الطلب والحصول على رقم الطلب ({formatPrice(account.price, currency)})</span>
                  </>
                )}
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
