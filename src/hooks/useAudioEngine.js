import * as Tone from 'tone';
import { useRef, useState, useCallback, useEffect } from 'react';

export function useAudioEngine() {
  const [isReady, setIsReady] = useState(false);
  const [activeInstrumentId, setActiveInstrumentId] = useState('ambient-pad');

  const instrumentsRef = useRef({});
  const currentNotesRef = useRef([]);
  const instrumentVolumeRef = useRef(null);
  const masterLimiterRef = useRef(null);
  const masterVolumeValueRef = useRef(0.8);

  const volumeToDb = useCallback((value) => {
    const clamped = Math.min(1, Math.max(0, value));
    return -60 + clamped * 60;
  }, []);

  const setInstrumentVolume = useCallback(
    (value) => {
      const clamped = Math.min(1, Math.max(0, value));
      masterVolumeValueRef.current = clamped;
      const nextDb = volumeToDb(clamped);

      if (instrumentVolumeRef.current) {
        instrumentVolumeRef.current.volume.value = nextDb;
      }
    },
    [volumeToDb],
  );

  const initAudio = useCallback(async () => {
    if (isReady) return;

    await Tone.start();

    const limiter = new Tone.Limiter(-2).toDestination();
    const instrumentVolume = new Tone.Volume(0);
    instrumentVolume.volume.value = volumeToDb(masterVolumeValueRef.current);
    instrumentVolume.connect(limiter);

    masterLimiterRef.current = limiter;
    instrumentVolumeRef.current = instrumentVolume;

    const harmonium = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: "fatsawtooth",
        count: 3,      
        spread: 20       
      },
      envelope: {
        attack: 0.05,
        decay: 0.1,
        sustain: 0.9,
        release: 1.2
      }
    }).connect(instrumentVolume);

    // Keep your reverb exactly as it is!
    const padReverb = new Tone.Reverb({
      decay: 4,
      wet: 0.6,
    });
    
    // Make sure to route the harmonium through the reverb if you haven't already:
    harmonium.connect(padReverb);
    const padChorus = new Tone.Chorus(4, 2.5, 0.5).start();

    const ambientPad = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.3,
        decay: 0.1,
        sustain: 1.0,
        release: 0.5,
      },
      volume: -6,
    }).chain(padChorus, padReverb, instrumentVolume);

    const stringFilter = new Tone.Filter(800, 'lowpass');
    const stringLfo = new Tone.LFO(0.5, 400, 1200).start();
    stringLfo.connect(stringFilter.frequency);

    const analogStrings = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sawtooth' },
      envelope: {
        attack: 0.3,
        decay: 0.2,
        sustain: 0.8,
        release: 0.5,
      },
      volume: -8,
    }).chain(stringFilter, instrumentVolume);

    instrumentsRef.current = {
      harmonium,
      'ambient-pad': ambientPad,
      'analog-strings': analogStrings,
    };

    setIsReady(true);
  }, [isReady, volumeToDb]);

  const playChord = useCallback(
    (notes) => {
      if (!isReady) return;

      const instrument = instrumentsRef.current[activeInstrumentId];
      if (!instrument) return;

      const prevNotes = currentNotesRef.current;
      const notesToRelease = prevNotes.filter((n) => !notes.includes(n));
      const notesToAttack = notes.filter((n) => !prevNotes.includes(n));

      const now = Tone.now();

      if (notesToRelease.length > 0) {
        instrument.triggerRelease(notesToRelease, now);
      }

      if (notesToAttack.length > 0) {
        instrument.triggerAttack(notesToAttack, now);
      }

      currentNotesRef.current = notes;
    },
    [isReady, activeInstrumentId],
  );

  const changeInstrument = useCallback(
    (id) => {
      if (id === activeInstrumentId) return;

      const now = Tone.now();

      if (isReady && currentNotesRef.current.length > 0) {
        const oldInstrument = instrumentsRef.current[activeInstrumentId];
        const newInstrument = instrumentsRef.current[id];

        if (oldInstrument) {
          oldInstrument.triggerRelease(currentNotesRef.current, now);
        }

        if (newInstrument) {
          newInstrument.triggerAttack(currentNotesRef.current, now);
        }
      }

      setActiveInstrumentId(id);
    },
    [isReady, activeInstrumentId],
  );

const stopAll = useCallback(() => {
    if (!isReady) return;
    const instrument = instrumentsRef.current[activeInstrumentId];
    if (instrument && currentNotesRef.current.length > 0) {
      instrument.triggerRelease(currentNotesRef.current, Tone.now());
      currentNotesRef.current = [];
    }
  }, [isReady, activeInstrumentId]);

  useEffect(() => {
    return () => {
      Object.values(instrumentsRef.current).forEach((instrument) => {
        if (instrument) {
          instrument.releaseAll?.();
          instrument.dispose?.();
        }
      });
      if (instrumentVolumeRef.current) {
        instrumentVolumeRef.current.dispose();
        instrumentVolumeRef.current = null;
      }
      if (masterLimiterRef.current) {
        masterLimiterRef.current.dispose();
        masterLimiterRef.current = null;
      }
      instrumentsRef.current = {};
      currentNotesRef.current = [];
      setIsReady(false);
    };
  }, []);

  return {
    isReady,
    initAudio,
    playChord,
    stopAll,
    activeInstrumentId,
    changeInstrument,
    setInstrumentVolume,
  };
}