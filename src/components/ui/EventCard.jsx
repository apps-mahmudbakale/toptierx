import { ArrowRight, MapPin, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import Chip from './Chip'

export default function EventCard({ id, image, category, date, title, venue, delay = 0 }) {
  return (
    <Link
      to={`/event/${id}`}
      className="group relative rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 cursor-pointer block"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Image */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Category chip */}
        <div className="absolute top-4 left-4">
          <Chip variant="dark">{category}</Chip>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 bg-white">
        <div className="flex items-center gap-4 mb-3 text-on-surface-variant text-xs font-body">
          <span className="flex items-center gap-1.5">
            <Calendar size={12} className="text-brand-gold" />
            {date}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={12} className="text-brand-gold" />
            {venue}
          </span>
        </div>
        <h3 className="font-headline text-xl font-semibold text-on-surface mb-4 leading-tight group-hover:text-brand-black transition-smooth">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-brand-gold text-sm font-body font-semibold group-hover:gap-3 transition-all duration-300">
          <span>View Details</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  )
}
