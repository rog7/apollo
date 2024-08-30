import { Chord, ChordType } from "tonal";

const notes = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

export const generateChords = (
  levelOfDifficulty: string,
  numberOfChords: number
) => {
  let chordTypes = [];
  let generatedChords = [];

  switch (levelOfDifficulty) {
    case "Easy":
      chordTypes = ChordType.all()
        .filter(
          (type) =>
            type.intervals.length === 3 &&
            !type.aliases[0].includes("#") &&
            !type.aliases[0].includes("b") &&
            !type.aliases[0].includes("sus") &&
            !type.aliases[0].includes("7")
        )
        .map((type) => type.aliases[0]);

      break;

    case "Medium":
      chordTypes = ChordType.all()
        .filter(
          (type) => type.intervals.length > 3 && type.intervals.length < 5
        )
        .map((type) => type.aliases[0]);

      break;

    case "Hard":
      chordTypes = ChordType.all()
        .filter((type) => type.intervals.length > 5)
        .map((type) => type.aliases[0]);

      break;

    default:
      break;
  }

  while (generatedChords.length !== numberOfChords) {
    const root = notes[Math.floor(Math.random() * notes.length)];

    const quality = chordTypes[Math.floor(Math.random() * chordTypes.length)];

    const chord = Chord.get(`${root} ${quality}`);

    if (!generatedChords.map((chord) => chord.name).includes(chord.name)) {
      generatedChords = generatedChords.concat(chord);
    }
  }

  return generatedChords;
};
