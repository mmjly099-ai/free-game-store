import React from 'react';
import { Home, Package, Flame, Clock, ShoppingCart } from 'lucide-react';
import { StoreSettings } from '../types';

interface MobileBottomNavProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenTracking: () => void;
  cartCount: number;
  onOpenCart: () => void;
  settings: StoreSettings;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeSection,
  onNavigate,
  onOpenTracking,
  cartCount,
  onOpenCart,
}) => {
  const items = [
    {
      id: 'home',
      label: 'الرئيسية',
      icon: Home,
      action: () => onNavigate('home'),
      isActive: activeSection === 'home',
    },
    {
      id: 'accounts',
      label: 'الحسابات',
      icon: Package,
      action: () => onNavigate('accounts'),
      isActive: activeSection === 'accounts',
    },
    {
      id: 'offers',
      label: 'العروض',
      icon: Flame,
      action: () => onNavigate('offers'),
      isActive: activeSection === 'offers',
      badge: 'خصم',
    },
    {
      id: 'cart',
      label: 'السلة',
      icon: ShoppingCart,
      action: onOpenCart,
      isActive: false,
      badge: cartCount > 0 ? String(cartCount) : undefined,
    },
    {
      id: 'tracking',
      label: 'تتبع الطلب',
      icon: Clock,
      action: onOpenTracking,
      isActive: false,
    },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="التنقل السريع للجوال"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0e17]/95 backdrop-blur-xl border-t border-slate-800/90 shadow-[0_-8px_25px_rgba(0,0,0,0.6)] px-2 py-1.5"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer min-w-[56px] min-h-[48px] active:scale-95 ${
                item.isActive
                  ? 'text-red-500 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.badge && (
                <span className="absolute -top-0.5 right-2.5 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full ring-2 ring-[#0a0e17] animate-pulse">
                  {item.badge}
                </span>
              )}

              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                  item.isActive
                    ? 'bg-red-500/20 text-red-500'
                    : 'bg-transparent text-current'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap font-medium">
                {item.label}
              </span>

              {item.isActive && (
                <span className="w-1 h-1 rounded-full bg-red-500 mt-0.5 shadow-sm shadow-red-500" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
