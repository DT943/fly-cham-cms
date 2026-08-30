export const searchSuggestions = [
  { id: 'baggage-allowance', en: 'Baggage allowance', ar: 'بدل الأمتعة', keywords: ['baggage'] },
  { id: 'baggage-calculator', en: 'Baggage Calculator', ar: 'حاسبة الأمتعة', keywords: ['baggage'] },
  { id: 'baggage-tracking', en: 'Baggage Tracking', ar: 'تتبع الأمتعة', keywords: ['baggage'] },
  { id: 'baggage-fees', en: 'Baggage Fees', ar: 'رسوم الأمتعة', keywords: ['baggage'] },
  { id: 'carry-on-restrictions', en: 'Carry-On Restrictions', ar: 'قيود الأمتعة اليدوية', keywords: ['baggage', 'carry'] },
  { id: 'lost-baggage', en: 'Lost Baggage Procedures', ar: 'إجراءات الأمتعة المفقودة', keywords: ['baggage'] },
  { id: 'excess-baggage', en: 'Excess Baggage', ar: 'الأمتعة الزائدة', keywords: ['baggage'] },
  { id: 'baggage-queries', en: 'Baggage queries', ar: 'استفسارات الأمتعة', keywords: ['baggage'] },
  { id: 'travel-with-children', en: 'Travel with children', ar: 'السفر مع الأطفال', keywords: ['children', 'family'] },
  { id: 'seat-selection', en: 'Seat selection', ar: 'اختيار المقعد', keywords: ['seat'] },
  { id: 'ya-marhaba', en: 'Ya Marhaba service', ar: 'خدمة يا مرحبا', keywords: ['assistance', 'service'] },
  { id: 'vip-boarding', en: 'VIP Boarding', ar: 'صعود كبار الشخصيات', keywords: ['boarding', 'vip'] },
  { id: 'special-services', en: 'Special Services', ar: 'خدمات خاصة', keywords: ['assistance', 'special'] },
  { id: 'business-lounge', en: 'Business Lounge', ar: 'صالة رجال الأعمال', keywords: ['lounge'] },
  { id: 'meal-service', en: 'Meal service', ar: 'خدمة الوجبات', keywords: ['meal', 'food'] },
  { id: 'birthday-cake', en: 'Birthday cake', ar: 'كيكة عيد الميلاد', keywords: ['cake', 'birthday'] },
  { id: 'wifi', en: 'WiFi onboard', ar: 'واي فاي على متن الطائرة', keywords: ['wifi', 'internet'] },
  { id: 'entertainment', en: 'In-flight entertainment', ar: 'الترفيه على متن الطائرة', keywords: ['entertainment'] },
  { id: 'refunds', en: 'Refunds & compensation', ar: 'الاسترداد والتعويض', keywords: ['refund', 'compensation'] },
  { id: 'lost-and-found', en: 'Lost and found', ar: 'المفقودات', keywords: ['lost'] },
  { id: 'feedback', en: 'Feedback & complaints', ar: 'الملاحظات والشكاوى', keywords: ['feedback', 'complaint'] },
  { id: 'change-booking', en: 'Change booking', ar: 'تغيير الحجز', keywords: ['booking', 'change'] },
  { id: 'cancel-flight', en: 'Cancel a flight', ar: 'إلغاء رحلة', keywords: ['cancel', 'booking'] },
  { id: 'online-check-in', en: 'Online check-in', ar: 'تسجيل الوصول عبر الإنترنت', keywords: ['check-in'] },
  { id: 'boarding-pass', en: 'Boarding pass', ar: 'بطاقة الصعود', keywords: ['boarding'] },
  { id: 'payment-methods', en: 'Payment methods', ar: 'طرق الدفع', keywords: ['payment'] },
  { id: 'travel-documents', en: 'Travel documents', ar: 'وثائق السفر', keywords: ['passport', 'documents'] },
  { id: 'visa-requirements', en: 'Visa requirements', ar: 'متطلبات التأشيرة', keywords: ['visa'] },
  { id: 'pets', en: 'Traveling with pets', ar: 'السفر مع الحيوانات الأليفة', keywords: ['pet'] },
  { id: 'wheelchair', en: 'Wheelchair assistance', ar: 'مساعدة الكرسي المتحرك', keywords: ['wheelchair', 'assistance'] },
  { id: 'delayed-flight', en: 'Delayed or cancelled flight', ar: 'رحلة متأخرة أو ملغاة', keywords: ['delay', 'cancel'] },
  { id: 'contact-us', en: 'Contact us', ar: 'تواصل معنا', keywords: ['contact'] },
  { id: 'faqs', en: 'Frequently asked questions', ar: 'الأسئلة الشائعة', keywords: ['faq'] },
  { id: 'sales-offices', en: 'Sales Offices and GSA', ar: 'مكاتب المبيعات والوكلاء', keywords: ['office'] },
  { id: 'forms', en: 'Forms and requests', ar: 'النماذج والطلبات', keywords: ['form'] },
  { id: 'track-request', en: 'Track your request', ar: 'تتبع طلبك', keywords: ['track'] },
]

export function filterSearchSuggestions(suggestions, query) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return []

  return suggestions.filter((item) =>
    [item.en, item.ar, ...(item.keywords || [])].some((value) =>
      value.toLowerCase().includes(normalized)
    )
  )
}
