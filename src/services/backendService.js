/**
 * Backend Service
 * Handles integration with Neon DB or Xano
 * 
 * Currently uses local storage for demo.
 * Update this file to connect to your backend.
 */

const BACKEND_TYPE = import.meta.env.VITE_BACKEND_TYPE || 'local'

// ===== NEON DB Integration =====
class NeonService {
  constructor() {
    this.connectionString = import.meta.env.VITE_NEON_CONNECTION_STRING
    if (!this.connectionString) {
      console.warn('Neon connection string not configured')
    }
  }

  async query(sql, params = []) {
    // Example: Connect to Neon DB via your backend API
    // In production, call your backend API instead of directly accessing DB
    try {
      const response = await fetch('/api/db/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql, params })
      })
      return await response.json()
    } catch (error) {
      console.error('Neon query failed:', error)
      throw error
    }
  }

  async getEvents() {
    return this.query('SELECT * FROM events ORDER BY date DESC')
  }

  async addEvent(event) {
    const sql = `
      INSERT INTO events (title, category, date, time, venue, capacity, ticket_price, image, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `
    const params = [
      event.title,
      event.category,
      event.date,
      event.time,
      event.venue,
      event.capacity,
      event.ticketPrice,
      event.image,
      event.description
    ]
    return this.query(sql, params)
  }

  async updateEvent(id, event) {
    const sql = `
      UPDATE events 
      SET title=$1, category=$2, date=$3, time=$4, venue=$5, capacity=$6, 
          ticket_price=$7, image=$8, description=$9
      WHERE id=$10
      RETURNING *
    `
    const params = [
      event.title,
      event.category,
      event.date,
      event.time,
      event.venue,
      event.capacity,
      event.ticketPrice,
      event.image,
      event.description,
      id
    ]
    return this.query(sql, params)
  }

  async deleteEvent(id) {
    return this.query('DELETE FROM events WHERE id=$1', [id])
  }
}

// ===== XANO Integration =====
class XanoService {
  constructor() {
    this.apiUrl = import.meta.env.VITE_XANO_API_URL
    this.authToken = import.meta.env.VITE_XANO_AUTH_TOKEN
    if (!this.apiUrl) {
      console.warn('Xano API URL not configured')
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.apiUrl}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      ...(this.authToken && { 'Authorization': `Bearer ${this.authToken}` })
    }

    try {
      const response = await fetch(url, { ...options, headers })
      if (!response.ok) {
        throw new Error(`Xano request failed: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Xano request failed:', error)
      throw error
    }
  }

  async getEvents() {
    return this.request('/events')
  }

  async addEvent(event) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(event)
    })
  }

  async updateEvent(id, event) {
    return this.request(`/events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(event)
    })
  }

  async deleteEvent(id) {
    return this.request(`/events/${id}`, {
      method: 'DELETE'
    })
  }
}

// ===== Local Service (Demo) =====
class LocalService {
  getEvents() {
    return Promise.resolve([])
  }

  addEvent(event) {
    return Promise.resolve(event)
  }

  updateEvent(id, event) {
    return Promise.resolve(event)
  }

  deleteEvent(id) {
    return Promise.resolve({ success: true })
  }
}

// ===== Service Factory =====
let backendService

function initBackendService() {
  switch (BACKEND_TYPE) {
    case 'neon':
      backendService = new NeonService()
      break
    case 'xano':
      backendService = new XanoService()
      break
    default:
      backendService = new LocalService()
  }
  return backendService
}

export function getBackendService() {
  if (!backendService) {
    initBackendService()
  }
  return backendService
}

export const BackendType = {
  NEON: 'neon',
  XANO: 'xano',
  LOCAL: 'local'
}
