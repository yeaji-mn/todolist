async function checkResponse(res) {
  if (!res.ok) throw new Error(`Server error: ${res.status}`)
  return res
}

export async function fetchTodosByDate(dateParam) {
  const res = await fetch(`/todos/date/${dateParam}`)
  await checkResponse(res)
  return res.json()
}

export async function createTodo(data) {
  const res = await fetch('/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: false, ...data }),
  })
  await checkResponse(res)
  return res.json()
}

export async function toggleTodo(id, dateParam) {
  const url = dateParam ? `/todos/${id}/complete?date=${dateParam}` : `/todos/${id}/complete`
  const res = await fetch(url, { method: 'PATCH' })
  await checkResponse(res)
  return res.json()
}

export async function updateTodo(id, data) {
  const res = await fetch(`/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  await checkResponse(res)
  return res.json()
}

export async function deleteTodo(id, dateParam) {
  const url = dateParam ? `/todos/${id}?date=${dateParam}` : `/todos/${id}`
  const res = await fetch(url, { method: 'DELETE' })
  await checkResponse(res)
}
