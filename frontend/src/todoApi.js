async function checkResponse(res) {
  if (!res.ok) throw new Error(`Server error: ${res.status}`)
  return res
}

export async function fetchTodosByDate(dateParam) {
  const res = await fetch(`/todos/date/${dateParam}`)
  await checkResponse(res)
  return res.json()
}

export async function createTodo(title, dueDate) {
  const res = await fetch('/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, completed: false, dueDate }),
  })
  await checkResponse(res)
  return res.json()
}

export async function toggleTodo(id) {
  const res = await fetch(`/todos/${id}/complete`, { method: 'PATCH' })
  await checkResponse(res)
  return res.json()
}

export async function updateTodo(id, title, completed, dueDate) {
  const res = await fetch(`/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, completed, dueDate }),
  })
  await checkResponse(res)
  return res.json()
}

export async function deleteTodo(id) {
  const res = await fetch(`/todos/${id}`, { method: 'DELETE' })
  await checkResponse(res)
}
