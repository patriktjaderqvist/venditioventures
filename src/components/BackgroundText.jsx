export default function BackgroundText() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center pointer-events-none select-none z-0"
    >
      <div
        className="uppercase whitespace-nowrap flex items-center justify-evenly w-full"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 11vw, 13rem)',
          fontWeight: 300,
          letterSpacing: '0.35em',
          color: 'rgba(0, 0, 0, 0.18)',
          lineHeight: 1,
        }}
      >
        <span>Avendavi</span>
      </div>
    </div>
  )
}
