export default function ChordRing({ chord, isActive }) {
  return (
    <div className="flex flex-col items-center gap-3 md:gap-4 shrink-0">
      <div
        className={`relative flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 ease-out ${
          isActive
            ? 'scale-105 border-amber-500/80 bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.25)]'
            : 'scale-100 border-neutral-800/50 bg-neutral-900/40 shadow-none'
        }`}
      >
        <span
          className={`font-display text-xl md:text-2xl font-light tracking-[0.2em] transition-colors duration-300 ${
            isActive ? 'text-amber-50 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'text-neutral-200'
          }`}
        >
          {chord.note}
        </span>
      </div>
      <div className="flex flex-col items-center gap-1 md:gap-1.5">
        <span className="text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-neutral-500 font-medium">
          {chord.fingers} FINGER{chord.fingers !== 1 && 'S'}
        </span>
        <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-neutral-600">
          {chord.id}
        </span>
      </div>
    </div>
  );
}
