import { useEffect, useRef, useState } from 'react'

const stats = [
  { value: 500, suffix: '+', label: 'Events Hosted' },
  { value: 120, suffix: '+', label: 'Exclusive Venues' },
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
  { value: 30, suffix: '+', label: 'Countries Served' },
]

function Counter({ value, suffix }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1800
          const step = 16
          const increment = value / (duration / step)
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= value) {
              setCount(value)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, step)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  )
}

export default function Stats() {
  return (
    <section className="bg-brand-black py-20">
      <div className="container-max">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {stats.map(({ value, suffix, label }) => (
            <div key={label} className="group">
              <p className="font-headline text-4xl md:text-5xl font-bold text-brand-gold mb-2">
                <Counter value={value} suffix={suffix} />
              </p>
              <p className="text-white/50 text-sm font-body tracking-wide">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
