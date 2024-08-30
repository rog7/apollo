import { detect } from "@tonaljs/chord-detect";
import { useContext, useEffect, useRef, useState } from "react";
import { Note } from "tonal";
import { WebMidi } from "webmidi";
import { KeyContext, MidiInputContext, ThemeContext } from "../pages/main";
import * as utils from "../utils/determineColors";
import { generateChords } from "../utils/generateChords";
import { getItem } from "../utils/localStorage";
import { darkModeFontColor, lightModeFontColor } from "../utils/styles";
import Piano from "./Piano";
import EnterModeArrow from "./svg/EnterModeArrow";
import PracticeModeSvgTop from "./svg/PracticeModeSvgTop";
import MIDIInputSymbol from "./symbols/MIDIInputSymbol";

interface Props {
  isSoloPlay: boolean;
  minutesToPractice: number;
  totalChords: number;
  levelOfDifficulty: string;
  onGoingBackToInit: () => void;
}

const SoloPlayMIDIHandler = ({
  isSoloPlay,
  minutesToPractice,
  totalChords,
  levelOfDifficulty,
  onGoingBackToInit,
}: Props) => {
  const midiNumbers = useRef<number[]>([]);
  const [pitchValues, setPitchValues] = useState<number[]>([]);
  const { theme } = useContext(ThemeContext);
  const [targetChord, setTargetChord] = useState("");
  const targetChordRef = useRef(targetChord);

  const { midiInput } = useContext(MidiInputContext);
  const { key } = useContext(KeyContext);
  const [isFootPedalPressed, setIsFootPedalPressed] = useState(false);

  const [minute, setMinute] = useState(minutesToPractice);
  const [second, setSecond] = useState(0);

  const secondRef = useRef(second);
  const minuteRef = useRef(minute);

  const [currentChord, setCurrentChord] = useState(0);
  const currentChordRef = useRef(currentChord);

  const [showResultScreen, setShowResultScreen] = useState(false);
  const numberOfCorrectChordsRef = useRef(0);
  const generatedChordsRef = useRef([]);

  let timerId: NodeJS.Timeout | null = null;

  useEffect(() => {
    if (isSoloPlay && minute >= 0) {
      timerId = setInterval(() => {
        if (numberOfCorrectChordsRef.current !== totalChords) {
          if (second > 0) {
            secondRef.current--;
            setSecond(second - 1);
          } else if (minute > 0) {
            minuteRef.current--;
            setMinute(minute - 1);
            setSecond(59);
          } else {
            clearInterval(timerId!);
          }
        } else {
          clearInterval(timerId!);
        }
      }, 1000); // decrement every 1000ms (1 second)
    }

    // Clean up the interval on component unmount or when isSoloPlay becomes false
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [isSoloPlay, minute, second]);

  useEffect(() => {
    generatedChordsRef.current = generateChords(levelOfDifficulty, totalChords);

    targetChordRef.current = generatedChordsRef.current[0].symbol;
    setTargetChord(targetChordRef.current);
  }, []);

  useEffect(() => {
    if (WebMidi !== undefined && midiInput !== null) {
      midiInput.removeListener("midimessage");
      midiInput.addListener("noteon", handleMIDIMessage);
      midiInput.addListener("noteoff", handleMIDIMessage);
      midiInput.addListener("midimessage", handleSustainPedalMessage);
    }

    setIsFootPedalPressed(false);
    setPitchValues([]);
    midiNumbers.current = [];
  }, [midiInput]);

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
      } else if (status === 128 || (status === 144 && velocity === 0)) {
        midiNumbers.current = midiNumbers.current.filter(
          (value) => value !== pitch
        );
      }

      const chords = detect(
        midiNumbers.current.map((value) => Note.fromMidi(value)),
        { assumePerfectFifth: true }
      );

      if (
        chords.includes(targetChordRef.current) &&
        !(minuteRef.current === 0 && secondRef.current === 0) &&
        numberOfCorrectChordsRef.current !== totalChords
      ) {
        if (numberOfCorrectChordsRef.current + 1 !== totalChords) {
          numberOfCorrectChordsRef.current++;

          targetChordRef.current =
            generatedChordsRef.current[numberOfCorrectChordsRef.current].symbol;
          setTargetChord(targetChordRef.current);
          currentChordRef.current++;
          setCurrentChord(currentChordRef.current);
        } else {
          numberOfCorrectChordsRef.current++;
          setShowResultScreen(true);
        }
      }

      setPitchValues(midiNumbers.current);
    }
  }

  function handleSustainPedalMessage(event: any) {
    if (event.data[0] === 0xb0 && event.data[1] === 64) {
      const pedalValue = event.data[2]; // Pedal value ranging from 0 to 127

      if (pedalValue === 127) {
        setIsFootPedalPressed(true);
      } else {
        setIsFootPedalPressed(false);
      }
    }
  }

  return (
    <div>
      {showResultScreen && (
        <div className="flex justify-center items-center h-screen">
          <div
            className={`z-10 relative mt-[32px] rounded-2.5xl w-[482px] h-[400px]`}
            style={{
              backgroundColor: utils.determineBackgroundColorReverse(),
            }}
          >
            <div className="z-20 absolute top-[-66px] left-[180px]">
              <PracticeModeSvgTop />
            </div>
            <div
              className={`flex flex-col items-center absolute top-[3px] left-[3px] rounded-2.5xl w-[473px] h-[390px] p-[21px]`}
              style={{
                backgroundColor: utils.determineBackgroundColorForCard2(),
              }}
            >
              <div className="mt-[70px] w-[341px] flex flex-col gap-[20px] items-center">
                <p
                  className={`text-[32px] font-bold text-center w-[250px]`}
                  style={{
                    color: utils.determineFontColor(),
                  }}
                >
                  {`You got ${numberOfCorrectChordsRef.current} out of ${totalChords} correct!`}
                </p>
                <p
                  className={`text-[20px] font-light text-center w-[300px]`}
                  style={{
                    color: utils.determineFontColor(),
                  }}
                >
                  Practice mode helps you refine your skills and reaction time.
                </p>
                <p
                  className={`text-[20px] font-bold text-center`}
                  style={{
                    color: utils.determineFontColor(),
                  }}
                >
                  Want to practice with others? Start a Multiplayer session!
                </p>
              </div>
            </div>
            <div
              className="absolute bottom-[20px] right-[20px]"
              onClick={onGoingBackToInit}
            >
              <EnterModeArrow />
            </div>
          </div>
        </div>
      )}
      <div className={`${showResultScreen && "fixed inset-0 opacity-20"}`}>
        {isSoloPlay && (
          <div className="flex justify-center mt-5">
            <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
              <div
                className="flex flex-col p-4 rounded-box"
                style={{
                  backgroundColor:
                    utils.determineBackgroundColorForCountdownTimer(),
                  color: utils.determineFontColor(),
                }}
              >
                <span className="countdown text-5xl">
                  <span
                    /* @ts-ignore */ style={{
                      "--value": minute,
                    }}
                  ></span>
                </span>
                min
              </div>
              <div
                className="flex flex-col p-4 rounded-box"
                style={{
                  backgroundColor:
                    utils.determineBackgroundColorForCountdownTimer(),
                  color: utils.determineFontColor(),
                }}
              >
                <span className="countdown text-5xl">
                  <span
                    /* @ts-ignore */ style={{
                      "--value": second,
                    }}
                  ></span>
                </span>
                sec
              </div>
            </div>
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
        {midiInput === null ? (
          <div className="absolute top-[40%] w-full flex flex-col items-center leading-8">
            <MIDIInputSymbol />
            <div
              className="text-lg mt-2"
              style={{
                color:
                  theme === "light-mode"
                    ? lightModeFontColor
                    : darkModeFontColor,
              }}
            >
              No midi input devices selected
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col mt-[140px] items-center"
            // style={{ backgroundColor: utils.determineBackgroundColor() }}
          >
            <p
              className="text-[20px]"
              style={{
                color: utils.determineFontColor(),
              }}
            >{`${currentChord} / ${totalChords}`}</p>
            <div
              className="text-[64px] mt-[30px] font-bold"
              style={{
                color: utils.determineFontColor(),
              }}
            >
              {targetChord}
            </div>
          </div>
        )}

        <div className="fixed bottom-0">
          <Piano
            midiNumbers={pitchValues}
            noteOnColor={getItem("color-preference")}
          />
        </div>
      </div>
    </div>
  );
};

export default SoloPlayMIDIHandler;
