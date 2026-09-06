export const ECONOMY_REFUND_FEES_QUESTION_ID = 'cancellationsAndRefunds-flightRefund-1'

const text = (en, ar) => ({ en, ar })

const cell = (highlight, en, ar) => ({
  highlight: typeof highlight === 'string' ? text(highlight, highlight) : highlight,
  detail: en || ar ? text(en, ar) : null,
  notes: [],
})

export const economyRefundFeesTable = {
  intro: text(
    'Refund conditions depend on the Economy Class fare type you purchased and when the cancellation is made.',
    'تختلف شروط استرداد التذكرة حسب فئة السعر الاقتصادي وموعد تقديم طلب الإلغاء.'
  ),
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
      id: 'refundBefore24h',
      label: text(
        'Refund at least 24 hours before departure',
        'الإلغاء قبل موعد الإقلاع بـ 24 ساعة على الأقل'
      ),
      cells: {
        light: cell(
          'USD 100',
          'If you cancel at least 24 hours before departure, a USD 100 refund fee applies.',
          'عند إلغاء الرحلة قبل موعد الإقلاع بـ 24 ساعة على الأقل، تُطبق رسوم استرداد بقيمة 100 دولار أمريكي.'
        ),
        smart: cell(
          'USD 50',
          'If you cancel at least 24 hours before departure, a USD 50 refund fee applies.',
          'عند إلغاء الرحلة قبل موعد الإقلاع بـ 24 ساعة على الأقل، تُطبق رسوم استرداد بقيمة 50 دولاراً أمريكياً.'
        ),
        elite: cell(
          'USD 25',
          'If you cancel at least 24 hours before departure, a USD 25 refund fee applies.',
          'عند إلغاء الرحلة قبل موعد الإقلاع بـ 24 ساعة على الأقل، تُطبق رسوم استرداد بقيمة 25 دولاراً أمريكياً.'
        ),
      },
    },
    {
      id: 'refundWithin24h',
      label: text(
        'Refund within 24 hours of departure',
        'الإلغاء خلال 24 ساعة من موعد الإقلاع'
      ),
      cells: {
        light: cell(
          'USD 125',
          'If you cancel within 24 hours of departure, a USD 125 refund fee applies.',
          'عند الإلغاء خلال 24 ساعة من موعد الإقلاع، تُطبق رسوم استرداد بقيمة 125 دولاراً أمريكياً.'
        ),
        smart: cell(
          'USD 100',
          'If you cancel within 24 hours of departure, a USD 100 refund fee applies.',
          'عند الإلغاء خلال 24 ساعة من موعد الإقلاع، تُطبق رسوم استرداد بقيمة 100 دولار أمريكي.'
        ),
        elite: cell(
          'USD 100',
          'If you cancel within 24 hours of departure, a USD 100 refund fee applies.',
          'عند الإلغاء خلال 24 ساعة من موعد الإقلاع، تُطبق رسوم استرداد بقيمة 100 دولار أمريكي.'
        ),
      },
    },
    {
      id: 'noShow',
      label: text('No-show fee', 'رسوم عدم الحضور'),
      cells: {
        light: cell(
          'USD 125',
          'A USD 125 no-show fee applies if you do not travel or fail to complete the required change or cancellation within the permitted time.',
          'تُطبق رسوم عدم حضور بقيمة 125 دولاراً أمريكياً إذا لم يسافر المسافر أو لم يُجرِ التعديل أو الإلغاء المطلوب ضمن المهلة المسموح بها.'
        ),
        smart: cell(
          'USD 100',
          'A USD 100 no-show fee applies if you do not travel or fail to complete the required change or cancellation within the permitted time.',
          'تُطبق رسوم عدم حضور بقيمة 100 دولار أمريكي إذا لم يسافر المسافر أو لم يُجرِ التعديل أو الإلغاء المطلوب ضمن المهلة المسموح بها.'
        ),
        elite: cell(
          'USD 100',
          'A USD 100 no-show fee applies if you do not travel or fail to complete the required change or cancellation within the permitted time.',
          'تُطبق رسوم عدم حضور بقيمة 100 دولار أمريكي إذا لم يسافر المسافر أو لم يُجرِ التعديل أو الإلغاء المطلوب ضمن المهلة المسموح بها.'
        ),
      },
    },
    {
      id: 'changeWithin24h',
      label: text(
        'Flight change within 24 hours of departure',
        'تعديل الرحلة خلال 24 ساعة من موعد الإقلاع'
      ),
      cells: {
        light: cell(
          'USD 125',
          'For flight changes made within 24 hours of departure, a USD 125 no-show penalty applies, in addition to any applicable fare difference.',
          'عند تعديل الرحلة خلال 24 ساعة من موعد الإقلاع، تُطبق غرامة عدم حضور بقيمة 125 دولاراً أمريكياً بالإضافة إلى أي فرق في السعر، إن وجد.'
        ),
        smart: cell(
          'USD 100',
          'For flight changes made within 24 hours of departure, a USD 100 no-show penalty applies, in addition to any applicable fare difference.',
          'عند تعديل الرحلة خلال 24 ساعة من موعد الإقلاع، تُطبق غرامة عدم حضور بقيمة 100 دولار أمريكي بالإضافة إلى أي فرق في السعر، إن وجد.'
        ),
        elite: cell(
          'USD 100',
          'For flight changes made within 24 hours of departure, a USD 100 no-show penalty applies, in addition to any applicable fare difference.',
          'عند تعديل الرحلة خلال 24 ساعة من موعد الإقلاع، تُطبق غرامة عدم حضور بقيمة 100 دولار أمريكي بالإضافة إلى أي فرق في السعر، إن وجد.'
        ),
      },
    },
  ],
}

export function getEconomyRefundFeesSearchText() {
  const table = economyRefundFeesTable
  const collect = (locale) =>
    [
      table.intro[locale],
      ...table.columns.flatMap((column) => [column.className[locale], column.name[locale]]),
      ...table.rows.flatMap((row) => [
        row.label[locale],
        ...table.columns.flatMap((column) => {
          const value = row.cells[column.id]
          if (!value) return []
          return [value.highlight?.en, value.highlight?.ar, value.detail?.[locale]]
        }),
      ]),
    ]
      .filter(Boolean)
      .join(' ')

  return { en: collect('en'), ar: collect('ar') }
}
