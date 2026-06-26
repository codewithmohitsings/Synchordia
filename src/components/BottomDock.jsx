import { CircleDashed, Settings, Square, Radio, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { AVAILABLE_SCALES } from '../utils/music.js';

export default function BottomDock({
  isTracking,
  setIsTracking,
  isRecording,
  toggleRecording,
  selectedScale,
  setSelectedScale,
  transpose,
  setTranspose,
  activeFingerCount,
  isAudioReady,
  initAudio,
  activeInstrumentId,
  changeInstrument,
  setInstrumentVolume,
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [volume, setVolume] = useState(0.8);

  const onVolumeChange = (e) => {
    const nextVolume = parseFloat(e.target.value);
    setVolume(nextVolume);
    if (!isAudioReady) {
      initAudio();
    }
    setInstrumentVolume(nextVolume);
  };

  return (
    <div className="fixed bottom-4 md:bottom-10 left-1/2 flex w-auto -translate-x-1/2 flex-row items-center gap-2 rounded-full border border-neutral-800/60 bg-[#16120f]/60 py-4 backdrop-blur-xl z-50 shadow-2xl transition-all duration-300">
      <div
        className={`flex flex-row items-center overflow-hidden transition-all duration-300 ease-in-out shrink-0 ${
          isSettingsOpen ? 'max-w-3xl opacity-100 px-8 gap-8 md:gap-12' : 'max-w-0 opacity-0 px-0 gap-0'
        }`}
      >
        <div className="flex flex-col gap-1 shrink-0">
          <span className="text-[9px] uppercase tracking-[0.4em] text-neutral-500">Scale</span>
          <div className="relative flex items-center gap-1">
            <select
              value={selectedScale}
              onChange={(e) => setSelectedScale(e.target.value)}
              aria-label="Scale selection"
              title="Scale selection"
              className="bg-transparent font-display text-xs font-medium tracking-[0.3em] text-neutral-300 outline-none uppercase appearance-none cursor-pointer pr-4"
            >
              {AVAILABLE_SCALES.map((s) => (
                <option key={s} value={s} className="bg-neutral-900">
                  {s} MAJOR
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-neutral-500 absolute right-0 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col gap-1 shrink-0">
          <span className="text-[9px] uppercase tracking-[0.4em] text-neutral-500">Transpose</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setTranspose((t) => Math.max(-12, t - 1))} className="text-neutral-400 hover:text-white pb-0.5">
              -
            </button>
            <span className="font-display text-xs font-medium tracking-[0.3em] text-neutral-300 w-6 text-center">
              {transpose > 0 ? `+${transpose}` : transpose}
            </span>
            <button onClick={() => setTranspose((t) => Math.min(12, t + 1))} className="text-neutral-400 hover:text-white pb-0.5">
              +
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1 shrink-0">
          <span className="text-[9px] uppercase tracking-[0.4em] text-neutral-500">Instrument</span>
          <div className="relative flex items-center gap-1">
            <select
              value={activeInstrumentId}
              onChange={(e) => changeInstrument(e.target.value)}
              aria-label="Instrument selection"
              title="Instrument selection"
              className="bg-transparent font-display text-xs font-medium tracking-[0.3em] text-neutral-300 outline-none uppercase appearance-none cursor-pointer pr-4"
            >
              <option value="ambient-pad" className="bg-neutral-900">
                Ambient Pad
              </option>
              <option value="analog-strings" className="bg-neutral-900">
                Analog Strings
              </option>
              <option value="harmonium" className="bg-neutral-900">
                Harmonium
              </option>
            </select>
            <ChevronDown className="w-3 h-3 text-neutral-500 absolute right-0 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col gap-1 w-24 shrink-0">
          <span className="text-[9px] uppercase tracking-[0.4em] text-neutral-500">Engine</span>
          <div className="flex items-center gap-2">
            <div className={`h-1.5 w-1.5 rounded-full ${isTracking ? 'bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'bg-neutral-600'}`} />
            <span className="font-display text-xs font-medium tracking-[0.3em] text-neutral-300">
              {isTracking ? `TRK [${activeFingerCount}]` : 'IDLE'}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1 w-32 shrink-0">
          <span className="text-[9px] uppercase tracking-[0.4em] text-neutral-500">VOLUME</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={onVolumeChange}
            aria-label="Instrument volume"
            title="Instrument volume"
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-neutral-800/80 accent-amber-500 [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-neutral-800/80 [&::-webkit-slider-thumb]:-mt-[5px] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-amber-400/70 [&::-webkit-slider-thumb]:bg-[#f4c16c] [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(245,158,11,0.45)]"
          />
        </div>

        <div className="h-8 w-px bg-neutral-800/60 shrink-0 ml-4" />
      </div>

      <div className="flex flex-row items-center gap-4 shrink-0 pr-8 pl-4">
        <button
          onClick={() => {
            if (!isAudioReady) initAudio();
            setIsTracking(!isTracking);
          }}
          aria-label={isTracking ? 'Stop tracking' : 'Start tracking'}
          title={isTracking ? 'Stop tracking' : 'Start tracking'}
          className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all ${
            isTracking
              ? 'border-amber-500/30 bg-amber-500/10 text-amber-500'
              : 'border-neutral-700/50 bg-neutral-800/30 text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Radio className="h-5 w-5" />
        </button>

        <button
          onClick={toggleRecording}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          title={isRecording ? 'Stop recording' : 'Start recording'}
          className={`flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-300 ${
            isRecording
              ? 'border-red-500/40 bg-red-500/10 text-red-500 hover:bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse'
              : 'border-neutral-700/50 bg-neutral-800/30 text-neutral-400 hover:text-neutral-200'
          }`}
        >
          {isRecording ? <Square className="h-5 w-5 fill-current" /> : <CircleDashed className="h-6 w-6" />}
        </button>

        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          aria-label={isSettingsOpen ? 'Close settings' : 'Open settings'}
          title={isSettingsOpen ? 'Close settings' : 'Open settings'}
          className={`flex h-12 w-12 items-center justify-center rounded-full border transition-colors ${
            isSettingsOpen
              ? 'border-amber-500/50 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
              : 'border-neutral-700/50 bg-neutral-800/30 text-neutral-400 hover:bg-neutral-700/50 hover:text-neutral-200'
          }`}
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
