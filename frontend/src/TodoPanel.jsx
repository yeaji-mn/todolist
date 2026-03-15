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

  useEffect(() => {
    setLoading(true)
    setError(null)
    if (view === 'day') {
      fetchTodosByDate(toDateParam(selectedDate))
        .then(data => { setTodos(data); setLoading(false) })
        .catch(err => { setError(err.message); setLoading(false) })
    } else {
      Promise.all(getWeekDates(selectedDate).map(d =>
        fetchTodosByDate(toDateParam(d)).then(todos => ({ date: d, todos }))
      ))
        .then(data => { setWeekData(data); setLoading(false) })
        .catch(err => { setError(err.message); setLoading(false) })
    }
  }, [selectedDate, view])

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

  function handleCreate(title) {
    setSaving(true)
    const dueDate = toDateParam(modalDate)
    createTodo(title, dueDate)
      .then(created => {
        if (view === 'day') {
          setTodos(prev => [...prev, created])
        } else {
          setWeekData(prev => prev.map(entry =>
            toDateParam(entry.date) === dueDate
              ? { ...entry, todos: [...entry.todos, created] }
              : entry
          ))
        }
        setSaving(false)
        setModalDate(null)
      })
      .catch(err => { alert(`Failed to create todo: ${err.message}`); setSaving(false) })
  }

  function handleToggle(todo) {
    toggleTodo(todo.id)
      .then(updateTodoInState)
      .catch(err => alert(`Failed to update todo: ${err.message}`))
  }

  function handleDelete(id) {
    deleteTodo(id)
      .then(() => removeTodoFromState(id))
      .catch(err => alert(`Failed to delete todo: ${err.message}`))
  }

  function handleEdit(title) {
    setSaving(true)
    updateTodo(editingTodo.id, title, editingTodo.completed, toDateParam(selectedDate))
      .then(updated => { updateTodoInState(updated); setSaving(false); setEditingTodo(null) })
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
          submitLabel="Add"
          saving={saving}
          onSubmit={handleCreate}
          onClose={() => setModalDate(null)}
        />
      )}

      {editingTodo && (
        <TodoModal
          heading="Edit Todo"
          initialValue={editingTodo.title}
          submitLabel="Save"
          saving={saving}
          onSubmit={handleEdit}
          onClose={() => setEditingTodo(null)}
        />
      )}
    </div>
  )
}
