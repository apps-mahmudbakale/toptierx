export default function Chip({ children, variant = 'default' }) {
  const styles = {
    default: 'bg-surface-container text-on-surface-variant border border-outline-variant/40',
    gold: 'bg-brand-gold/10 text-brand-gold-dim border border-brand-gold/20',
    dark: 'bg-white/10 text-white/70 border border-white/10',
  }
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-label font-semibold tracking-widest uppercase ${styles[variant]}`}
      style={{ letterSpacing: '0.08em' }}>
      {children}
    </span>
  )
}
