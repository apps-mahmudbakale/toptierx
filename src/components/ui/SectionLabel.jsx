export default function SectionLabel({ children, light = false }) {
  return (
    <p className={`section-label mb-3 ${light ? 'text-white/50' : 'text-brand-gold'}`}>
      {children}
    </p>
  )
}
