import { searchIndex } from './searchIndex.js'

const RESULT_LIMIT = 16

function scoreRecord(record, query) {
  const title = `${record.title?.en || ''} ${record.title?.ar || ''}`.toLowerCase()
  const body = `${record.text?.en || ''} ${record.text?.ar || ''}`.toLowerCase()

  if (title.startsWith(query)) return 3
  if (title.includes(query)) return 2
  if (body.includes(query)) return 1
  return 0
}

export function searchAppContent(query, { limit = RESULT_LIMIT } = {}) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return []

  return searchIndex
    .map((record) => ({ record, score: scoreRecord(record, normalized) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.record)
}
