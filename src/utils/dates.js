export const fmtDateTime = (iso) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })

export const isPast = (iso) => new Date(iso).getTime() < Date.now()

// <input type="datetime-local"> wants local time without a timezone suffix
export function toInputValue(iso) {
  const d = new Date(iso)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

export const fromInputValue = (value) => new Date(value).toISOString()

export function dueLabel(iso) {
  const diff = new Date(iso).getTime() - Date.now()
  const ms = Math.abs(diff)
  const mins = Math.max(1, Math.round(ms / 60000))
  const hours = Math.round(ms / 3600000)
  const days = Math.round(ms / 86400000)
  const span = mins < 60 ? `${mins} min` : hours < 48 ? `${hours} h` : `${days} days`
  return diff < 0 ? `Overdue by ${span}` : `Due in ${span}`
}
