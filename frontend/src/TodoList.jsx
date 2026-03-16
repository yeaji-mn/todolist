export default function TodoList({ todos, dateParam, onToggle, onEdit, onDelete }) {
  return (
    <ul className="list">
      {todos.map(todo => (
        <li key={todo.id} className="item">
          <input
            type="checkbox"
            className="item-checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo, dateParam)}
          />
          <span className={`item-title${todo.completed ? ' completed' : ''}`}>
            {todo.title}
            {todo.recurrenceType && (
              <span className="recurrence-badge">{todo.recurrenceType.toLowerCase()}</span>
            )}
          </span>
          <div className="item-actions">
            <button className="icon-button" onClick={() => onEdit(todo)} title="Edit">✏️</button>
            <button className="icon-button" onClick={() => onDelete(todo.id, todo.recurrenceType ? dateParam : null)} title="Delete">🗑️</button>
          </div>
        </li>
      ))}
    </ul>
  )
}
