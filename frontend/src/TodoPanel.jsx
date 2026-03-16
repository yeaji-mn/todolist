import { useEffect, useState } from 'react'
import { toDateParam, formatDisplay, getWeekDates } from './dateUtils'
import { fetchTodosByDate, createTodo, toggleTodo, updateTodo, deleteTodo } from './todoApi'
import DayView from './DayView'
import WeekView from './WeekView'
import TodoModal from './TodoModal'

export default function TodoPanel({ selectedDate }) {
  const today = new Date()
  const [view, setView] = useState('day')
  const [todos, setTodos] = useState([])
  const [weekData, setWeekData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalDate, setModalDate] = useState(null)
  const [saving, setSaving] = useState(false)
  const [editingTodo, setEditingTodo] = useState(null)

  function refetch() {
    setLoading(true)
    setError(null)
    if (view === 'day') {
      return fetchTodosByDate(toDateParam(selectedDate))
        .then(data => { setTodos(data); setLoading(false) })
        .catch(err => { setError(err.message); setLoading(false) })
    } else {
      const dates = getWeekDates(selectedDate)
      return Promise.all(dates.map(d =>
        fetchTodosByDate(toDateParam(d)).then(todos => ({ date: d, todos }))
      ))
        .then(results => { setWeekData(results); setLoading(false) })
        .catch(err => { setError(err.message); setLoading(false) })
    }
  }

  useEffect(() => { refetch() }, [selectedDate, view]) // eslint-disable-line react-hooks/exhaustive-deps

  function updateTodoInState(updated) {
    if (view === 'day') {
      setTodos(prev => prev.map(t => t.id === updated.id ? updated : t))
    } else {
      setWeekData(prev => prev.map(entry => ({
        ...entry, todos: entry.todos.map(t => t.id === updated.id ? updated : t),
      })))
    }
  }

  function removeTodoFromState(id) {
    if (view === 'day') {
      setTodos(prev => prev.filter(t => t.id !== id))
    } else {
      setWeekData(prev => prev.map(entry => ({
        ...entry, todos: entry.todos.filter(t => t.id !== id),
      })))
    }
  }

  function handleCreate(data) {
    setSaving(true)
    createTodo(data)
      .then(created => {
        if (!created.recurrenceType) {
          if (view === 'day') {
            setTodos(prev => [...prev, created])
          } else {
            setWeekData(prev => prev.map(entry =>
              toDateParam(entry.date) === created.dueDate
                ? { ...entry, todos: [...entry.todos, created] }
                : entry
            ))
          }
          setSaving(false)
          setModalDate(null)
        } else {
          return refetch().then(() => { setSaving(false); setModalDate(null) })
        }
      })
      .catch(err => { alert(`Failed to create todo: ${err.message}`); setSaving(false) })
  }

  function handleToggle(todo, dateParam) {
    toggleTodo(todo.id, dateParam)
      .then(updated => {
        if (!todo.recurrenceType || view === 'day') {
          updateTodoInState(updated)
        } else {
          // Recurring in week view: update only the specific date column
          setWeekData(prev => prev.map(entry =>
            toDateParam(entry.date) === dateParam
              ? { ...entry, todos: entry.todos.map(t => t.id === updated.id ? updated : t) }
              : entry
          ))
        }
      })
      .catch(err => alert(`Failed to update todo: ${err.message}`))
  }

  function handleDelete(id, dateParam) {
    deleteTodo(id, dateParam)
      .then(() => {
        if (dateParam) {
          if (view === 'day') {
            setTodos(prev => prev.filter(t => t.id !== id))
          } else {
            setWeekData(prev => prev.map(entry =>
              toDateParam(entry.date) === dateParam
                ? { ...entry, todos: entry.todos.filter(t => t.id !== id) }
                : entry
            ))
          }
        } else {
          removeTodoFromState(id)
        }
      })
      .catch(err => alert(`Failed to delete todo: ${err.message}`))
  }

  function handleEdit(data) {
    setSaving(true)
    updateTodo(editingTodo.id, { completed: editingTodo.completed, ...data })
      .then(() => refetch())
      .then(() => { setSaving(false); setEditingTodo(null) })
      .catch(err => { alert(`Failed to update todo: ${err.message}`); setSaving(false) })
  }

  const isToday = toDateParam(selectedDate) === toDateParam(today)
  const weekDates = getWeekDates(selectedDate)

  return (
    <div className={`card${view === 'week' ? ' card--wide' : ''}`}>
      <div className="card-header">
        <div>
          <h1>{isToday ? "Today's Todos" : 'Todos'}</h1>
          <p className="date">
            {view === 'day'
              ? formatDisplay(selectedDate)
              : `${formatDisplay(weekDates[0])} – ${formatDisplay(weekDates[6])}`}
          </p>
        </div>
        <div className="toggle-bar">
          <button className={`toggle-btn${view === 'day' ? ' active' : ''}`} onClick={() => setView('day')}>Day</button>
          <button className={`toggle-btn${view === 'week' ? ' active' : ''}`} onClick={() => setView('week')}>Week</button>
        </div>
      </div>

      {loading && <p className="status">Loading...</p>}
      {error && <p className="status error">Error: {error}</p>}

      {!loading && !error && view === 'day' && (
        <DayView
          todos={todos}
          selectedDate={selectedDate}
          onToggle={handleToggle}
          onEdit={setEditingTodo}
          onDelete={handleDelete}
          onAdd={setModalDate}
        />
      )}

      {!loading && !error && view === 'week' && (
        <WeekView
          weekData={weekData}
          onToggle={handleToggle}
          onEdit={setEditingTodo}
          onDelete={handleDelete}
          onAdd={setModalDate}
        />
      )}

      {modalDate && (
        <TodoModal
          heading="New Todo"
          selectedDate={modalDate}
          submitLabel="Add"
          saving={saving}
          onSubmit={handleCreate}
          onClose={() => setModalDate(null)}
        />
      )}

      {editingTodo && (
        <TodoModal
          heading="Edit Todo"
          initialValues={editingTodo}
          selectedDate={selectedDate}
          submitLabel="Save"
          saving={saving}
          onSubmit={handleEdit}
          onClose={() => setEditingTodo(null)}
          onDeleteSeries={editingTodo.recurrenceType ? () => {
            deleteTodo(editingTodo.id)
              .then(() => { removeTodoFromState(editingTodo.id); setEditingTodo(null) })
              .catch(err => alert(`Failed to delete series: ${err.message}`))
          } : undefined}
        />
      )}
    </div>
  )
}
