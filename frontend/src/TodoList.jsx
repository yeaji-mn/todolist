export default function TodoList({ todos, onToggle, onEdit, onDelete }) {
  return (
    <ul className="list">
      {todos.map(todo => (
        <li key={todo.id} className="item">
          <input
            type="checkbox"
            className="item-checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo)}
          />
          <span className={`item-title${todo.completed ? ' completed' : ''}`}>
            {todo.title}
          </span>
          <div className="item-actions">
            <button className="icon-button" onClick={() => onEdit(todo)} title="Edit">✏️</button>
            <button className="icon-button" onClick={() => onDelete(todo.id)} title="Delete">🗑️</button>
          </div>
        </li>
      ))}
    </ul>
  )
}
