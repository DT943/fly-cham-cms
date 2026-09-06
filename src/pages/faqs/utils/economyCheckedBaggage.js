export const ECONOMY_CHECKED_BAGGAGE_QUESTION_ID = 'baggage-checkedBaggage-1'

const text = (en, ar) => ({ en, ar })

const cell = (highlight, en, ar) => ({
  highlight: typeof highlight === 'string' ? text(highlight, highlight) : highlight,
  detail: en || ar ? text(en, ar) : null,
  notes: [],
})

export const economyCheckedBaggageTable = {
  intro: text(
    'The checked baggage allowance depends on your Economy Class fare type:',
    'يختلف وزن الأمتعة المسجلة المسموح به حسب فئة السعر على الدرجة السياحية:'
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
      id: 'checked',
      label: text('Checked baggage', 'الأمتعة المسجلة'),
      cells: {
        light: cell(
          '20kg',
          '20 kg of checked baggage per passenger.',
          'وزن أمتعة مسجلة يصل إلى 20 كغ لكل مسافر.'
        ),
        smart: cell(
          '30kg',
          '30 kg of checked baggage per passenger.',
          'وزن أمتعة مسجلة يصل إلى 30 كغ لكل مسافر.'
        ),
        elite: cell(
          '30kg',
          '30 kg of checked baggage per passenger.',
          'وزن أمتعة مسجلة يصل إلى 30 كغ لكل مسافر.'
        ),
      },
    },
  ],
}

export function getEconomyCheckedBaggageSearchText() {
  const table = economyCheckedBaggageTable
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
