import Hero from '../components/sections/Hero'
import FeaturedEvents from '../components/sections/FeaturedEvents'
import Stats from '../components/sections/Stats'
import HowItWorks from '../components/sections/HowItWorks'
import VenueShowcase from '../components/sections/VenueShowcase'
import Testimonials from '../components/sections/Testimonials'
import BookingCTA from '../components/sections/BookingCTA'

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedEvents />
      <Stats />
      <HowItWorks />
      <VenueShowcase />
      <Testimonials />
      <BookingCTA />
    </main>
  )
}
