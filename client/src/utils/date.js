const isValidDate = (date) => date instanceof Date && !Number.isNaN(date.getTime())

export const parseLocalDate = (value) => {
  if (!value) return null
  if (value instanceof Date) return isValidDate(value) ? value : null

  if (typeof value === 'string') {
    const datePart = value.split('T')[0].split(' ')[0]
    const match = datePart.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (match) {
      const year = Number(match[1])
      const month = Number(match[2]) - 1
      const day = Number(match[3])
      const localDate = new Date(year, month, day)
      return isValidDate(localDate) ? localDate : null
    }
  }

  const fallback = new Date(value)
  return isValidDate(fallback) ? fallback : null
}

export const formatDateLocal = (value, locale = 'es-PE') => {
  const date = parseLocalDate(value)
  if (!date) return '-'
  return date.toLocaleDateString(locale)
}

export const toInputDate = (date = new Date()) => {
  if (!date || !(date instanceof Date)) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
