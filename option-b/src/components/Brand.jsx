export function Wordmark({ size = 'md', className = '' }) {
  const sizes = {
    sm: { rural: 'text-xl', move: 'text-2xl -mt-2 -ml-1' },
    md: { rural: 'text-3xl', move: 'text-4xl -mt-3 -ml-1' },
    lg: { rural: 'text-5xl', move: 'text-6xl -mt-5 -ml-2' },
  }
  const s = sizes[size] || sizes.md
  return (
    <div className={`inline-flex flex-col leading-none select-none ${className}`}>
      <span className={`wordmark-rural ${s.rural}`}>Rural</span>
      <span className={`wordmark-move ${s.move}`}>move</span>
    </div>
  )
}

export function Escudo({ className = '' }) {
  return (
    <img
      src="/escudo-san-xoan.jpg"
      alt="Escudo de San Xoán de Río"
      className={`object-contain mix-blend-multiply ${className}`}
    />
  )
}

export default function Header() {
  return (
    <header className="relative bg-sage-gradient border-b-2 border-sage-300 flex-shrink-0">
      {/* Cinta heráldica superior */}
      <div className="h-1 bg-gradient-to-r from-rioja-500 via-gold-400 to-rioja-500" />

      <div className="flex items-center justify-between px-6 py-3 gap-6">
        {/* Izquierda: escudo + identidad institucional */}
        <div className="flex items-center gap-4 min-w-0">
          <Escudo className="h-14 w-auto" />
          <div className="hidden sm:block min-w-0">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-rioja-700 uppercase">
              Concello de San Xoán de Río
            </p>
            <p className="heading-display text-base leading-tight truncate">
              Mobilidade rural · Axenda de actividades
            </p>
          </div>
        </div>

        {/* Centro: wordmark Rural Move */}
        <div className="flex-shrink-0">
          <Wordmark size="md" />
        </div>

        {/* Derecha: tagline */}
        <div className="hidden md:flex flex-col items-end text-right">
          <span className="wordmark-move text-rioja-500 text-xl leading-none">
            Todos os camiños
          </span>
          <span className="heading-display text-sage-700 text-sm italic mt-1">
            levan a San Xoán de Río
          </span>
        </div>
      </div>
    </header>
  )
}
