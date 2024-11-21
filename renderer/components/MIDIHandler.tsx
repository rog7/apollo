import { detect } from "@tonaljs/chord-detect";
import { useContext, useEffect, useRef, useState } from "react";
import { Note, Progression } from "tonal";
import { WebMidi } from "webmidi";
import {
  KeyContext,
  MidiInputContext,
  ShowHomePageContext,
  ThemeContext,
} from "../pages/main";
import convertChordToCorrectKey from "../utils/chordConversion";
import { getItem } from "../utils/localStorage";
import { darkModeFontColor, lightModeFontColor } from "../utils/styles";
import Piano from "./Piano";
import HomeSvg from "./svg/HomeSvg";
import React from "react";

interface Props {
  socket: WebSocket | null;
  roomName: string | null;
  playAccess: boolean | null;
  showHomeButtonVal?: boolean;
}

const MIDIHandler = ({
  socket,
  roomName,
  playAccess,
  showHomeButtonVal,
}: Props) => {
  const midiNumbers = useRef<number[]>([]);
  const chord = useRef("");
  const altChords = useRef([""]);
  const [pitchValues, setPitchValues] = useState<number[]>([]);
  const midiSetUpComplete = useRef(false);
  const { theme } = useContext(ThemeContext);

  const { midiInputs } = useContext(MidiInputContext);
  const { key } = useContext(KeyContext);
  const [isFootPedalPressed, setIsFootPedalPressed] = useState(false);
  const midiBuffer = useRef<number[][]>([]);
  let sendTimeout = null; // Initializes timeout

  const { setShowHomePage } = useContext(ShowHomePageContext);

  const goBackToHomePage = () => {
    setShowHomePage(true);
  };

  useEffect(() => {
    if (WebMidi !== undefined) {
      midiInputs.forEach((input) => {
        input.removeListener("midimessage");
        input.addListener("noteon", handleMIDIMessage);
        input.addListener("noteoff", handleMIDIMessage);
        input.addListener("midimessage", handleSustainPedalMessage);
      });
    }

    if (midiInputs.length === 0 && playAccess && socket !== null) {
      midiBuffer.current = [];

      for (let note = 0; note < 128; note++) {
        midiBuffer.current.push([128, note, 0, 0]);
      }

      midiBuffer.current.push([0xb0, 64, 0, 0]);
      const midiMessageString = midiBuffer.current.join(";");

      const obj = {
        type: "midi",
        midi_message: midiMessageString,
        room_name: roomName,
        note_on_color: getItem("color-preference"),
      };

      socket.send(JSON.stringify(obj));
    }

    setIsFootPedalPressed(false);
    setPitchValues([]);
    midiSetUpComplete.current = true;
    chord.current = "";
    altChords.current = [""];
    midiBuffer.current = [];
    midiNumbers.current = [];
  }, [midiInputs, playAccess]);

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

        if (getItem("show-chord-numbers-preference") === "true") {
          const romanNumeralChord = Progression.toRomanNumerals(
            getItem("key-preference") as string,
            [chord.current]
          )[0];

          chord.current = romanNumeralChord;

          altChords.current = altChords.current.map(
            (chord) =>
              Progression.toRomanNumerals(getItem("key-preference") as string, [
                chord,
              ])[0]
          );
        }

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

        if (getItem("show-chord-numbers-preference") === "true") {
          const romanNumeralChord = Progression.toRomanNumerals(
            getItem("key-preference") as string,
            [chord.current]
          )[0];

          chord.current = romanNumeralChord;

          altChords.current = altChords.current.map(
            (chord) =>
              Progression.toRomanNumerals(getItem("key-preference") as string, [
                chord,
              ])[0]
          );
        }
        setPitchValues(midiNumbers.current);
      }

      if (socket !== null && playAccess) {
        // Add the MIDI message to the array
        midiBuffer.current.push([status, pitch, velocity, event.timestamp]);

        if (midiBuffer.current.length == 1) {
          sendTimeout = setTimeout(() => {
            const midiMessageString = midiBuffer.current.join(";");

            const obj = {
              type: "midi",
              midi_message: midiMessageString,
              room_name: roomName,
              note_on_color: getItem("color-preference"),
            };

            socket.send(JSON.stringify(obj));

            sendTimeout = null;
            midiBuffer.current = [];
          }, 2000);
        }
      }
    }
  }

  function handleSustainPedalMessage(event: any) {
    if (socket !== null) {
      if (event.data[0] === 0xb0 && event.data[1] === 64) {
        const pedalValue = event.data[2]; // Pedal value ranging from 0 to 127

        if (pedalValue === 127) {
          setIsFootPedalPressed(true);
        } else {
          setIsFootPedalPressed(false);
        }

        // Add the MIDI message to the array
        midiBuffer.current.push([0xb0, 64, pedalValue, event.timestamp]);

        if (midiBuffer.current.length == 1) {
          sendTimeout = setTimeout(() => {
            const midiMessageString = midiBuffer.current.join(";");

            const obj = {
              type: "midi",
              midi_message: midiMessageString,
              room_name: roomName,
              note_on_color: getItem("color-preference"),
            };

            socket.send(JSON.stringify(obj));

            sendTimeout = null;
            midiBuffer.current = [];
          }, 2000);
        }
      }
    } else {
      if (event.data[0] === 0xb0 && event.data[1] === 64) {
        const pedalValue = event.data[2]; // Pedal value ranging from 0 to 127

        if (pedalValue === 127) {
          setIsFootPedalPressed(true);
        } else {
          setIsFootPedalPressed(false);
        }
      }
    }
  }

  return (
    <div>
      {/* <div
        className="absolute top-[43%] left-[5%] font-normal text-2xl"
        style={{
          color:
            theme === 'light-mode' ? lightModeFontColor : darkModeFontColor,
        }}
      >
        <div
          style={{
            color:
              theme === 'light-mode' ? lightModeFontColor : darkModeFontColor,
          }}
        >
          Key: {key}
        </div>
      </div> */}
      {(showHomeButtonVal === undefined || showHomeButtonVal === true) && (
        <div
          className="cursor-pointer z-20 absolute top-[42px] left-[42px]"
          onClick={goBackToHomePage}
        >
          <HomeSvg />
        </div>
      )}
      <div className="absolute top-[77%] left-[2%] flex gap-[5px] items-center">
        <div
          className={`w-3 h-3 rounded-full no-transition border-2 ${
            isFootPedalPressed ? "bg-teal-600" : "white"
          }`}
          style={{
            borderColor:
              theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
          }}
        ></div>
        <div
          className="text-sm"
          style={{
            color:
              theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
          }}
        >
          Sustain
        </div>
      </div>
      <div className="absolute top-[40%] w-full flex flex-col items-center leading-8">
        {midiInputs.length === 0 ? (
          <>
            {/* <MIDIInputSymbol /> */}
            <div
              className="text-lg mt-2"
              style={{
                color:
                  theme === "light-mode"
                    ? lightModeFontColor
                    : darkModeFontColor,
              }}
            >
              No MIDI input detected. Connect a device to begin.
            </div>
          </>
        ) : (
          <div
            style={{
              color:
                theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
            }}
          >
            <div
              className="mb-2.5 text-5xl text-center"
              style={{
                color:
                  theme === "light-mode"
                    ? lightModeFontColor
                    : darkModeFontColor,
              }}
            >
              {chord.current}
            </div>
            {getItem("show-alt-chords-preference") === "true" &&
              altChords.current.map((value, index) => (
                <div
                  className="font-extralight mb-[5px] text-2xl text-center"
                  style={{
                    color:
                      theme === "light-mode"
                        ? lightModeFontColor
                        : darkModeFontColor,
                  }}
                  key={index}
                >
                  {value}
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-0">
        <Piano
          midiNumbers={pitchValues}
          noteOnColor={getItem("color-preference")}
        />
      </div>
    </div>
  );
};

export default MIDIHandler;
