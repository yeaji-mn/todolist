import { useState } from 'react'
import './App.css'
import Calendar from './Calendar'
import TodoPanel from './TodoPanel'

export default function App() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <div className="page">
      <div className="left-panel">
        <Calendar selectedDate={selectedDate} onSelect={setSelectedDate} />
      </div>
      <TodoPanel selectedDate={selectedDate} />
    </div>
  )
}
