import { useState } from 'react'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December']

function MonthYearPicker({ viewYear, viewMonth, onSelect, onClose }) {
  const [pickerYear, setPickerYear] = useState(viewYear)
  const [yearInput, setYearInput] = useState(String(viewYear))

  function handleYearInput(e) {
    setYearInput(e.target.value)
    const val = parseInt(e.target.value, 10)
    if (!isNaN(val) && val > 0) setPickerYear(val)
  }

  return (
    <div className="picker-overlay" onClick={onClose}>
      <div className="picker" onClick={e => e.stopPropagation()}>
        <div className="picker-year-row">
          <button className="cal-nav" onClick={() => { setPickerYear(y => y - 1); setYearInput(y => String(Number(y) - 1)) }}>&#8249;</button>
          <input
            className="picker-year-input"
            type="number"
            value={yearInput}
            onChange={handleYearInput}
          />
          <button className="cal-nav" onClick={() => { setPickerYear(y => y + 1); setYearInput(y => String(Number(y) + 1)) }}>&#8250;</button>
        </div>
        <div className="picker-month-grid">
          {MONTHS.map((name, i) => (
            <div
              key={i}
              className={`picker-month${i === viewMonth && pickerYear === viewYear ? ' picker-month-active' : ''}`}
              onClick={() => onSelect(pickerYear, i)}
            >
              {name.slice(0, 3)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Calendar({ selectedDate, onSelect }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth())
  const [showPicker, setShowPicker] = useState(false)

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  function handlePickerSelect(year, month) {
    setViewYear(year)
    setViewMonth(month)
    setShowPicker(false)
  }

  const monthName = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  function isToday(d) {
    return d && today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === d
  }

  function isSelected(d) {
    return d && selectedDate.getFullYear() === viewYear && selectedDate.getMonth() === viewMonth && selectedDate.getDate() === d
  }

  return (
    <div className="calendar">
      <div className="cal-header">
        <button className="cal-nav" onClick={prevMonth}>&#8249;</button>
        <button className="cal-month-label" onClick={() => setShowPicker(true)}>{monthName} ▾</button>
        <button className="cal-nav" onClick={nextMonth}>&#8250;</button>
      </div>
      <div className="cal-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="cal-day-name">{d}</div>
        ))}
        {cells.map((d, i) => (
          <div
            key={i}
            className={[
              'cal-day',
              d ? 'cal-day-active' : '',
              isToday(d) ? 'cal-day-today' : '',
              isSelected(d) ? 'cal-day-selected' : '',
            ].join(' ').trim()}
            onClick={() => d && onSelect(new Date(viewYear, viewMonth, d))}
          >
            {d || ''}
          </div>
        ))}
      </div>

      {showPicker && (
        <MonthYearPicker
          viewYear={viewYear}
          viewMonth={viewMonth}
          onSelect={handlePickerSelect}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  )
}
