import React, { useContext, useEffect, useRef, useState } from "react";
import { WebMidi } from "webmidi";
import Box from "@mui/material/Box";
import Piano from "./Piano";
import { detect } from "@tonaljs/chord-detect";
import { Note } from "tonal";
import {
  AltChordsContext,
  ColorContext,
  KeyContext,
  MidiInputsContext,
  ThemeContext,
} from "../pages/home";
import { Typography } from "@mui/material";
import convertChordToCorrectKey from "../utils/chordConversion";
import { getItem } from "../utils/localStorage";
import {
  darkModeFontColor,
  fontFamily,
  lightModeFontColor,
} from "../utils/styles";
import MIDIInputSymbol from "./symbols/MIDIInputSymbol";

const MIDIHandler = () => {
  const midiNumbers = useRef<number[]>([]);
  const chord = useRef("");
  const altChords = useRef([""]);
  const [pitchValues, setPitchValues] = useState<number[]>([]);
  const { color } = useContext(ColorContext);
  const midiSetUpComplete = useRef(false);
  const { theme } = useContext(ThemeContext);

  const { midiInputs, setMidiInputs } = useContext(MidiInputsContext);
  const { key } = useContext(KeyContext);

  useEffect(() => {
    if (WebMidi !== undefined) {
      WebMidi.addListener("connected", handleMidiInputs);
      WebMidi.addListener("disconnected", handleMidiInputs);

      for (const input of WebMidi.inputs) {
        if (input.id !== "") {
          input.addListener("noteon", handleMIDIMessage);
          input.addListener("noteoff", handleMIDIMessage);
        }
      }

      if (WebMidi.inputs.length === 0) {
        setMidiInputs([]);
      } else {
        setMidiInputs(WebMidi.inputs);
      }
    }

    midiSetUpComplete.current = true;
  }, []);

  const handleMidiInputs = () => {
    if (WebMidi.inputs.length === 0) {
      midiSetUpComplete.current = true;
      setMidiInputs([]);
      chord.current = "";
      setPitchValues([]);
    } else {
      for (const input of WebMidi.inputs) {
        if (input.id !== null) {
          input.addListener("noteon", handleMIDIMessage);
          input.addListener("noteoff", handleMIDIMessage);
        }
      }

      midiSetUpComplete.current = true;

      setMidiInputs(WebMidi.inputs);
    }
  };

  // Function to handle incoming MIDI data
  function handleMIDIMessage(event: any) {
    if (event.data.length === 3) {
      const [status, pitch, velocity] = event.data;
      if (status === 144 && velocity !== 0) {
        midiNumbers.current = Array.from(
          new Set(midiNumbers.current.concat(pitch))
        ).sort((a, b) => {
          return a - b;
        });

        const chords = detect(
          midiNumbers.current.map((value) => Note.fromMidi(value)),
          { assumePerfectFifth: true }
        );

        chord.current = convertChordToCorrectKey(
          chords[0],
          getItem("key-preference") as string
        );

        altChords.current = chords
          .slice(1, 4)
          .map((chord) =>
            convertChordToCorrectKey(chord, getItem("key-preference") as string)
          );

        setPitchValues(midiNumbers.current);
      } else if (status === 128 || (status === 144 && velocity === 0)) {
        midiNumbers.current = midiNumbers.current.filter(
          (value) => value !== pitch
        );

        const chords = detect(
          midiNumbers.current.map((value) => Note.fromMidi(value)),
          { assumePerfectFifth: true }
        );

        chord.current = convertChordToCorrectKey(
          chords[0],
          getItem("key-preference") as string
        );

        altChords.current = chords
          .slice(1, 4)
          .map((chord) =>
            convertChordToCorrectKey(chord, getItem("key-preference") as string)
          );

        setPitchValues(midiNumbers.current);
      }
    }
  }

  return (
    <Box>
      <Box className="theme-transition">
        <Typography
          sx={{
            position: "absolute",
            top: "43%",
            left: "5%",
            fontFamily: { fontFamily },
            fontWeight: "400",
            color:
              theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
          }}
          variant="h5"
        >
          Key: {key}
        </Typography>
      </Box>
      <Box
        className="theme-transition"
        sx={{
          position: "absolute",
          top: "40%",
          width: "100%",
          textAlign: "center",
          lineHeight: "32px",
        }}
      >
        {midiInputs.length === 0 ? (
          <>
            <MIDIInputSymbol />
            <Typography
              variant="h6"
              sx={{
                fontFamily: { fontFamily },
                fontWeight: "400",
                color:
                  theme === "light-mode"
                    ? lightModeFontColor
                    : darkModeFontColor,
              }}
            >
              Roger Simon
            </Typography>
          </>
        ) : (
          <Box
            sx={{
              color:
                theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontFamily: { fontFamily },
                fontWeight: "400",
                marginBottom: "10px",
                color:
                  theme === "light-mode"
                    ? lightModeFontColor
                    : darkModeFontColor,
              }}
            >
              {chord.current}
            </Typography>
            {getItem("show-alt-chords-preference") === "true" &&
              altChords.current.map((value, index) => (
                <Typography
                  sx={{
                    fontFamily: { fontFamily },
                    fontWeight: "200",
                    marginBottom: "5px",
                    color:
                      theme === "light-mode"
                        ? lightModeFontColor
                        : darkModeFontColor,
                  }}
                  variant="h5"
                  key={index}
                >
                  {value}
                </Typography>
              ))}
          </Box>
        )}
      </Box>

      <Box sx={{ position: "absolute", bottom: "0" }}>
        <Piano midiNumbers={pitchValues} noteOnColor={color} />
      </Box>
    </Box>
  );
};

export default MIDIHandler;
