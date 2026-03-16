import { toDateParam } from './dateUtils'
import TodoList from './TodoList'

export default function DayView({ todos, selectedDate, onToggle, onEdit, onDelete, onAdd }) {
  return (
    <>
      {todos.length === 0 && <p className="status">No todos for this day.</p>}
      <TodoList todos={todos} dateParam={toDateParam(selectedDate)} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
      <div className="add-buttons">
        <button className="add-button" onClick={() => onAdd(selectedDate)}>+ Add Todo</button>
      </div>
    </>
  )
}
