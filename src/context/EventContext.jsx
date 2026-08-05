import { createContext, useState, useCallback, useEffect } from 'react'
import { neonService } from '../services/neonDb'

export const EventContext = createContext()

export function EventProvider({ children }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch events from Neon serverless on mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true)
        const data = await neonService.getEvents()
        setEvents(data)
        setError(null)
      } catch (err) {
        console.error('Error loading events:', err.message)
        setError(err.message)
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  const addEvent = useCallback(async (event) => {
    try {
      const newEvent = await neonService.createEvent(event)
      setEvents(prev => [newEvent, ...prev])
      return newEvent
    } catch (err) {
      console.error('Error adding event:', err.message)
      setError(err.message)
      throw err
    }
  }, [])

  const updateEvent = useCallback(async (id, updatedEvent) => {
    try {
      const updated = await neonService.updateEvent(id, updatedEvent)
      setEvents(prev => prev.map(e => e.id === id ? updated : e))
      return updated
    } catch (err) {
      console.error('Error updating event:', err.message)
      setError(err.message)
      throw err
    }
  }, [])

  const deleteEvent = useCallback(async (id) => {
    try {
      await neonService.deleteEvent(id)
      setEvents(prev => prev.filter(e => e.id !== id))
    } catch (err) {
      console.error('Error deleting event:', err.message)
      setError(err.message)
      throw err
    }
  }, [])

  const getEventById = useCallback((id) => {
    // Convert id to number for comparison since URL params are strings
    const numId = parseInt(id, 10)
    return events.find(e => e.id === numId || String(e.id) === String(id))
  }, [events])

  return (
    <EventContext.Provider value={{ 
      events,
      loading,
      error,
      addEvent, 
      updateEvent, 
      deleteEvent, 
      getEventById 
    }}>
      {children}
    </EventContext.Provider>
  )
}
