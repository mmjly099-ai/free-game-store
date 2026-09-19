import React from 'react';
import { Search, CreditCard, MessageCircle, ShieldCheck, ArrowDown, Flame } from 'lucide-react';

export const HowToBuy: React.FC = () => {
  const steps = [
    {
      step: '01',
      icon: Search,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      title: 'اختر حسابك وفحص الـ UID',
      description: 'تصفح تشكيلة حسابات Free Fire النادرة، عاين الصور والفيديو، وتأكد من الـ UID الخاص بالحساب داخل اللعبة.',
    },
    {
      step: '02',
      icon: CreditCard,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      title: 'أدخل بياناتك واختر وسيلة الدفع اليمنية',
      description: 'أدخل اسمك ورقم هاتفك واختر وسيلتك المفضلة (بنك الكريمي، محفظة جيب، محفظة ون كاش، أو حوالات شبكات الصرافة اليمنية).',
    },
    {
      step: '03',
      icon: MessageCircle,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      title: 'أرسل الطلب فوراً عبر WhatsApp',
      description: 'بضغطة زر واحدة سيتم توجيهك إلى واتساب المتجر برسالة مجهزة تتضمن رقم طلبك وتفاصيل الحساب.',
    },
    {
      step: '04',
      icon: ShieldCheck,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      title: 'استلم الحساب مع الضمان الذهبي',
      description: 'يتم تسليمك البريد الإلكتروني وكلمة المرور ورموز التحقق خلال 5 إلى 15 دقيقة مع شرح طريقة تغيير البيانات بأمان.',
    },
  ];

  return (
    <section id="how-to-buy" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-xs uppercase tracking-wider mb-3">
          <Flame className="w-3.5 h-3.5" />
          <span>خطوات سهلة وآمنة</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white">
          كيف تشتري حساب فري فاير من متجرنا؟
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          عملية شراء مبسطة وسريعة لا تتعدى بضع دقائق، مع ضمان أمان كامل وضمان عدم الاسترجاع.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="relative p-6 rounded-2xl bg-[#121722] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${item.bgColor} border ${item.borderColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <span className="font-mono text-xl font-black text-slate-700 group-hover:text-red-500/60 transition-colors">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>مشمول بالضمان 100%</span>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
