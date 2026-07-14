import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function InstructionsModal({ isOpen, onClose }) {
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 0);
      return () => clearTimeout(timer);
    } else if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-6">
      <div className="relative bg-[#16120f]/90 border border-neutral-800/60 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl">
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close help"
          title="Close help"
          className="absolute top-4 right-4 md:top-5 md:right-5 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-700/70 bg-neutral-900/40 text-neutral-300 hover:text-amber-300 hover:border-amber-500/50 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="pr-12 md:pr-14">
          <h2 id="modal-title" className="font-display text-sm md:text-base uppercase tracking-[0.45em] text-amber-200/90">Instructions</h2>
          <p className="mt-2 text-xs md:text-sm tracking-[0.08em] text-neutral-400">
            Quick start guide for playing and recording in Synchordia.
          </p>
        </div>

        <div className="mt-6 md:mt-8 space-y-6">
          <section>
            <h3 className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-neutral-500">HOW TO PLAY</h3>
            <p className="mt-2 text-sm md:text-[15px] leading-relaxed text-neutral-250 text-neutral-300">
              Show your hand to the camera. Holding up 1,2,3 fingers triggers Major chords, and holding up 4,5, 6 fingers triggers Minor chords.
            </p>
          </section>

          <section>
            <h3 className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-neutral-500">AUDIO SETUP</h3>
            <p className="mt-2 text-sm md:text-[15px] leading-relaxed text-neutral-300">
              Use the VOLUME slider in settings to balance the instrument level against your microphone before recording vocals.
            </p>
          </section>

          <section>
            <h3 className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-neutral-500">RECORDING</h3>
            <p className="mt-2 text-sm md:text-[15px] leading-relaxed text-neutral-300">
              Click the red circle to start recording. Synchordia captures the camera feed and the mixed audio so your voice and instrument are recorded together.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}