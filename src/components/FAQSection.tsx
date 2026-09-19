import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Flame } from 'lucide-react';
import { FAQItem } from '../types';

interface FAQSectionProps {
  faqs: FAQItem[];
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-14 sm:py-20 bg-[#0e121b] border-y border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-xs uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>إجابات واضحة ومباشرة</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            الأسئلة الشائعة حول شراء الحسابات
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            كل ما تحتاج لمعرفته حول التسليم، الأمان، وطرق الدفع
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-[#121722] border border-slate-800 overflow-hidden transition-all shadow-md"
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full text-right p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-red-400 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-red-500' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
