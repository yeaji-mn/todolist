import { useState } from 'react'

export default function TodoModal({ heading, initialValue = '', submitLabel, saving, onSubmit, onClose }) {
  const [title, setTitle] = useState(initialValue)

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit(title.trim())
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
          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-button" disabled={saving}>
              {saving ? 'Saving...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
