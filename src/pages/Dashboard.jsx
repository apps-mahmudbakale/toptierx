import { useContext, useState } from 'react'
import { EventContext } from '../context/EventContext'
import { BookingContext } from '../context/BookingContext'
import { Trash2, Edit2, Plus, X, Upload, CheckCircle, XCircle, Loader } from 'lucide-react'
import SectionLabel from '../components/ui/SectionLabel'
import DashboardNavbar from '../components/layout/DashboardNavbar'
import { handleImageUpload } from '../utils/imageUpload'

// Helper function to format date for display
const formatDateForDisplay = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Helper function to format time for display
const formatTimeForDisplay = (timeStr) => {
  if (!timeStr) return ''
  return timeStr // time input already gives us HH:MM format
}

export default function Dashboard() {
  const { events, addEvent, updateEvent, deleteEvent, loading } = useContext(EventContext)
  const { bookings, getBookingsByEventId, getBookingStats } = useContext(BookingContext)
  
  const [activeTab, setActiveTab] = useState('events') // 'events' or 'bookings'
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [formError, setFormError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: '',
    time: '',
    venue: '',
    capacity: '',
    ticketPrice: '',
    paymentLinkIdentifier: '',
    image: '',
    description: '',
    itinerary: [],
    ticketCategories: []
  })
  const [newItinerary, setNewItinerary] = useState({ time: '', desc: '' })
  const [newTicketCategory, setNewTicketCategory] = useState({ name: '', price: '' })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setFormError('')
    try {
      const base64 = await handleImageUpload(file)
      setFormData(prev => ({ ...prev, image: base64 }))
      setImagePreview(base64)
    } catch (error) {
      setFormError(error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleAddEvent = async () => {
    setFormError('')

    if (!formData.title || !formData.venue) {
      setFormError('Please fill in at least title and venue')
      return
    }

    if (!formData.ticketPrice || isNaN(formData.ticketPrice) || formData.ticketPrice <= 0) {
      setFormError('Please enter a valid ticket price')
      return
    }

    if (!formData.date) {
      setFormError('Please select a date')
      return
    }

    setIsSaving(true)

    const eventData = {
      ...formData,
      date: formatDateForDisplay(formData.date),
      time: formData.time || '',
      ticketPrice: parseFloat(formData.ticketPrice),
      itinerary: formData.itinerary || [],
      ticketCategories: formData.ticketCategories || []
    }
    
    try {
      if (editingId) {
        await updateEvent(editingId, eventData)
        setEditingId(null)
      } else {
        await addEvent(eventData)
      }
      
      setFormData({
        title: '',
        category: '',
        date: '',
        time: '',
        venue: '',
        capacity: '',
        ticketPrice: '',
        paymentLinkIdentifier: '',
        image: '',
        description: '',
        itinerary: [],
        ticketCategories: []
      })
      setImagePreview(null)
      setShowForm(false)
      setNewItinerary({ time: '', desc: '' })
      setNewTicketCategory({ name: '', price: '' })
    } catch (error) {
      console.error('Error saving event:', error)
      setFormError(error.message || 'Failed to save event. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (event) => {
    // Convert display format back to input format for editing
    let dateForInput = event.date
    if (event.date) {
      // Parse the display format (e.g., "Sep 12, 2026") back to input format (YYYY-MM-DD)
      const dateObj = new Date(event.date)
      if (!isNaN(dateObj)) {
        dateForInput = dateObj.toISOString().split('T')[0]
      }
    }
    
    setFormData({
      ...event,
      date: dateForInput
    })
    setImagePreview(event.image)
    setEditingId(event.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(id)
    }
  }

  const handleClose = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      title: '',
      category: '',
      date: '',
      time: '',
      venue: '',
      capacity: '',
      ticketPrice: '',
      paymentLinkIdentifier: '',
      image: '',
      description: '',
      itinerary: [],
      ticketCategories: []
    })
    setImagePreview(null)
    setFormError('')
    setNewItinerary({ time: '', desc: '' })
    setNewTicketCategory({ name: '', price: '' })
  }

  const eventBookings = selectedEventId ? getBookingsByEventId(selectedEventId) : bookings
  const bookingStats = getBookingStats(selectedEventId)

  return (
    <>
      <DashboardNavbar />
      <main className="pt-32 pb-20 bg-surface min-h-screen">
        <div className="container-max">
          
          {/* Header */}
          <div className="mb-12 flex justify-between items-start">
            <div>
              <SectionLabel>Admin Panel</SectionLabel>
              <h1 className="font-headline text-4xl md:text-5xl font-bold text-on-surface mt-2">
                Event Management
              </h1>
            </div>
            {activeTab === 'events' && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-gold flex items-center gap-2"
              >
                <Plus size={18} />
                Add Event
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="mb-8 flex gap-4 border-b border-outline-variant/30">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-3 font-body font-semibold text-sm transition-smooth ${
                activeTab === 'events'
                  ? 'border-b-2 border-brand-gold text-brand-gold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-3 font-body font-semibold text-sm transition-smooth ${
                activeTab === 'bookings'
                  ? 'border-b-2 border-brand-gold text-brand-gold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Bookings
            </button>
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-2xl max-w-2xl w-full my-8">
                <div className="sticky top-0 bg-white border-b border-outline-variant/30 p-6 flex justify-between items-center">
                  <h2 className="font-headline text-2xl font-bold text-on-surface">
                    {editingId ? 'Edit Event' : 'Create New Event'}
                  </h2>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-surface rounded-lg transition-smooth"
                  >
                    <X size={22} className="text-on-surface-variant" />
                  </button>
                </div>

                <div className="p-6 space-y-5 max-h-[calc(90vh-120px)] overflow-y-auto">
                  {formError && (
                    <div className="p-4 bg-error/10 border border-error rounded-lg">
                      <p className="text-error text-sm font-body">{formError}</p>
                    </div>
                  )}

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-body font-semibold text-on-surface mb-3">
                      Event Image
                    </label>
                    <div className="border-2 border-dashed border-outline-variant rounded-lg p-6 text-center hover:border-brand-gold transition-smooth cursor-pointer relative group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {imagePreview ? (
                        <div className="space-y-3">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-40 object-cover rounded-lg"
                          />
                          <p className="text-xs text-on-surface-variant">Click to change image</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload size={32} className="mx-auto text-brand-gold" />
                          <p className="text-sm font-body font-semibold text-on-surface">
                            {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                          </p>
                          <p className="text-xs text-on-surface-variant">PNG, JPG up to 5MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                        Event Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g., The Obsidian Gala"
                        className="w-full px-4 py-2 border border-outline-variant rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-outline-variant rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-brand-gold bg-white"
                      >
                        <option value="">Select a category</option>
                        <option value="Gala">Gala</option>
                        <option value="Networking">Networking</option>
                        <option value="Private Dinner">Private Dinner</option>
                        <option value="Conference">Conference</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Cocktail">Cocktail Reception</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Corporate">Corporate Event</option>
                        <option value="Charity">Charity Benefit</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-outline-variant rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                        Time (Start)
                      </label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-outline-variant rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                        Venue *
                      </label>
                      <input
                        type="text"
                        name="venue"
                        value={formData.venue}
                        onChange={handleInputChange}
                        placeholder="e.g., The Ritz London"
                        className="w-full px-4 py-2 border border-outline-variant rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                        Capacity
                      </label>
                      <input
                        type="text"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        placeholder="e.g., 250 Guests"
                        className="w-full px-4 py-2 border border-outline-variant rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                        Ticket Price (NGN) *
                      </label>
                      <input
                        type="number"
                        name="ticketPrice"
                        value={formData.ticketPrice}
                        onChange={handleInputChange}
                        placeholder="e.g., 50000"
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-2 border border-outline-variant rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                        Hyparrow Payment Link Identifier
                      </label>
                      <input
                        type="text"
                        name="paymentLinkIdentifier"
                        value={formData.paymentLinkIdentifier}
                        onChange={handleInputChange}
                        placeholder="e.g., link_abc123xyz (from Hyparrow dashboard)"
                        className="w-full px-4 py-2 border border-outline-variant rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      />
                      <p className="text-xs text-on-surface-variant mt-1">Get this from your Hyparrow dashboard Payment Links section</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Event description..."
                      rows="4"
                      className="w-full px-4 py-2 border border-outline-variant rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-brand-gold resize-none"
                    />
                  </div>

                  {/* Itinerary Section */}
                  <div className="border-t border-outline-variant/30 pt-6">
                    <h3 className="text-lg font-headline font-semibold text-on-surface mb-4">Event Itinerary</h3>
                    
                    {formData.itinerary && formData.itinerary.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {formData.itinerary.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-surface-container rounded-lg">
                            <div className="flex-1">
                              <p className="text-sm font-body font-semibold text-on-surface">{item.time} - {item.desc}</p>
                            </div>
                            <button
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  itinerary: prev.itinerary.filter((_, i) => i !== idx)
                                }))
                              }}
                              className="p-2 text-error hover:bg-error/10 rounded-lg transition-smooth"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="time"
                        value={newItinerary.time}
                        onChange={(e) => setNewItinerary(prev => ({ ...prev, time: e.target.value }))}
                        placeholder="Time"
                        className="px-4 py-2 border border-outline-variant rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      />
                      <input
                        type="text"
                        value={newItinerary.desc}
                        onChange={(e) => setNewItinerary(prev => ({ ...prev, desc: e.target.value }))}
                        placeholder="Activity description"
                        className="px-4 py-2 border border-outline-variant rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      />
                      <button
                        onClick={() => {
                          if (newItinerary.time && newItinerary.desc) {
                            setFormData(prev => ({
                              ...prev,
                              itinerary: [...(prev.itinerary || []), { time: newItinerary.time, desc: newItinerary.desc }]
                            }))
                            setNewItinerary({ time: '', desc: '' })
                          }
                        }}
                        className="btn-gold text-sm"
                      >
                        Add to Itinerary
                      </button>
                    </div>
                  </div>

                  {/* Ticket Categories Section */}
                  <div className="border-t border-outline-variant/30 pt-6">
                    <h3 className="text-lg font-headline font-semibold text-on-surface mb-4">Ticket Categories</h3>
                    
                    {formData.ticketCategories && formData.ticketCategories.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {formData.ticketCategories.map((ticket, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-surface-container rounded-lg">
                            <div className="flex-1">
                              <p className="text-sm font-body font-semibold text-on-surface">{ticket.name} - ₦{ticket.price}</p>
                            </div>
                            <button
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  ticketCategories: prev.ticketCategories.filter((_, i) => i !== idx)
                                }))
                              }}
                              className="p-2 text-error hover:bg-error/10 rounded-lg transition-smooth"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={newTicketCategory.name}
                        onChange={(e) => setNewTicketCategory(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., VIP, Standard"
                        className="px-4 py-2 border border-outline-variant rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      />
                      <input
                        type="number"
                        value={newTicketCategory.price}
                        onChange={(e) => setNewTicketCategory(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="Price (NGN)"
                        className="px-4 py-2 border border-outline-variant rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      />
                      <button
                        onClick={() => {
                          if (newTicketCategory.name && newTicketCategory.price) {
                            setFormData(prev => ({
                              ...prev,
                              ticketCategories: [...(prev.ticketCategories || []), { name: newTicketCategory.name, price: parseFloat(newTicketCategory.price) }]
                            }))
                            setNewTicketCategory({ name: '', price: '' })
                          }
                        }}
                        className="btn-gold text-sm"
                      >
                        Add Category
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant/30">
                    <button
                      onClick={handleClose}
                      className="btn-ghost border-on-surface-variant text-on-surface-variant hover:border-on-surface-variant hover:text-on-surface"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddEvent}
                      disabled={isSaving}
                      className={`btn-gold ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isSaving ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          {editingId ? 'Updating...' : 'Creating...'}
                        </div>
                      ) : editingId ? 'Update Event' : 'Create Event'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EVENTS TAB */}
          {activeTab === 'events' && (
            <>
              {/* Events Table */}
              <div className="glass-card overflow-hidden mb-12">
                {loading ? (
                  <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
                    <Loader size={48} className="animate-spin text-brand-gold" />
                    <p className="text-on-surface-variant font-body">Loading events...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-outline-variant/30 bg-surface-hover">
                          <th className="text-left p-4 font-headline font-semibold text-on-surface">Title</th>
                          <th className="text-left p-4 font-headline font-semibold text-on-surface">Category</th>
                          <th className="text-left p-4 font-headline font-semibold text-on-surface">Date</th>
                          <th className="text-left p-4 font-headline font-semibold text-on-surface">Venue</th>
                          <th className="text-left p-4 font-headline font-semibold text-on-surface">Price</th>
                          <th className="text-right p-4 font-headline font-semibold text-on-surface">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map((event) => (
                          <tr key={event.id} className="border-b border-outline-variant/20 hover:bg-surface-hover transition-smooth">
                            <td className="p-4 font-body text-on-surface">{event.title}</td>
                            <td className="p-4 font-body text-on-surface-variant">{event.category || '—'}</td>
                            <td className="p-4 font-body text-on-surface-variant">{event.date || '—'}</td>
                            <td className="p-4 font-body text-on-surface-variant">{event.venue}</td>
                            <td className="p-4 font-headline font-semibold text-brand-gold">
                              ₦{event.ticketPrice || 0}
                            </td>
                            <td className="p-4">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleEdit(event)}
                                  className="p-2 hover:bg-blue-100 rounded-lg transition-smooth text-blue-600"
                                  aria-label="Edit"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(event.id)}
                                  className="p-2 hover:bg-error/10 rounded-lg transition-smooth text-error"
                                  aria-label="Delete"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {!loading && events.length === 0 && (
                  <div className="p-12 text-center">
                    <p className="text-on-surface-variant font-body mb-4">No events yet</p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="btn-gold"
                    >
                      Create your first event
                    </button>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6">
                  <p className="text-on-surface-variant text-sm font-body mb-2">Total Events</p>
                  <p className="font-headline text-4xl font-bold text-on-surface">{events.length}</p>
                </div>
                <div className="glass-card p-6">
                  <p className="text-on-surface-variant text-sm font-body mb-2">Average Ticket Price</p>
                  <p className="font-headline text-4xl font-bold text-brand-gold">
                    ₦{events.length > 0 ? (events.reduce((acc, e) => acc + (e.ticketPrice || 0), 0) / events.length).toLocaleString('en-NG', { maximumFractionDigits: 0 }) : '0'}
                  </p>
                </div>
                <div className="glass-card p-6">
                  <p className="text-on-surface-variant text-sm font-body mb-2">Total Revenue Potential</p>
                  <p className="font-headline text-4xl font-bold text-on-surface">
                    ₦{events.reduce((acc, e) => {
                      const capacity = parseInt(e.capacity) || 0
                      return acc + (capacity * (e.ticketPrice || 0))
                    }, 0).toLocaleString('en-NG')}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* BOOKINGS TAB */}
          {activeTab === 'bookings' && (
            <>
              {/* Event Filter */}
              <div className="mb-8">
                <label className="block text-sm font-body font-semibold text-on-surface mb-3">
                  Filter by Event
                </label>
                <select
                  value={selectedEventId || ''}
                  onChange={(e) => setSelectedEventId(e.target.value || null)}
                  className="w-full md:w-64 px-4 py-2 border border-outline-variant rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-brand-gold"
                >
                  <option value="">All Events</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Booking Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="glass-card p-6">
                  <p className="text-on-surface-variant text-sm font-body mb-2">Total Bookings</p>
                  <p className="font-headline text-4xl font-bold text-on-surface">{bookingStats.totalBookings}</p>
                </div>
                <div className="glass-card p-6">
                  <p className="text-on-surface-variant text-sm font-body mb-2">Total Tickets Sold</p>
                  <p className="font-headline text-4xl font-bold text-brand-gold">{bookingStats.totalTickets}</p>
                </div>
                <div className="glass-card p-6">
                  <p className="text-on-surface-variant text-sm font-body mb-2">Total Revenue</p>
                  <p className="font-headline text-4xl font-bold text-on-surface">
                    ₦{bookingStats.totalRevenue.toLocaleString('en-NG')}
                  </p>
                </div>
                <div className="glass-card p-6">
                  <p className="text-on-surface-variant text-sm font-body mb-2">Confirmed</p>
                  <p className="font-headline text-4xl font-bold text-green-600">{bookingStats.confirmedBookings}</p>
                </div>
              </div>

              {/* Bookings Table */}
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-outline-variant/30 bg-surface-hover">
                        <th className="text-left p-4 font-headline font-semibold text-on-surface">Booking ID</th>
                        <th className="text-left p-4 font-headline font-semibold text-on-surface">Customer</th>
                        <th className="text-left p-4 font-headline font-semibold text-on-surface">Email</th>
                        <th className="text-left p-4 font-headline font-semibold text-on-surface">Tickets</th>
                        <th className="text-left p-4 font-headline font-semibold text-on-surface">Amount</th>
                        <th className="text-left p-4 font-headline font-semibold text-on-surface">Date</th>
                        <th className="text-left p-4 font-headline font-semibold text-on-surface">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventBookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-outline-variant/20 hover:bg-surface-hover transition-smooth">
                          <td className="p-4 font-body text-on-surface font-mono text-sm">{booking.id}</td>
                          <td className="p-4 font-body text-on-surface">{booking.customerName}</td>
                          <td className="p-4 font-body text-on-surface-variant">{booking.customerEmail}</td>
                          <td className="p-4 font-body text-on-surface font-semibold">{booking.ticketCount}</td>
                          <td className="p-4 font-headline font-semibold text-brand-gold">
                            ₦{booking.totalAmount}
                          </td>
                          <td className="p-4 font-body text-on-surface-variant text-sm">{booking.bookingDate}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                              booking.status === 'confirmed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {booking.status === 'confirmed' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {eventBookings.length === 0 && (
                  <div className="p-12 text-center">
                    <p className="text-on-surface-variant font-body">No bookings yet</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  )
}
