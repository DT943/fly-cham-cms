export const FLIGHT_CHANGE_FEES_QUESTION_ID = 'modifications-flightChange-2'

const text = (en, ar) => ({ en, ar })

const cell = (highlight, en, ar) => ({
  highlight: typeof highlight === 'string' ? text(highlight, highlight) : highlight,
  detail: en || ar ? text(en, ar) : null,
  notes: [],
})

export const flightChangeFeesTable = {
  intro: text(
    'Yes. You can change your Economy Class flight, but the applicable modification fee depends on your fare type and how close the change is made to the scheduled departure time.',
    'نعم، يمكنك تعديل رحلتك على الدرجة السياحية، وتختلف رسوم التعديل حسب فئة السعر وموعد إجراء التعديل بالنسبة إلى موعد الإقلاع.'
  ),
  note: text(
    'Note: Any fare difference between your original flight and the newly selected flight will be charged in addition to the applicable modification or no-show fee.',
    'ملاحظة مهمة: في حال وجود فرق بين سعر الرحلة الأصلية وسعر الرحلة الجديدة، يتم تحصيل فرق السعر بالإضافة إلى رسوم التعديل أو غرامة عدم الحضور المطبقة.'
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
      id: 'before24h',
      label: text(
        'More than 24 hours before departure',
        'قبل موعد الإقلاع بأكثر من 24 ساعة'
      ),
      cells: {
        light: cell(
          'USD 75',
          'Changes made more than 24 hours before departure are subject to a USD 75 modification fee per passenger, plus any applicable fare difference.',
          'عند تعديل الرحلة قبل موعد الإقلاع بأكثر من 24 ساعة، تُطبق رسوم تعديل بقيمة 75 دولاراً أمريكياً لكل مسافر، بالإضافة إلى أي فرق في السعر.'
        ),
        smart: cell(
          'USD 25',
          'Changes made more than 24 hours before departure are subject to a USD 25 modification fee per passenger, plus any applicable fare difference.',
          'عند تعديل الرحلة قبل موعد الإقلاع بأكثر من 24 ساعة، تُطبق رسوم تعديل بقيمة 25 دولاراً أمريكياً لكل مسافر، بالإضافة إلى أي فرق في السعر.'
        ),
        elite: cell(
          text('Free', 'مجاني'),
          'Changes made more than 24 hours before departure are free of modification fees; however, any applicable fare difference must still be paid.',
          'يمكن تعديل الرحلة قبل موعد الإقلاع بأكثر من 24 ساعة دون رسوم تعديل، مع دفع أي فرق في السعر إن وجد.'
        ),
      },
    },
    {
      id: 'within24h',
      label: text(
        'Within 24 hours of departure',
        'خلال 24 ساعة من موعد الإقلاع'
      ),
      cells: {
        light: cell(
          'USD 125',
          'Changes made within 24 hours of departure are subject to a USD 125 no-show penalty, plus any applicable fare difference.',
          'عند تعديل الرحلة خلال 24 ساعة من موعد الإقلاع، تُطبق غرامة عدم حضور بقيمة 125 دولاراً أمريكياً، بالإضافة إلى أي فرق في السعر.'
        ),
        smart: cell(
          'USD 100',
          'Changes made within 24 hours of departure are subject to a USD 100 no-show penalty, plus any applicable fare difference.',
          'عند تعديل الرحلة خلال 24 ساعة من موعد الإقلاع، تُطبق غرامة عدم حضور بقيمة 100 دولار أمريكي، بالإضافة إلى أي فرق في السعر.'
        ),
        elite: cell(
          'USD 100',
          'Changes made within 24 hours of departure are subject to a USD 100 no-show penalty, plus any applicable fare difference.',
          'عند تعديل الرحلة خلال 24 ساعة من موعد الإقلاع، تُطبق غرامة عدم حضور بقيمة 100 دولار أمريكي، بالإضافة إلى أي فرق في السعر.'
        ),
      },
    },
  ],
}

export function getFlightChangeFeesSearchText() {
  const table = flightChangeFeesTable
  const collect = (locale) =>
    [
      table.intro[locale],
      table.note[locale],
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
