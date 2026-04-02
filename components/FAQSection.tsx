import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const FAQS = [
    {
        question: "How do I plan a tour with YatriVi?",
        answer: "Planning is simple! Browse our packages, select your preferred destination and dates, and click 'Send Inquiry'. You can also request a callback from our travel experts for a customized itinerary."
    },
    {
        question: "Are there any hidden charges?",
        answer: "No, we believe in complete transparency. The price you see includes all the inclusions mentioned in the package. Any exclusions (like personal expenses) are clearly stated."
    },
    {
        question: "Can I customize my specialized tour package?",
        answer: "Absolutely! We specialize in tailor-made holidays. Connect with our experts, share your preferences, and we will craft a personalized itinerary just for you."
    },
    {
        question: "What is the cancellation policy?",
        answer: "Our cancellation policies vary depending on the package. Generally, cancellations made 30 days prior receive a specific refund. Please check individual package details for exact terms."
    },
    {
        question: "Do you provide visa assistance?",
        answer: "Yes, our team provides complete assistance with visa applications, documentation, and submissions for all international destinations included in our packages."
    }
];

interface FAQSectionProps {
    faqData?: any[];
    hideHeader?: boolean;
    className?: string;
    noContainer?: boolean;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ 
    faqData, 
    hideHeader = false, 
    className = '',
    noContainer = false 
}) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    // Use provided data or fallback
    const displayFaqs = (faqData && faqData.length > 0) ? faqData : FAQS;

    return (
        <section className={`${!noContainer ? 'pt-6 md:pt-10 bg-white' : ''} ${className || ''}`}>
            <div className={noContainer ? '' : 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'}>
                {!hideHeader && (
                    <div className="border-l-4 border-brand pl-4 mb-6 font-sans">
                        <p className="text-[10px] font-bold text-brand tracking-wider mb-1.5">Common queries</p>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Frequently Asked Questions</h2>
                    </div>
                )}

                <div className="space-y-3">
                    {displayFaqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-5 text-left focus:outline-none group/faq"
                            >
                                <span className={`font-bold text-[13.5px] md:text-[14.5px] tracking-tight transition-colors ${openIndex === index ? 'text-brand' : 'text-gray-800 group-hover/faq:text-brand'}`}>
                                    {faq.question}
                                </span>
                                <div className={`p-1.5 rounded-lg transition-all duration-300 ${openIndex === index ? 'bg-brand text-white shadow-md' : 'bg-gray-50 text-gray-400 group-hover/faq:bg-brand/10 group-hover/faq:text-brand'}`}>
                                    {openIndex === index ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                                </div>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="px-5 pb-5 pt-0 text-[13px] md:text-sm font-medium text-gray-600 leading-[1.85] border-t border-gray-50/50 mt-1 pt-4">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
