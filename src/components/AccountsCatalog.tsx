import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Flame,
  ArrowUpDown,
  Check,
  RefreshCw,
  X
} from 'lucide-react';
import { AccountProduct, AccountStatus } from '../types';
import { AccountCard } from './AccountCard';

interface AccountsCatalogProps {
  accounts: AccountProduct[];
  currency: string;
  onViewDetails: (account: AccountProduct) => void;
  onBuyNow: (account: AccountProduct) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
}

const SERVERS = ['الكل', 'الشرق الأوسط (MEA)', 'أوروبا (EU)', 'أمريكا الشمالية (NA)', 'سنغافورة (SG)'];
const LEVEL_RANGES = [
  { label: 'الكل', min: 0 },
  { label: 'لفل 50+', min: 50 },
  { label: 'لفل 65+', min: 65 },
  { label: 'لفل 75+ (نادر)', min: 75 },
  { label: 'لفل 80+ (أسطوري)', min: 80 },
];
const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: 'جميع الحالات', value: 'all' },
  { label: 'متاح للبيع فقط', value: 'available' },
  { label: 'محجوز', value: 'reserved' },
  { label: 'تم البيع', value: 'sold' },
];

export const AccountsCatalog: React.FC<AccountsCatalogProps> = ({
  accounts,
  currency,
  onViewDetails,
  onBuyNow,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}) => {
  const [selectedServer, setSelectedServer] = useState('الكل');
  const [selectedLevelMin, setSelectedLevelMin] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(3000);

  // Categories list
  const categories = ['الكل', 'حسابات فاخرة VIP', 'حسابات تنافسية', 'حسابات اقتصادية', 'سيرفرات خارجية'];

  // Filtered and sorted accounts
  const filteredAccounts = useMemo(() => {
    return accounts
      .filter((acc) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = acc.title.toLowerCase().includes(q);
          const matchUid = acc.uid.includes(q);
          const matchId = acc.id.toLowerCase().includes(q);
          const matchDesc = acc.description.toLowerCase().includes(q);
          const matchFeatures = acc.features.some((f) => f.toLowerCase().includes(q));
          const matchRare = acc.rareItems?.some((r) => r.toLowerCase().includes(q));
          if (!matchTitle && !matchUid && !matchId && !matchDesc && !matchFeatures && !matchRare) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'الكل' && acc.category !== selectedCategory) {
          return false;
        }

        // Server filter
        if (selectedServer !== 'الكل' && !acc.server.includes(selectedServer.split(' ')[0])) {
          return false;
        }

        // Status filter
        if (selectedStatus !== 'all' && acc.status !== selectedStatus) {
          return false;
        }

        // Level filter
        if (acc.level < selectedLevelMin) {
          return false;
        }

        // Price filter
        if (acc.price > maxPriceFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating-desc') return b.rating - a.rating;
        if (sortBy === 'level-desc') return b.level - a.level;
        // Default: newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [
    accounts,
    searchQuery,
    selectedCategory,
    selectedServer,
    selectedStatus,
    selectedLevelMin,
    maxPriceFilter,
    sortBy,
  ]);

  const resetFilters = () => {
    onSearchChange('');
    onCategoryChange('الكل');
    setSelectedServer('الكل');
    setSelectedLevelMin(0);
    setSelectedStatus('all');
    setMaxPriceFilter(3000);
    setSortBy('newest');
  };

  return (
    <section id="accounts" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4" />
            <span>متجر الحسابات الرسمية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            تصفح جميع حسابات Free Fire
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            ابحث بالاسم أو الـ UID أو فلتر حسب السعر واللفل والسيرفر
          </p>
        </div>

        {/* Results Counter & Reset */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            تم العثور على <span className="font-bold text-white">{filteredAccounts.length}</span> حساب
          </span>

          <button
            onClick={resetFilters}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            title="إعادة تعيين الفلاتر"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>إعادة ضبط</span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md shadow-red-600/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search & Main Filter Controls */}
      <div className="bg-[#121722] border border-slate-800/90 rounded-2xl p-4 mb-8 space-y-4 shadow-lg">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Quick Instant Search Input (6 cols) */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-red-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="accounts-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث باسم الحساب، الـ UID، السكنات النادرة (ساكورا، كريمينال، MP40)..."
              className="w-full pr-10 pl-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-red-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector (3 cols) */}
          <div className="md:col-span-3 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-red-500"
            >
              <option value="newest">الترتيب: الأحدث إضافة</option>
              <option value="price-asc">السعر: من الأقل للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأقل</option>
              <option value="rating-desc">الأعلى تقييماً</option>
              <option value="level-desc">مستوى الحساب (اللفل الأكبر)</option>
            </select>
          </div>

          {/* Mobile Filter Toggle / Quick Status (3 cols) */}
          <div className="md:col-span-3 flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-red-500"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="md:hidden p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 shrink-0"
              title="تصفية إضافية"
            >
              <SlidersHorizontal className="w-4 h-4 text-orange-400" />
            </button>
          </div>

        </div>

        {/* Detailed Filters (Collapsible on Mobile, Expanded on Desktop) */}
        <div className={`${showFiltersMobile ? 'block' : 'hidden md:block'} pt-3 border-t border-slate-800/80`}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            
            {/* Server Filter */}
            <div>
              <label className="text-[11px] text-slate-400 block mb-1.5 font-semibold">السيرفر / المنطقة:</label>
              <div className="flex flex-wrap gap-1.5">
                {SERVERS.map((srv) => (
                  <button
                    key={srv}
                    onClick={() => setSelectedServer(srv)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                      selectedServer === srv
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {srv}
                  </button>
                ))}
              </div>
            </div>

            {/* Level Range Filter */}
            <div>
              <label className="text-[11px] text-slate-400 block mb-1.5 font-semibold">مستوى الحساب (Level):</label>
              <div className="flex flex-wrap gap-1.5">
                {LEVEL_RANGES.map((lvl) => (
                  <button
                    key={lvl.min}
                    onClick={() => setSelectedLevelMin(lvl.min)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                      selectedLevelMin === lvl.min
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] text-slate-400 font-semibold">الحد الأقصى للسعر:</label>
                <span className="font-bold text-white text-xs">{maxPriceFilter} {currency}</span>
              </div>
              <input
                type="range"
                min="100"
                max="3000"
                step="50"
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                className="w-full accent-red-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>100</span>
                <span>1,500</span>
                <span>3,000+</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Accounts Grid */}
      {filteredAccounts.length === 0 ? (
        <div className="text-center py-16 bg-[#121722]/50 rounded-2xl border border-slate-800/80 p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">لا توجد حسابات تطابق معايير البحث الحالية</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            جرب تغيير كلمات البحث، أو خفض الفلاتر، أو إعادة ضبط الفلاتر لعرض جميع حسابات المتجر المتاحة.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all"
          >
            عرض كافة الحسابات
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredAccounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              currency={currency}
              onViewDetails={onViewDetails}
              onBuyNow={onBuyNow}
            />
          ))}
        </div>
      )}

    </section>
  );
};
