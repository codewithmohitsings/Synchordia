import * as Tone from 'tone';
import { useRef, useState, useCallback, useEffect } from 'react';

export function useAudioEngine() {
  const [isReady, setIsReady] = useState(false);
  const [activeInstrumentId, setActiveInstrumentId] = useState('ambient-pad');

  const instrumentsRef = useRef({});
  const currentNotesRef = useRef([]);

  const initAudio = useCallback(async () => {
    if (isReady) return;

    await Tone.start();

    const limiter = new Tone.Limiter(-2).toDestination();

    const harmonium = new Tone.Sampler({
      urls: {
        A1: 'A1.mp3',
        A2: 'A2.mp3',
      },
      baseUrl: 'https://tonejs.github.io/audio/casio/',
      attack: 0.3,
      release: 0.5,
    }).connect(limiter);

    const padReverb = new Tone.Reverb({
      decay: 4,
      wet: 0.6,
    });
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
    }).chain(padChorus, padReverb, limiter);

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
    }).chain(stringFilter, limiter);

    instrumentsRef.current = {
      harmonium,
      'ambient-pad': ambientPad,
      'analog-strings': analogStrings,
    };

    setIsReady(true);
  }, [isReady]);

  const playChord = useCallback(
    (notes) => {
      if (!isReady) return;

      const instrument = instrumentsRef.current[activeInstrumentId];
      if (!instrument) return;

      const prevNotes = currentNotesRef.current;
      const notesToRelease = prevNotes.filter((n) => !notes.includes(n));
      const notesToAttack = notes.filter((n) => !prevNotes.includes(n));

      if (notesToRelease.length > 0) {
        instrument.triggerRelease(notesToRelease, Tone.now());
      }

      if (notesToAttack.length > 0) {
        instrument.triggerAttack(notesToAttack, Tone.now());
      }

      currentNotesRef.current = notes;
    },
    [isReady, activeInstrumentId],
  );

  const changeInstrument = useCallback(
    (id) => {
      if (id === activeInstrumentId) return;

      if (isReady && currentNotesRef.current.length > 0) {
        const oldInstrument = instrumentsRef.current[activeInstrumentId];
        const newInstrument = instrumentsRef.current[id];

        if (oldInstrument) {
          oldInstrument.triggerRelease(currentNotesRef.current, Tone.now());
        }

        if (newInstrument) {
          newInstrument.triggerAttack(currentNotesRef.current, Tone.now());
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
  };
}