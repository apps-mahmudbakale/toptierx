import { createContext, useState, useCallback, useEffect } from 'react'
import { neonService } from '../services/neonDb'

export const BookingContext = createContext()

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  // Load bookings from Neon on mount
  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true)
        const data = await neonService.getBookings()
        console.log('📊 Bookings loaded from Neon:', data)
        setBookings(data || [])
      } catch (error) {
        console.error('Error loading bookings:', error)
        setBookings([])
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [])

  const addBooking = useCallback((booking) => {
    const newBooking = {
      ...booking,
      id: booking.id || `booking-${Date.now()}`,
      booking_date: booking.booking_date || new Date().toISOString().split('T')[0],
      status: booking.status || 'confirmed'
    }
    setBookings([...bookings, newBooking])
    return newBooking
  }, [bookings])

  const updateBooking = useCallback((id, updatedBooking) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, ...updatedBooking } : b))
  }, [bookings])

  const deleteBooking = useCallback((id) => {
    setBookings(bookings.filter(b => b.id !== id))
  }, [bookings])

  const getBookingsByEventId = useCallback((eventId) => {
    return bookings.filter(b => b.event_id === parseInt(eventId) || b.eventId === eventId)
  }, [bookings])

  const getBookingStats = useCallback((eventId) => {
    const eventBookings = eventId ? getBookingsByEventId(eventId) : bookings
    const totalBookings = eventBookings.length
    const totalTickets = eventBookings.reduce((acc, b) => acc + (b.ticket_count || b.ticketCount || 0), 0)
    const totalRevenue = eventBookings.reduce((acc, b) => acc + (b.total_amount || b.totalAmount || 0), 0)
    const confirmedBookings = eventBookings.filter(b => b.status === 'confirmed').length
    
    return {
      totalBookings,
      totalTickets,
      totalRevenue,
      confirmedBookings,
      cancellations: totalBookings - confirmedBookings
    }
  }, [bookings, getBookingsByEventId])

  return (
    <BookingContext.Provider value={{
      bookings,
      loading,
      addBooking,
      updateBooking,
      deleteBooking,
      getBookingsByEventId,
      getBookingStats
    }}>
      {children}
    </BookingContext.Provider>
  )
}
