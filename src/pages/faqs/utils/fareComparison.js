export const FARE_COMPARISON_QUESTION_ID = 'booking-classesAndFareTypes-3'

export const fareComparisonTabsLabel = {
  en: 'Fare class',
  ar: 'درجة السفر',
}

const text = (en, ar) => ({ en, ar })

const cell = (highlight, en, ar, notes = []) => ({
  highlight: typeof highlight === 'string' ? text(highlight, highlight) : highlight,
  detail: en || ar ? text(en, ar) : null,
  notes: notes.map(([noteEn, noteAr]) => text(noteEn, noteAr)),
})

export const fareComparisonTables = [
  {
    id: 'economy',
    tab: text('Economy', 'الدرجة السياحية'),
    title: text(
      'Fare benefits and fees per passenger',
      'مزايا ورسوم الدرجة السياحية لكل مسافر'
    ),
    featureLabel: text('Benefits and fees', 'المزايا والرسوم'),
    columns: [
      {
        id: 'light',
        className: text('Economy', 'الدرجة السياحية'),
        name: text('FLY LIGHT', 'فلاي لايت'),
      },
      {
        id: 'smart',
        className: text('Economy', 'الدرجة السياحية'),
        name: text('FLY SMART', 'فلاي سمارت'),
      },
      {
        id: 'elite',
        className: text('Economy', 'الدرجة السياحية'),
        name: text('FLY ELITE', 'فلاي ايليت'),
      },
    ],
    rows: [
      {
        id: 'carryOn',
        label: text('Carry-on Bag', 'الأمتعة المحمولة باليد'),
        cells: {
          light: cell('7kg', 'One Carry-on Bag up to 7 kg per passenger.', 'الأمتعة المحمولة باليد قطعة واحدة 7 كلغ.'),
          smart: cell('7kg', 'One Carry-on Bag up to 7 kg per passenger.', 'الأمتعة المحمولة باليد قطعة واحدة 7 كلغ.'),
          elite: cell('7kg', 'One Carry-on Bag up to 7 kg per passenger.', 'الأمتعة المحمولة باليد قطعة واحدة 7 كلغ.'),
        },
      },
      {
        id: 'checked',
        label: text('Checked Baggage', 'الأمتعة المسجلة'),
        cells: {
          light: cell('20kg', 'Checked baggage allowance is 20 kg per passenger.', 'وزن الأمتعة المسجلة المسموح به لكل مسافر 20 كلغ.'),
          smart: cell('30kg', 'Checked baggage allowance is 30 kg per passenger.', 'وزن الأمتعة المسجلة المسموح به لكل مسافر 30 كلغ.'),
          elite: cell('30kg', 'Checked baggage allowance is 30 kg per passenger.', 'وزن الأمتعة المسجلة المسموح به لكل مسافر 30 كلغ.'),
        },
      },
      {
        id: 'seat',
        label: text('Preferred Seat', 'المقعد المفضّل'),
        cells: {
          light: cell(text('Chargeable', 'لقاء رسوم'), 'Preferred seat selection is available for a certain fee.', 'اختر مقعدك المفضّل مقابل رسوم إضافية.'),
          smart: cell(text('Discounted', 'مخفّض'), 'Preferred seat selection is 50% discounted.', 'اختر مقعدك المفضّل برسوم مخفّضة.'),
          elite: cell(text('Free', 'مجاني'), 'Enjoy a free preferred seat selection.', 'اختر مقعدك المفضّل مجاناً.'),
        },
      },
      {
        id: 'beverage',
        label: text('Beverage', 'المشروبات'),
        cells: {
          light: cell(text('Yes', 'نعم'), '', ''),
          smart: cell(text('Yes', 'نعم'), '', ''),
          elite: cell(text('Yes', 'نعم'), '', ''),
        },
      },
      {
        id: 'meal',
        label: text('Meal', 'الوجبة'),
        cells: {
          light: cell(text('Snack', 'سناك خفيف'), '', ''),
          smart: cell(text('Standard', 'قياسية'), '', ''),
          elite: cell(text('Standard', 'قياسية'), '', ''),
        },
      },
      {
        id: 'change',
        label: text('Flight Change', 'تعديل الرحلة'),
        cells: {
          light: cell(
            'USD 75',
            'Modification fee before 24 hours applies USD 75 per passenger, plus any fare difference that exists.',
            'تُفرض رسوم 75 دولاراً أمريكي لكل مسافر عند تعديل الرحلة قبل 24 ساعة من موعد المغادرة، بالإضافة إلى أي فرق في سعر التذكرة.'
          ),
          smart: cell(
            'USD 25',
            'Modification fee before 24 hours applies USD 25 per passenger, plus any fare difference that exists.',
            'تُفرض رسوم 25 دولاراً أمريكي لكل مسافر عند تعديل الرحلة قبل 24 ساعة من موعد المغادرة، بالإضافة إلى أي فرق في سعر التذكرة.'
          ),
          elite: cell(
            text('Free', 'مجاني'),
            'Free modification allowed. Any fare difference applies.',
            'استمتع بالتعديل مجاناً، مع تطبيق أي فرق في سعر التذكرة.'
          ),
        },
      },
      {
        id: 'refund',
        label: text('Refund Fee', 'رسوم الاسترداد'),
        cells: {
          light: cell(
            'USD 100',
            'Refund fee is USD 100 if you cancel your flight at least 24 hours before flight departure.',
            'تبلغ غرامة الاسترداد 100 دولار أمريكي في حال إلغاء الرحلة قبل 24 ساعة من موعد الإقلاع على الأقل.'
          ),
          smart: cell(
            'USD 50',
            'Refund fee is USD 50 if you cancel your flight at least 24 hours before flight departure.',
            'تبلغ غرامة الاسترداد 50 دولار أمريكي في حال إلغاء الرحلة قبل 24 ساعة من موعد الإقلاع على الأقل.'
          ),
          elite: cell(
            'USD 25',
            'Refund fee is USD 25 if you cancel your flight at least 24 hours before flight departure.',
            'تبلغ غرامة الاسترداد 25 دولار أمريكي في حال إلغاء الرحلة قبل 24 ساعة من موعد الإقلاع على الأقل.'
          ),
        },
      },
      {
        id: 'noShow',
        label: text('No-Show Fee', 'رسوم عدم الحضور'),
        cells: {
          light: cell(
            'USD 125',
            'A USD 125 no-show fee applies if the passenger does not travel or fails to complete the required change or cancellation within the permitted time.',
            'تُفرض رسوم قدرها 125 دولار أمريكي في حال عدم الحضور (عدم السفر)، أو في حال عدم إتمام إجراءات التعديل أو الإلغاء المطلوبة ضمن المهلة الزمنية المسموح بها.'
          ),
          smart: cell(
            'USD 100',
            'A USD 100 no-show fee applies if the passenger does not travel or fails to complete the required change or cancellation within the permitted time.',
            'تُفرض رسوم قدرها 100 دولار أمريكي في حال عدم الحضور (عدم السفر)، أو في حال عدم إتمام إجراءات التعديل أو الإلغاء المطلوبة ضمن المهلة الزمنية المسموح بها.'
          ),
          elite: cell(
            'USD 100',
            'A USD 100 no-show fee applies if the passenger does not travel or fails to complete the required change or cancellation within the permitted time.',
            'تُفرض رسوم قدرها 100 دولار أمريكي في حال عدم الحضور (عدم السفر)، أو في حال عدم إتمام إجراءات التعديل أو الإلغاء المطلوبة ضمن المهلة الزمنية المسموح بها.'
          ),
        },
      },
      {
        id: 'within24h',
        label: text(
          'Modification/Refund within 24h from Departure',
          'التعديل/الاسترداد خلال 24 ساعة من المغادرة'
        ),
        cells: {
          light: cell('USD 125', '', '', [
            [
              'Modification fee within 24 hours applies a no-show penalty of USD 125, plus any fare difference.',
              'تطبّق غرامة التعديل بقيمة 125 دولار أمريكي عند إجراء تعديل على الرحلة خلال 24 ساعة من موعد المغادرة، بالإضافة إلى أي فرق في سعر التذكرة.',
            ],
            [
              'Refund fee is USD 125 if you cancel your flight within 24 hours of departure.',
              'تبلغ رسوم الاسترداد 125 دولاراً أمريكياً في حال الإلغاء خلال 24 ساعة من موعد المغادرة.',
            ],
          ]),
          smart: cell('USD 100', '', '', [
            [
              'Modification fee within 24 hours applies a no-show penalty of USD 100, plus any fare difference.',
              'تطبّق غرامة التعديل بقيمة 100 دولار أمريكي عند إجراء تعديل على الرحلة خلال 24 ساعة من موعد المغادرة، بالإضافة إلى أي فرق في سعر التذكرة.',
            ],
            [
              'Refund fee is USD 100 if you cancel your flight within 24 hours of departure.',
              'تبلغ رسوم الاسترداد 100 دولاراً أمريكياً في حال الإلغاء خلال 24 ساعة من موعد المغادرة.',
            ],
          ]),
          elite: cell('USD 100', '', '', [
            [
              'Modification fee within 24 hours applies a no-show penalty of USD 100, plus any fare difference.',
              'تطبّق غرامة التعديل بقيمة 100 دولار أمريكي عند إجراء تعديل على الرحلة خلال 24 ساعة من موعد المغادرة، بالإضافة إلى أي فرق في سعر التذكرة.',
            ],
            [
              'Refund fee is USD 100 if you cancel your flight within 24 hours of departure.',
              'تبلغ رسوم الاسترداد 100 دولاراً أمريكياً في حال الإلغاء خلال 24 ساعة من موعد المغادرة.',
            ],
          ]),
        },
      },
    ],
  },
  {
    id: 'business',
    tab: text('Business', 'درجة رجال الأعمال'),
    title: text(
      'Business Class fare — benefits and fees per passenger',
      'فئة درجة رجال الأعمال — المزايا والرسوم لكل مسافر'
    ),
    featureLabel: text('Benefits and fees', 'المزايا والرسوم'),
    columns: [
      {
        id: 'business',
        className: text('Business Class', 'درجة رجال الأعمال'),
        name: text('BUSINESS', 'رجال الأعمال'),
      },
    ],
    rows: [
      {
        id: 'carryOn',
        label: text('Carry-on Bag', 'الأمتعة المحمولة باليد'),
        cells: {
          business: cell(
            '7kg',
            'One Carry-on Bag up to 7 kg per passenger. Must fit in the overhead bin or under the seat in front of you.',
            'الأمتعة المحمولة باليد قطعة واحدة 7 كلغ، ويجب أن تتسع في الخزانة العلوية أو تحت المقعد.'
          ),
        },
      },
      {
        id: 'checked',
        label: text('Checked Baggage', 'الأمتعة المسجلة'),
        cells: {
          business: cell(
            '40kg',
            'Checked baggage allowance is 40 kg per passenger.',
            'وزن الأمتعة المسجلة المسموح به لكل مسافر 40 كلغ.'
          ),
        },
      },
      {
        id: 'seat',
        label: text('Preferred Seat', 'المقعد المفضّل'),
        cells: {
          business: cell(text('Free', 'مجاني'), 'Enjoy a free preferred seat selection.', 'اختر مقعدك المفضّل مجاناً.'),
        },
      },
      {
        id: 'beverage',
        label: text('Beverage', 'المشروبات'),
        cells: {
          business: cell(text('Yes', 'نعم'), '', ''),
        },
      },
      {
        id: 'meal',
        label: text('Meal', 'الوجبة'),
        cells: {
          business: cell(text('Standard', 'قياسية'), '', ''),
        },
      },
      {
        id: 'change',
        label: text('Flight Change', 'تعديل الرحلة'),
        cells: {
          business: cell(
            text('Free', 'مجاني'),
            'Free modification allowed. Any fare difference applies.',
            'يمكنك التعديل مجاناً، مع تطبيق أي فرق في سعر التذكرة.'
          ),
        },
      },
      {
        id: 'refund',
        label: text('Refund Fee', 'رسوم الاسترداد'),
        cells: {
          business: cell(
            'USD 50',
            'Refund fee is USD 50 if you cancel or modify your flight at least 24 hours before departure.',
            'تبلغ رسوم الاسترداد 50 دولار أمريكي في حال إلغاء الرحلة قبل 24 ساعة على الأقل من موعد الإقلاع.'
          ),
        },
      },
      {
        id: 'noShow',
        label: text('No-show Fee', 'رسوم عدم الحضور'),
        cells: {
          business: cell(
            'USD 100',
            'A USD 100 no-show fee applies if the passenger does not travel or fails to complete the required change or cancellation within the permitted time.',
            'تُفرض رسوم قدرها 100 دولار أمريكي في حال عدم الحضور (عدم السفر)، أو في حال عدم إتمام إجراءات التعديل أو الإلغاء المطلوبة ضمن المهلة الزمنية المسموح بها.'
          ),
        },
      },
      {
        id: 'within24h',
        label: text(
          'Modification/Refund within 24h from Departure',
          'التعديل/الاسترداد خلال 24 ساعة من المغادرة'
        ),
        cells: {
          business: cell('USD 100', '', '', [
            [
              'Modification fee within 24 hours applies a no-show penalty of USD 100, plus any fare difference.',
              'تطبّق غرامة التعديل بقيمة 100 دولار أمريكي عند إجراء تعديل على الرحلة خلال 24 ساعة من موعد المغادرة، بالإضافة إلى أي فرق في سعر التذكرة.',
            ],
            [
              'Refund fee is USD 100 if you cancel your flight within 24 hours of departure.',
              'تبلغ رسوم الاسترداد 100 دولاراً أمريكياً في حال الإلغاء خلال 24 ساعة من موعد المغادرة.',
            ],
          ]),
        },
      },
    ],
  },
]

export function getFareComparisonSearchText() {
  const collect = (locale) =>
    fareComparisonTables
      .flatMap((table) => [
        table.title[locale],
        ...table.columns.flatMap((column) => [column.className[locale], column.name[locale]]),
        ...table.rows.flatMap((row) => [
          row.label[locale],
          ...table.columns.flatMap((column) => {
            const value = row.cells[column.id]
            if (!value) return []
            return [
              value.highlight?.en,
              value.highlight?.ar,
              value.detail?.[locale],
              ...value.notes.map((note) => note[locale]),
            ]
          }),
        ]),
      ])
      .filter(Boolean)
      .join(' ')

  return { en: collect('en'), ar: collect('ar') }
}
