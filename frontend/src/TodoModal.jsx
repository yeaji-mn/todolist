import { useState } from 'react'
import { toDateParam } from './dateUtils'

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

function isoDay(date) {
  // JS getDay(): 0=Sun..6=Sat → ISO: 1=Mon..7=Sun
  return date.getDay() === 0 ? 7 : date.getDay()
}

export default function TodoModal({ heading, initialValues, selectedDate, submitLabel, saving, onSubmit, onClose, onDeleteSeries }) {
  const isRecurringInit = initialValues?.recurrenceType != null

  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [isRecurring, setIsRecurring] = useState(isRecurringInit)
  const [recurrenceType, setRecurrenceType] = useState(initialValues?.recurrenceType ?? 'WEEKLY')
  const [dayOfWeek, setDayOfWeek] = useState(initialValues?.dayOfWeek ?? isoDay(selectedDate))
  const [dayOfMonth, setDayOfMonth] = useState(initialValues?.dayOfMonth ?? selectedDate.getDate())
  const [monthOfYear, setMonthOfYear] = useState(initialValues?.monthOfYear ?? selectedDate.getMonth() + 1)

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    const data = {
      title: title.trim(),
      dueDate: initialValues?.dueDate ?? toDateParam(selectedDate),
    }
    if (isRecurring) {
      data.recurrenceType = recurrenceType
      data.dayOfWeek = recurrenceType === 'WEEKLY' ? dayOfWeek : null
      data.dayOfMonth = recurrenceType !== 'WEEKLY' ? dayOfMonth : null
      data.monthOfYear = recurrenceType === 'YEARLY' ? monthOfYear : null
    }
    onSubmit(data)
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{heading}</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="modal-input"
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
          />

          <div className="recurrence-row">
            <label className="recurrence-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={e => setIsRecurring(e.target.checked)}
              />
              Recurring
            </label>
          </div>

          {isRecurring && (
            <>
              <div className="recurrence-row">
                <span className="recurrence-label">Repeat</span>
                <div className="recurrence-types">
                  {['WEEKLY', 'MONTHLY', 'YEARLY'].map(type => (
                    <button
                      key={type}
                      type="button"
                      className={`recurrence-type-btn${recurrenceType === type ? ' active' : ''}`}
                      onClick={() => setRecurrenceType(type)}
                    >
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {recurrenceType === 'WEEKLY' && (
                <div className="recurrence-row">
                  <span className="recurrence-label">Day</span>
                  <select
                    className="recurrence-select"
                    value={dayOfWeek}
                    onChange={e => setDayOfWeek(Number(e.target.value))}
                  >
                    {DAYS_OF_WEEK.map((d, i) => (
                      <option key={d} value={i + 1}>{d}</option>
                    ))}
                  </select>
                </div>
              )}

              {recurrenceType === 'MONTHLY' && (
                <div className="recurrence-row">
                  <span className="recurrence-label">Day of month</span>
                  <input
                    className="recurrence-select"
                    type="number"
                    min="1"
                    max="31"
                    value={dayOfMonth}
                    onChange={e => setDayOfMonth(Number(e.target.value))}
                  />
                </div>
              )}

              {recurrenceType === 'YEARLY' && (
                <div className="recurrence-row">
                  <span className="recurrence-label">Month</span>
                  <select
                    className="recurrence-select"
                    value={monthOfYear}
                    onChange={e => setMonthOfYear(Number(e.target.value))}
                  >
                    {MONTHS.map((m, i) => (
                      <option key={m} value={i + 1}>{m}</option>
                    ))}
                  </select>
                  <span className="recurrence-label" style={{ marginLeft: '0.75rem' }}>Day</span>
                  <input
                    className="recurrence-select"
                    type="number"
                    min="1"
                    max="31"
                    value={dayOfMonth}
                    onChange={e => setDayOfMonth(Number(e.target.value))}
                    style={{ width: '64px' }}
                  />
                </div>
              )}
            </>
          )}

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-button" disabled={saving}>
              {saving ? 'Saving...' : submitLabel}
            </button>
          </div>

          {initialValues?.recurrenceType && onDeleteSeries && (
            <button type="button" className="delete-series-button" onClick={onDeleteSeries}>
              Delete Series
            </button>
          )}
        </form>
      </div>
    </div>
  )
}
