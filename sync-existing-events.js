// Sync existing events to create Hyparrow products
// Run this script to create products for events that don't have them yet

import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config()

const sql = neon(process.env.VITE_DATABASE_URL || process.env.DATABASE_URL)

const createHyparrowProduct = async (event) => {
  try {
    const publicKey = process.env.VITE_HYPARROW_PUBLIC_KEY
    const secretKey = process.env.VITE_HYPARROW_SECRET_KEY

    if (!publicKey || !secretKey) {
      throw new Error('Hyparrow API keys not configured')
    }

    const productData = {
      name: event.title,
      description: event.description || `Event: ${event.title}`,
      type: 'digital',
      price: String(event.ticket_price || 0),
      currency: 'NGN',
      stock: parseInt(event.capacity) || 0,
      sku: `EVENT-${event.id}`,
      category: event.category || 'Events',
      isActive: true,
      fileUrl: event.image || '', // Event image as file URL
      variants: []
    }

    // Add ticket category variants if available
    if (event.ticket_categories && event.ticket_categories.length > 0) {
      const categories = typeof event.ticket_categories === 'string' 
        ? JSON.parse(event.ticket_categories) 
        : event.ticket_categories

      productData.variants = categories.map((category) => ({
        name: category.name,
        sku: `${productData.sku}-${category.name.toUpperCase().replace(/\s+/g, '-')}`,
        price: String(category.price || 0),
        stockQty: parseInt(event.capacity) || 0
      }))
    }

    console.log(`  Creating product for event "${event.title}"...`)

    const response = await fetch('https://api.hyparrow.cloud/api/v1/products/', {
      method: 'POST',
      headers: {
        'X-API-Key': publicKey,
        'X-API-Secret': secretKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Hyparrow error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    const productId = result.id || result.product_id

    // Save product ID to database
    await sql`
      UPDATE events 
      SET hyparrow_product_id = ${productId}
      WHERE id = ${event.id}
    `

    console.log(`  ✅ Product created: ${productId}`)
    return productId
  } catch (error) {
    console.error(`  ❌ Error creating product: ${error.message}`)
    return null
  }
}

const syncExistingEvents = async () => {
  try {
    console.log('🔄 Syncing existing events with Hyparrow...\n')

    // Get all events without Hyparrow product ID
    const events = await sql`
      SELECT * FROM events 
      WHERE hyparrow_product_id IS NULL
      ORDER BY created_at DESC
    `

    if (events.length === 0) {
      console.log('✅ All events already have Hyparrow products!')
      process.exit(0)
      return
    }

    console.log(`📊 Found ${events.length} event(s) without Hyparrow products:\n`)

    let successCount = 0
    let failureCount = 0

    for (const event of events) {
      const productId = await createHyparrowProduct(event)
      if (productId) {
        successCount++
      } else {
        failureCount++
      }
    }

    console.log(`\n📈 Sync Complete:`)
    console.log(`   ✅ Success: ${successCount}`)
    console.log(`   ❌ Failed: ${failureCount}`)
    console.log(`   📊 Total: ${events.length}\n`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Sync failed:', error)
    process.exit(1)
  }
}

syncExistingEvents()
