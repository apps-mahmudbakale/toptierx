import { createContext, useState, useCallback } from 'react'

export const BookingContext = createContext()

const initialBookings = [
  {
    id: 'booking-001',
    eventId: 'gala-obsidian',
    eventTitle: 'The Obsidian Gala — An Evening of Timeless Elegance',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    ticketCount: 2,
    ticketPrice: 150000,
    totalAmount: 300000,
    bookingDate: '2026-08-01',
    status: 'confirmed',
    notes: 'VIP seating requested'
  },
  {
    id: 'booking-002',
    eventId: 'summit-luxe',
    eventTitle: 'Summit Luxe — Where Visionaries Connect',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    ticketCount: 1,
    ticketPrice: 200000,
    totalAmount: 200000,
    bookingDate: '2026-07-29',
    status: 'confirmed',
    notes: ''
  }
]

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState(initialBookings)

  const addBooking = useCallback((booking) => {
    const newBooking = {
      ...booking,
      id: booking.id || `booking-${Date.now()}`,
      bookingDate: booking.bookingDate || new Date().toISOString().split('T')[0],
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
    return bookings.filter(b => b.eventId === eventId)
  }, [bookings])

  const getBookingStats = useCallback((eventId) => {
    const eventBookings = eventId ? getBookingsByEventId(eventId) : bookings
    const totalBookings = eventBookings.length
    const totalTickets = eventBookings.reduce((acc, b) => acc + (b.ticketCount || 0), 0)
    const totalRevenue = eventBookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0)
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
