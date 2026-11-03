import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, ShieldCheck } from 'lucide-react';

export const FAQPage = () => {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      category: 'Safety & Dual Codes',
      question: 'What is the Starting Code and Ending Code system?',
      answer:
        'SevaConnect uses a dual-OTP safety system to prevent fraud. When your booking is confirmed, you receive two 4-digit codes: (1) Starting Code: Give this to the technician upon arrival at your doorstep so they can formally begin work. (2) Ending Code: Give this strictly after the repair has been tested and completed to your satisfaction. The Ending Code releases the escrow payment to the technician.',
    },
    {
      category: 'Safety & Dual Codes',
      question: 'What if a technician asks for the Ending Code before completing the work?',
      answer:
        'Never share your Ending Code beforehand. If any technician insists on receiving the Ending Code before full completion, politely decline and call our emergency NCR support line at +91 (0129) 482-9000 immediately.',
    },
    {
      category: 'Booking & Scheduling',
      question: 'How quickly does a technician reach my home in Faridabad or Delhi NCR?',
      answer:
        'For regular bookings, technicians arrive precisely within your selected 2-hour slot window. For emergency repair slots, our average doorstep arrival time in Faridabad sectors is under 45 minutes.',
    },
    {
      category: 'Pricing & Payments',
      question: 'Are there any hidden costs or visiting charges not shown on the app?',
      answer:
        'No. Every service has a published fixed rate card. If extra replacement parts are required (such as a capacitor, copper pipe, or motor), the technician shows you the standardized part price before installation.',
    },
    {
      category: 'Warranty & Guarantees',
      question: 'What warranty is provided on repairs?',
      answer:
        'All repair jobs performed through SevaConnect are backed by our 30-Day SevaShield Service Warranty. If the same issue recurs within 30 days, we dispatch a senior supervisor to fix it with zero service fee.',
    },
    {
      category: 'For Service Partners',
      question: 'How do service professionals get paid on SevaConnect?',
      answer:
        'Earnings are deposited directly to your registered bank account every Tuesday morning. There is zero commission on your first 10 bookings as an introductory onboarding partner.',
    },
  ];

  return (
    <div className="py-12 bg-surface-muted min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
            Clear Answers
          </span>
          <h1 className="text-3xl font-extrabold text-content-dark tracking-tight mt-1">
            Frequently Asked Questions
          </h1>
          <p className="mt-2 text-sm text-content-secondary">
            Everything you need to know about our doorstep services, dual OTP protection, and partner policies.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIdx === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-surface-border shadow-subtle overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : index)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 text-xs font-bold">
                      ?
                    </span>
                    <span className="text-sm font-semibold text-content-dark">
                      {faq.question}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-content-muted shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-content-muted shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-content-secondary leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    <p>{faq.answer}</p>
                    <span className="inline-block mt-3 text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                      Category: {faq.category}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
