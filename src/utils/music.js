import { Key, Chord, Note, Interval } from '@tonaljs/tonal';

export const AVAILABLE_SCALES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function transposeNotes(notes, semitones) {
  if (semitones === 0) return notes;
  const interval = Interval.fromSemitones(semitones);
  return notes.map((n) => Note.transpose(n, interval));
}

export function getChordsForScale(rootNote) {
  const key = Key.majorKey(rootNote);
  const triads = key.triads;

  const getNotesWithOctave = (chordName, baseOctave = 4) => {
    const notes = Chord.get(chordName).notes;
    let currentOctave = baseOctave;
    let prevChroma = -1;

    return notes.map((n) => {
      const chroma = Note.chroma(n);
      if (chroma < prevChroma) {
        currentOctave++;
      }
      prevChroma = chroma;
      return `${n}${currentOctave}`;
    });
  };

  const majorChords = [
    { id: 'I', note: triads[0], type: 'Major', fingers: 1, notes: getNotesWithOctave(triads[0], 4) },
    { id: 'IV', note: triads[3], type: 'Major', fingers: 2, notes: getNotesWithOctave(triads[3], 3) },
    { id: 'V', note: triads[4], type: 'Major', fingers: 3, notes: getNotesWithOctave(triads[4], 3) },
  ];

  const minorChords = [
    { id: 'vi', note: triads[5], type: 'Minor', fingers: 4, notes: getNotesWithOctave(triads[5], 3) },
    { id: 'ii', note: triads[1], type: 'Minor', fingers: 5, notes: getNotesWithOctave(triads[1], 4) },
    { id: 'iii', note: triads[2], type: 'Minor', fingers: 6, notes: getNotesWithOctave(triads[2], 4) },
  ];

  return { major: majorChords, minor: minorChords };
}