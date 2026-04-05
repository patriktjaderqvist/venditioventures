export default function BackgroundText() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center pointer-events-none select-none z-0"
    >
      <div
        className="uppercase whitespace-nowrap flex items-center justify-evenly w-full"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.2rem, 6.2vw, 7.5rem)',
          fontWeight: 300,
          letterSpacing: '0.15em',
          color: 'rgba(0, 0, 0, 0.18)',
          lineHeight: 1,
        }}
      >
        <span>Venditio</span>
        <span>Ventures</span>
      </div>
    </div>
  )
}
