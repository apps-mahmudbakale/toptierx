import { createContext, useState, useCallback, useEffect } from 'react'
import { neonService } from '../services/neonDb'
import { hyparrowProductService } from '../services/hyparrowProduct'

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
      // First, create product in Hyparrow
      console.log('🛍️ Creating Hyparrow product for event...')
      const productResult = await hyparrowProductService.createProduct(event)
      
      // Add Hyparrow product ID to event data
      const eventWithProduct = {
        ...event,
        hyparrowProductId: productResult.productId || null
      }

      // Then create event in Neon
      const newEvent = await neonService.createEvent(eventWithProduct)
      setEvents(prev => [newEvent, ...prev])
      
      console.log(`✅ Event and Hyparrow product ${productResult.action === 'updated' ? 'updated' : 'created'} successfully`)
      return newEvent
    } catch (err) {
      console.error('Error adding event:', err.message)
      setError(err.message)
      throw err
    }
  }, [])

  const updateEvent = useCallback(async (id, updatedEvent) => {
    try {
      // Get the existing event to check if it has a product ID
      const existingEvent = events.find(e => e.id === id)
      
      let eventWithProduct = updatedEvent

      console.log('📦 Syncing product with Hyparrow...')
      const productResult = await hyparrowProductService.createProduct({
        ...updatedEvent,
        id: id,
        hyparrowProductId: existingEvent?.hyparrowProductId || null
      })
      
      if (productResult.action === 'updated') {
        console.log('✅ Hyparrow product updated')
      } else {
        console.log('✅ Hyparrow product created for existing event')
      }
      
      eventWithProduct = {
        ...updatedEvent,
        hyparrowProductId: productResult.productId || existingEvent?.hyparrowProductId
      }

      // Update event in Neon
      const updated = await neonService.updateEvent(id, eventWithProduct)
      setEvents(prev => prev.map(e => e.id === id ? updated : e))
      return updated
    } catch (err) {
      console.error('Error updating event:', err.message)
      setError(err.message)
      throw err
    }
  }, [events])

  const deleteEvent = useCallback(async (id) => {
    try {
      // Get event to find Hyparrow product ID
      const event = events.find(e => e.id === id)
      
      // Delete from Hyparrow if product ID exists
      if (event?.hyparrowProductId) {
        console.log('🗑️ Deleting Hyparrow product...')
        await hyparrowProductService.deleteProduct(event.hyparrowProductId)
      }

      // Delete from Neon
      await neonService.deleteEvent(id)
      setEvents(prev => prev.filter(e => e.id !== id))
      console.log('✅ Event and Hyparrow product deleted successfully')
    } catch (err) {
      console.error('Error deleting event:', err.message)
      setError(err.message)
      throw err
    }
  }, [events])

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
