// Supabase client - connects to Neon database
// No backend server required - direct connection from frontend

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://your-project.supabase.co' // You'll need to update this
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// For now, use a helper to connect to Neon via REST if Supabase is not available
const supabase = SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null

export const neonService = {
  async getEvents() {
    if (!supabase) {
      throw new Error('Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env')
    }
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false })
    
    if (error) throw error
    
    return data.map(event => ({
      ...event,
      ticketPrice: event.ticket_price,
      ticketCategories: event.ticket_categories || [],
      itinerary: event.itinerary || []
    }))
  },

  async getEventById(id) {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    
    return {
      ...data,
      ticketPrice: data.ticket_price,
      ticketCategories: data.ticket_categories || [],
      itinerary: data.itinerary || []
    }
  },

  async createEvent(eventData) {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    
    const { data, error } = await supabase
      .from('events')
      .insert({
        title: eventData.title,
        category: eventData.category,
        date: eventData.date,
        time: eventData.time,
        venue: eventData.venue,
        capacity: eventData.capacity,
        ticket_price: eventData.ticketPrice,
        image: eventData.image,
        description: eventData.description,
        itinerary: eventData.itinerary,
        ticket_categories: eventData.ticketCategories
      })
      .select()
      .single()
    
    if (error) throw error
    
    return {
      ...data,
      ticketPrice: data.ticket_price,
      ticketCategories: data.ticket_categories || [],
      itinerary: data.itinerary || []
    }
  },

  async updateEvent(id, eventData) {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    
    const { data, error } = await supabase
      .from('events')
      .update({
        title: eventData.title,
        category: eventData.category,
        date: eventData.date,
        time: eventData.time,
        venue: eventData.venue,
        capacity: eventData.capacity,
        ticket_price: eventData.ticketPrice,
        image: eventData.image,
        description: eventData.description,
        itinerary: eventData.itinerary,
        ticket_categories: eventData.ticketCategories
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    return {
      ...data,
      ticketPrice: data.ticket_price,
      ticketCategories: data.ticket_categories || [],
      itinerary: data.itinerary || []
    }
  },

  async deleteEvent(id) {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    return { success: true }
  }
}
