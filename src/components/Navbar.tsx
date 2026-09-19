import React, { useState } from 'react';
import {
  Flame,
  Search,
  Menu,
  X,
  Clock,
  MessageCircle,
  HelpCircle,
  Package,
  Layers,
  ChevronDown
} from 'lucide-react';
import { StoreSettings } from '../types';
import { CURRENCY_RATES } from '../lib/api';

interface NavbarProps {
  settings: StoreSettings;
  currency: string;
  onCurrencyChange: (c: string) => void;
  onOpenSearch: () => void;
  onOpenTracking: () => void;
  onOpenAdmin?: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  cartCount?: number;
  onOpenCart?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  currency,
  onCurrencyChange,
  onOpenSearch,
  onOpenTracking,
  onNavigate,
  activeSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'accounts', label: 'الحسابات' },
    { id: 'offers', label: 'العروض' },
    { id: 'how-to-buy', label: 'كيف تشتري؟' },
    { id: 'faq', label: 'الأسئلة الشائعة' },
    { id: 'contact', label: 'تواصل معنا' },
  ];

  return (
    <>
      {/* Announcement Bar */}
      {settings.announcementEnabled && settings.announcementText && (
        <div className="bg-gradient-to-r from-red-600 via-orange-600 to-red-700 text-white text-xs sm:text-sm font-semibold py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-md">
          <Flame className="w-4 h-4 text-yellow-300 animate-pulse shrink-0" />
          <span>{settings.announcementText}</span>
        </div>
      )}

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#0c1017]/90 backdrop-blur-md border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div
            id="brand-logo"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 via-orange-500 to-amber-600 p-0.5 shadow-lg shadow-red-500/20 group-hover:shadow-red-500/40 transition-all">
              <div className="w-full h-full bg-[#0b0e14] rounded-[10px] flex items-center justify-center">
                <Flame className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span dir="ltr" className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5 font-['Chakra_Petch',sans-serif]">
                <span>FREE</span>
                <span className="text-red-500">GAME</span>
              </span>
              <p className="text-[11px] text-slate-400 font-medium -mt-1 hidden sm:block">
                متجر فري فاير المعتمد
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map(item => (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === item.id
                    ? 'text-white bg-red-500/15 border border-red-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Action Tools (Search, Currency, Tracking) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Search Button */}
            <button
              id="header-search-btn"
              onClick={onOpenSearch}
              title="بحث عن حساب أو UID"
              className="p-2 sm:px-3 sm:py-2 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 flex items-center gap-2 text-xs sm:text-sm font-medium transition-all"
            >
              <Search className="w-4 h-4 text-red-400" />
              <span className="hidden md:inline">بحث بالحساب أو UID...</span>
            </button>

            {/* Currency Selector */}
            <div className="relative">
              <button
                id="currency-selector-btn"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="px-2.5 py-2 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 flex items-center gap-1 text-xs font-semibold"
              >
                <span>{CURRENCY_RATES[currency]?.symbol || currency}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {currencyDropdownOpen && (
                <div className="absolute left-0 mt-2 w-36 bg-[#161c29] border border-slate-700 rounded-xl shadow-2xl py-1 z-50">
                  {Object.entries(CURRENCY_RATES).map(([code, info]) => (
                    <button
                      key={code}
                      onClick={() => {
                        onCurrencyChange(code);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-right px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 ${
                        currency === code ? 'text-red-400 font-bold bg-slate-800/50' : 'text-slate-300'
                      }`}
                    >
                      <span>{info.label}</span>
                      <span className="font-mono text-slate-400">{info.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Track Order Button */}
            <button
              id="header-track-order-btn"
              onClick={onOpenTracking}
              title="تتبع حالة طلبك"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition-all"
            >
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              <span>تتبع الطلب</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800/70 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0e131d] border-b border-slate-800 px-4 py-4 space-y-2 animate-fadeIn">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-right px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeSection === item.id
                    ? 'text-white bg-red-500/20 border border-red-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenTracking();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-slate-800 text-slate-200 text-sm font-medium flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4 text-orange-400" />
                <span>تتبع حالة الطلب</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
