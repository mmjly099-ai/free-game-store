import React, { useState } from 'react';
import {
  X,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  ShieldCheck,
  MessageCircle,
  Package
} from 'lucide-react';
import { Order, StoreSettings } from '../types';
import { api, formatPrice } from '../lib/api';

interface OrderTrackingModalProps {
  settings: StoreSettings;
  currency: string;
  onClose: () => void;
}

const STATUS_STEPS = [
  { key: 'new', label: 'تم إنشاء الطلب' },
  { key: 'reviewing', label: 'قيد المراجعة' },
  { key: 'paid', label: 'تم تأكيد الدفع' },
  { key: 'delivered', label: 'تم تسليم الحساب' },
  { key: 'completed', label: 'مكتمل بنجاح' },
];

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  settings,
  currency,
  onClose,
}) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ order: Order; account: any } | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!orderNumber.trim() || !phone.trim()) {
      setError('يرجى إدخال رقم الطلب ورقم الهاتف المسجل في الطلب');
      return;
    }

    try {
      setLoading(true);
      const data = await api.trackOrder(orderNumber.trim(), phone.trim());
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'لم يتم العثور على طلب مطابق للبيانات المدخلة');
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: Order['status']) => {
    if (status === 'cancelled') return -1;
    const idx = STATUS_STEPS.findIndex((s) => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  const currentStep = result ? getStepIndex(result.order.status) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        id="order-tracking-modal"
        className="relative w-full max-w-xl bg-[#111622] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0d111a]">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-400" />
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">تتبع حالة طلبك</h3>
              <p className="text-[11px] text-slate-400">تابع مراحل مراجعة وتسليم حسابك مباشرة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-5">
          {/* Tracking Form */}
          <form onSubmit={handleTrack} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">رقم الطلب (مثال: FF-98214):</label>
                <input
                  type="text"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="FF-XXXXX"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">رقم هاتف المشتري:</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05XXXXXXXX"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'جاري البحث...' : 'تتبع الطلب الآن'}</span>
            </button>
          </form>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Tracking Result */}
          {result && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4 animate-fadeIn">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[11px] text-slate-400 block">رقم الطلب:</span>
                  <span className="font-mono text-sm font-black text-amber-400">{result.order.orderNumber}</span>
                </div>
                <div className="text-left">
                  <span className="text-[11px] text-slate-400 block">التاريخ:</span>
                  <span className="text-xs text-slate-300">
                    {new Date(result.order.createdAt).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </div>

              {/* Status Progress Bar */}
              {result.order.status === 'cancelled' ? (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-center font-bold text-xs">
                  تم إلغاء هذا الطلب
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-xs text-slate-400 block mb-2">حالة التقدم:</span>
                  <div className="grid grid-cols-5 gap-1 text-center">
                    {STATUS_STEPS.map((step, idx) => (
                      <div key={step.key} className="flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-all ${
                            idx <= currentStep
                              ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                              : 'bg-slate-800 text-slate-500 border border-slate-700'
                          }`}
                        >
                          {idx < currentStep ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span
                          className={`text-[9px] sm:text-[10px] leading-tight ${
                            idx <= currentStep ? 'text-white font-bold' : 'text-slate-500'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Account details */}
              <div className="bg-[#121724] p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                {result.account?.image && (
                  <img
                    src={result.account.image}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0"
                  />
                )}
                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{result.order.accountTitle}</h4>
                  <span className="text-[11px] text-slate-400 font-mono">UID: {result.order.accountUid}</span>
                </div>
                <div className="mr-auto text-left">
                  <span className="text-xs font-extrabold text-amber-400">
                    {formatPrice(result.order.price, currency)}
                  </span>
                </div>
              </div>

              {/* Delivery Info if available */}
              {result.order.deliveryInfo && (
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-slate-200 space-y-1">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>بيانات وتعليمات التسليم:</span>
                  </span>
                  <p className="whitespace-pre-line text-[11px] text-slate-300">{result.order.deliveryInfo}</p>
                </div>
              )}

              {/* Direct Support Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    const cleanNum = settings.whatsappNumber.replace(/\D/g, '');
                    window.open(
                      `https://wa.me/${cleanNum}?text=${encodeURIComponent(
                        `مرحباً، أود الاستفسار عن طلبي رقم ${result.order.orderNumber}`
                      )}`,
                      '_blank'
                    );
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>تواصل مع الدعم عبر واتساب للطلب #{result.order.orderNumber}</span>
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
