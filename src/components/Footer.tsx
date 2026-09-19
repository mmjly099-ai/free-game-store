import React, { useState } from 'react';
import {
  Flame,
  MessageCircle,
  Send,
  Instagram,
  ShieldCheck,
  FileText,
  Lock,
  RotateCcw,
  X
} from 'lucide-react';
import { StoreSettings } from '../types';

interface FooterProps {
  settings: StoreSettings;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate, onOpenAdmin }) => {
  const [activePolicy, setActivePolicy] = useState<'terms' | 'refund' | 'privacy' | null>(null);

  const cleanWhatsApp = settings.whatsappNumber.replace(/\D/g, '');

  return (
    <>
      <footer id="contact" className="bg-[#090c12] border-t border-slate-800 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            
            {/* Column 1: Brand & Bio */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 p-0.5 shadow-md shadow-red-500/20">
                  <div className="w-full h-full bg-[#090c12] rounded-[10px] flex items-center justify-center">
                    <Flame className="w-5 h-5 text-red-500" />
                  </div>
                </div>
                <span dir="ltr" className="font-extrabold text-lg tracking-tight text-white font-['Chakra_Petch',sans-serif]">
                  <span>FREE </span>
                  <span className="text-red-500">GAME</span>
                </span>
              </div>

              <p className="text-slate-400 text-xs leading-relaxed">
                {settings.storeSubtitle ||
                  'المتجر الأول المتخصص في بيع وشراء حسابات لعبة Free Fire النادرة والمميزة مع تسليم فوري وضمان أمان كامل 100%.'}
              </p>

              <div className="flex items-center gap-2 pt-1">
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${cleanWhatsApp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>

                {/* Telegram */}
                {settings.telegramUrl && (
                  <a
                    href={settings.telegramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-sky-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                    title="Telegram"
                  >
                    <Send className="w-4 h-4" />
                  </a>
                )}

                {/* Instagram */}
                {settings.instagramUrl && (
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-pink-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4">روابط سريعة</h4>
              <ul className="space-y-2.5">
                <li>
                  <button onClick={() => onNavigate('home')} className="hover:text-red-400 transition-colors">
                    الرئيسية
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('accounts')} className="hover:text-red-400 transition-colors">
                    تصفح جميع الحسابات
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('offers')} className="hover:text-red-400 transition-colors">
                    العروض والتخفيضات
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('how-to-buy')} className="hover:text-red-400 transition-colors">
                    طريقة الشراء والاستلام
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('faq')} className="hover:text-red-400 transition-colors">
                    الأسئلة الشائعة
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Policies & Guarantees */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4">الأمان والسياسات</h4>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={() => setActivePolicy('terms')}
                    className="hover:text-red-400 transition-colors flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>شروط البيع والاستخدام</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActivePolicy('refund')}
                    className="hover:text-red-400 transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>سياسة الاسترجاع والضمان</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActivePolicy('privacy')}
                    className="hover:text-red-400 transition-colors flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>سياسة الخصوصية وحماية البيانات</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={onOpenAdmin}
                    className="hover:text-orange-400 text-slate-400 transition-colors flex items-center gap-1.5 pt-2"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
                    <span>بوابة إدارة المتجر (Admin)</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Direct Support */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4">الدعم الفني المباشر</h4>
              <p className="text-xs text-slate-400 mb-3">
                فريق الدعم الفني جاهز لمساعدتك في أي استفسار أو إتمام طلبك على مدار الساعة:
              </p>
              <a
                href={`https://wa.me/${cleanWhatsApp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 font-bold text-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>واتساب: {settings.whatsappNumber}</span>
              </a>
              <div className="mt-3 text-[11px] text-slate-500">
                البريد: {settings.supportEmail || 'support@ff-firestore.com'}
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} {settings.storeName}. جميع الحقوق محفوظة لمتجر فري فاير الرسمي.</p>
            <div className="flex items-center gap-4">
              <span>تسليم فوري ومباشر</span>
              <span>•</span>
              <span>ضمان عدم الاسترجاع مدى الحياة</span>
              <span>•</span>
              <span>طرق دفع يمنية معتمدة (الكريمي، جيب، ون كاش، شبكات الصرافة)</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Policy Modal Viewer */}
      {activePolicy && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#111622] border border-slate-700 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-base text-white">
                {activePolicy === 'terms' && 'شروط البيع والاستخدام'}
                {activePolicy === 'refund' && 'سياسة الاسترجاع والضمان'}
                {activePolicy === 'privacy' && 'سياسة الخصوصية والأمان'}
              </h3>
              <button
                onClick={() => setActivePolicy(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed max-h-96 overflow-y-auto whitespace-pre-line space-y-3">
              {activePolicy === 'terms' && (settings.termsOfSale || 'شروط البيع الافتراضية')}
              {activePolicy === 'refund' && (settings.refundPolicy || 'سياسة الاسترجاع الافتراضية')}
              {activePolicy === 'privacy' && (settings.privacyPolicy || 'سياسة الخصوصية الافتراضية')}
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 text-left">
              <button
                onClick={() => setActivePolicy(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
