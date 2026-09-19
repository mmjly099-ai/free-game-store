import React from 'react';
import { Flame, ShieldCheck, Zap, Award, ArrowLeft, Sparkles } from 'lucide-react';
import { StoreSettings } from '../types';

interface HeroSectionProps {
  settings: StoreSettings;
  onBrowseAccounts: () => void;
  onViewOffers: () => void;
  totalAvailable: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  onBrowseAccounts,
  onViewOffers,
  totalAvailable,
}) => {
  return (
    <div className="relative overflow-hidden bg-[#0b0e14] py-14 sm:py-20 lg:py-24 border-b border-slate-800/80">
      {/* Background Graphic & Glow */}
      <div
        className="absolute inset-0 z-0 opacity-25 mix-blend-luminosity bg-cover bg-center filter blur-[1px]"
        style={{ backgroundImage: `url(${settings.heroBannerUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-[#0b0e14]/85 to-transparent z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm font-semibold mb-6 shadow-inner animate-pulse">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>المتجر الأقوى والأضمن لحسابات Free Fire الموثقة</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6">
          {settings.heroTitle || 'أقوى حسابات Free Fire النادرة بأسعار أسطورية'}
        </h1>

        {/* Hero Subtitle */}
        <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          {settings.heroSubtitle ||
            'تسليم فوري ومباشر بعد الدفع عبر واتساب، حسابات موثقة ومفحوصة بالكامل مع ضمان عدم الاسترجاع مدى الحياة.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-14">
          <button
            id="hero-browse-accounts-btn"
            onClick={onBrowseAccounts}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-base shadow-xl shadow-red-600/25 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Flame className="w-5 h-5 text-yellow-300" />
            <span>تصفح الحسابات المتاحة ({totalAvailable})</span>
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            id="hero-view-offers-btn"
            onClick={onViewOffers}
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white font-bold text-base border border-slate-700/80 shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Zap className="w-5 h-5 text-amber-400" />
            <span>شاهد أقوى العروض</span>
          </button>
        </div>

        {/* Trust Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="bg-[#131924]/80 backdrop-blur-sm border border-slate-800 rounded-xl p-3.5 text-right flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">تسليم فوري</h4>
              <p className="text-[11px] text-slate-400">خلال 5 إلى 15 دقيقة</p>
            </div>
          </div>

          <div className="bg-[#131924]/80 backdrop-blur-sm border border-slate-800 rounded-xl p-3.5 text-right flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">ضمان ذهبي 100%</h4>
              <p className="text-[11px] text-slate-400">حماية ضد السحب والاسترجاع</p>
            </div>
          </div>

          <div className="bg-[#131924]/80 backdrop-blur-sm border border-slate-800 rounded-xl p-3.5 text-right flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">حسابات نادرة VIP</h4>
              <p className="text-[11px] text-slate-400">ساكورا، هيب هوب وكريمينال</p>
            </div>
          </div>

          <div className="bg-[#131924]/80 backdrop-blur-sm border border-slate-800 rounded-xl p-3.5 text-right flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">دعم متواصل 24/7</h4>
              <p className="text-[11px] text-slate-400">متابعة فورية على واتساب</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
