import { Fragment, useRef, useState } from 'react'
import { toDateParam } from './dateUtils'
import TodoList from './TodoList'

const MIN_COL_WIDTH = 80

export default function WeekView({ weekData, onToggle, onEdit, onDelete, onAdd }) {
  const today = new Date()
  const containerRef = useRef(null)
  const dragRef = useRef(null)
  const [colWidths, setColWidths] = useState(null)

  function startDrag(e, index) {
    e.preventDefault()
    const sections = containerRef.current.querySelectorAll('.week-section')
    const startWidths = Array.from(sections).map(s => s.getBoundingClientRect().width)
    dragRef.current = { index, startX: e.clientX, startWidths }

    function onMouseMove(e) {
      const { index, startX, startWidths } = dragRef.current
      const delta = e.clientX - startX
      const maxDelta = startWidths[index + 1] - MIN_COL_WIDTH
      const minDelta = -(startWidths[index] - MIN_COL_WIDTH)
      const clamped = Math.min(maxDelta, Math.max(minDelta, delta))
      const newWidths = [...startWidths]
      newWidths[index] = startWidths[index] + clamped
      newWidths[index + 1] = startWidths[index + 1] - clamped
      setColWidths(newWidths)
    }

    function onMouseUp() {
      dragRef.current = null
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div className="week-view" ref={containerRef}>
      {weekData.map(({ date, todos }, i) => {
        const isToday = toDateParam(date) === toDateParam(today)
        const style = colWidths ? { flex: 'none', width: colWidths[i] } : {}
        return (
          <Fragment key={toDateParam(date)}>
            <div className="week-section" style={style}>
              <div className={`week-day-header${isToday ? ' today' : ''}`}>
                <span className="week-day-name">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <span className="week-day-date">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <button className="week-add-btn" onClick={() => onAdd(date)}>+</button>
              </div>
              {todos.length === 0
                ? <p className="week-empty">No todos</p>
                : <TodoList todos={todos} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
              }
            </div>
            {i < weekData.length - 1 && (
              <div className="week-resize-handle" onMouseDown={e => startDrag(e, i)} />
            )}
          </Fragment>
        )
      })}
    </div>
  )
}
