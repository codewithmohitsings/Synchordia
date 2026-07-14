import { Disc3 } from 'lucide-react';
import { Fragment, useState, useEffect, useMemo } from 'react';
import { useHandTracking } from './hooks/useHandTracking.js';
import { useAudioEngine } from './hooks/useAudioEngine.js';
import { useRecorder } from './hooks/useRecorder.js';
import { getChordsForScale, transposeNotes } from './utils/music.js';
import { BottomDock, ChordRing, PerformanceCanvas, InstructionsModal } from './components/index.js';

export default function App() {
  const [isTracking, setIsTracking] = useState(false);
  const [selectedScale, setSelectedScale] = useState('C');
  const [transpose, setTranspose] = useState(0);
  const [showHelp, setShowHelp] = useState(() => {
    const hasVisited = localStorage.getItem('synchordia_visited');
    return !hasVisited;
  });

  const closeHelpModal = () => {
    localStorage.setItem('synchordia_visited', 'true');
    setShowHelp(false);
  };

  const { majorChords, minorChords, chordMap } = useMemo(() => {
    const { major, minor } = getChordsForScale(selectedScale);
    const map = new Map();
    for (const chord of major) map.set(chord.fingers, chord);
    for (const chord of minor) map.set(chord.fingers, chord);
    return { majorChords: major, minorChords: minor, chordMap: map };
  }, [selectedScale]);

  const { activeFingerCount, videoRef, canvasRef } = useHandTracking(isTracking);
  const { isRecording, toggleRecording } = useRecorder(videoRef, canvasRef);

  useEffect(() => {
    if (!isTracking && isRecording) {
      toggleRecording();
    }
  }, [isTracking, isRecording, toggleRecording]);

  const { isReady: isAudioReady, initAudio, playChord, stopAll, activeInstrumentId, changeInstrument, setInstrumentVolume } = useAudioEngine();

  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        setHasPermission(true);
        stream.getTracks().forEach((track) => track.stop());
      })
      .catch(() => setHasPermission(false));
  }, []);

  useEffect(() => {
    if (!isAudioReady) return;

    if (activeFingerCount > 0 && isTracking) {
      const activeChord = chordMap.get(activeFingerCount);
      if (activeChord) {
        const transposedNotes = transposeNotes(activeChord.notes, transpose);
        playChord(transposedNotes);
      } else {
        stopAll();
      }
    } else {
      stopAll();
    }
  }, [activeFingerCount, isTracking, isAudioReady, playChord, stopAll, chordMap, transpose]);

  return (
    <div className="relative min-h-screen w-full bg-app-bg text-neutral-200 overflow-hidden font-sans selection:bg-amber-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-app-glow)_0%,transparent_65%)] opacity-90 pointer-events-none" />

      <header role="banner" className="absolute top-4 md:top-8 left-4 md:left-12 z-20 pointer-events-none">
        <h1 className="font-display text-xs md:text-sm font-semibold uppercase tracking-[0.4em] text-neutral-300 opacity-90 flex items-center gap-3 md:gap-4">
          <Disc3 className="w-3 h-3 md:w-4 md:h-4 opacity-50" />
          Synchordia
        </h1>
      </header>

      <main className="relative z-10 flex flex-col md:grid h-screen w-full max-w-[1600px] md:grid-cols-12 gap-6 md:gap-8 mx-auto px-4 md:px-8 pt-16 md:pt-0 pb-45 md:pb-20 items-center overflow-y-auto md:overflow-hidden scrollbar-hide">
        <div className="col-span-8 flex flex-col items-center justify-center order-1 md:order-2 w-full">
          <PerformanceCanvas hasPermission={hasPermission} videoRef={videoRef} canvasRef={canvasRef} />
        </div>

        <div className="col-span-2 flex flex-row md:flex-col justify-start md:justify-center gap-4 md:gap-12 order-2 md:order-1 overflow-x-auto w-full px-2 md:px-0 py-2 md:py-0 scrollbar-hide shrink-0">
          {majorChords.map((chord) => (
            <Fragment key={chord.id}>
              <ChordRing chord={chord} isActive={activeFingerCount === chord.fingers} />
            </Fragment>
          ))}
        </div>

        <div className="col-span-2 flex flex-row md:flex-col justify-start md:justify-center gap-4 md:gap-12 order-3 md:order-3 overflow-x-auto w-full px-2 md:px-0 py-2 md:py-0 scrollbar-hide shrink-0">
          {minorChords.map((chord) => (
            <Fragment key={chord.id}>
              <ChordRing chord={chord} isActive={activeFingerCount === chord.fingers} />
            </Fragment>
          ))}
        </div>
      </main>

      <BottomDock
        isTracking={isTracking}
        setIsTracking={setIsTracking}
        isRecording={isRecording}
        toggleRecording={toggleRecording}
        selectedScale={selectedScale}
        setSelectedScale={setSelectedScale}
        transpose={transpose}
        setTranspose={setTranspose}
        activeFingerCount={activeFingerCount}
        isAudioReady={isAudioReady}
        initAudio={initAudio}
        activeInstrumentId={activeInstrumentId}
        changeInstrument={changeInstrument}
        setInstrumentVolume={setInstrumentVolume}
        onOpenHelp={() => setShowHelp(true)}
      />

     <InstructionsModal isOpen={showHelp} onClose={closeHelpModal} />

      <div className="grain-overlay pointer-events-none absolute inset-0 opacity-[0.025] mix-blend-overlay" />
    </div>
  );
}