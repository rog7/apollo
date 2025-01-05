import { detect } from "@tonaljs/chord-detect";
import { useContext, useEffect, useRef, useState } from "react";
import Soundfont from "soundfont-player";
import { Note, Progression } from "tonal";
import { WebMidi } from "webmidi";
import {
  AIRecommendationIntervalContext,
  EnableSoundContext,
  KeyContext,
  MidiInputContext,
  MidiOutputContext,
  ThemeContext,
} from "../pages/main";
import convertChordToCorrectKey from "../utils/chordConversion";
import * as utils from "../utils/determineColors";
import {
  API_BASE_URL,
  HOLD_PEDAL_CONTROL_NUMBER,
  MAX_LENGTH_FOR_RECOMMENDATIONS,
  NOTE_OFF,
  NOTE_ON,
} from "../utils/globalVars";
import { getItem, setItem } from "../utils/localStorage";
import { darkModeFontColor, lightModeFontColor } from "../utils/styles";
import Piano from "./Piano";
import RecommendationNotification from "./RecommendationNotification";

const MIDIHandler = () => {
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
  let midiDataArray: number[][] = [];

  let initialTimestamp: number | null = null;
  let previousTimestamp: number | null = null;
  const enableSoundRef = useRef(true);

  const { enableSound } = useContext(EnableSoundContext);

  const { recommendationInterval } = useContext(
    AIRecommendationIntervalContext
  );

  const [isRecommendationsEnabled, setIsRecommendationsEnabled] = useState(
    getItem("show-ai-recommendations") == "true"
  );
  const [showRecProgressBar, setShowRecProgressBar] = useState(
    getItem("show-rec-progress-bar") == "true"
  );
  const [progress, setProgress] = useState(0);

  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const [showRecommendationNotification, setShowRecommendationNotification] =
    useState(false);
  const [playRecommendation, setPlayRecommendation] = useState(false);
  const playRecommendationRef = useRef(false);
  const isPausedRef = useRef(false);
  const [recommendedMidiInformation, setRecommendedMidiInformation] = useState<
    number[][]
  >([]);
  const [recommendedMidiKey, setRecommendedMidiKey] = useState("");

  const { midiOutputs } = useContext(MidiOutputContext);
  const playbackSpeedRef = useRef(1);
  const shouldUserBeAbleToTriggerMidiRef = useRef(true);

  const playingNotes: { [pitch: number]: any } = {};
  const keyPressNotes: { [pitch: number]: boolean } = {};
  let sustainPedalDown = false;
  let playerRef = useRef<Soundfont.Player | null>(null);
  const [eligibleToPlayRecommendation, setEligibleToPlayRecommendation] =
    useState(false);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    Soundfont.instrument(new AudioContext(), "acoustic_grand_piano").then(
      (piano) => {
        playerRef.current = piano;
      }
    );
  }, []);

  function startRecommendationInterval() {
    intervalIdRef.current = setInterval(() => {
      getRecommendation();
    }, 60000 * recommendationInterval);
  }

  // Call the interval function when the component mounts
  useEffect(() => {
    if (isRecommendationsEnabled && !showRecommendationNotification) {
      startRecommendationInterval();
    } else {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }

    // Cleanup function to clear the interval when the component unmounts
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [isRecommendationsEnabled, showRecommendationNotification]);

  useEffect(() => {
    const handleMidi = (midiMessage: number[]) => {
      if (midiMessage[0] == 1) {
        midiOutputs.forEach((output) =>
          output.sendNoteOn(midiMessage[1], {
            channels: 1,
            rawAttack: midiMessage[2],
          })
        );
        handleMIDIMessageFromRecommendation(NOTE_ON, midiMessage[1]);
        if (enableSoundRef.current) {
          noteOnListener(midiMessage[1], midiMessage[2]);
        }
      } else if (midiMessage[0] == 0) {
        midiOutputs.forEach((output) =>
          output.sendNoteOff(midiMessage[1], {
            channels: 1,
            rawRelease: midiMessage[2],
          })
        );
        handleMIDIMessageFromRecommendation(NOTE_OFF, midiMessage[1]);
        if (enableSoundRef.current) {
          noteOffListener(midiMessage[1]);
        }
      } else {
        midiOutputs.forEach((output) => {
          output.send([midiMessage[0], midiMessage[1], midiMessage[2]]);
        });
        handleSustainPedalMessageForRecommendation(midiMessage[2]);
        if (enableSoundRef.current) {
          controlChangeListener(midiMessage[2]);
        }
      }
    };

    const processMidiMessages = async () => {
      clearState();
      for (const midiMessage of recommendedMidiInformation) {
        // Pause the loop until playRecommendationRef.current becomes true
        while (!playRecommendationRef.current) {
          if (shouldUserBeAbleToTriggerMidiRef.current) return;
          await delay(10); // Check every 100 milliseconds (adjust as needed)
        }
        await delay(midiMessage[3] * (1 / playbackSpeedRef.current));
        handleMidi(midiMessage);
      }
    };

    console.log({ playRecommendation, "isPausedRef: ": isPausedRef.current });
    if (playRecommendation && !isPausedRef.current) {
      shouldUserBeAbleToTriggerMidiRef.current = false;
      processMidiMessages().then(() => {
        clearState();
        setPlayRecommendation(false);
        playRecommendationRef.current = false;
        isPausedRef.current = false;
        shouldUserBeAbleToTriggerMidiRef.current = true;
        midiOutputs.forEach((output) => {
          output.sendAllSoundOff({ channels: 1 });
          output.sendControlChange("holdpedal", 127, { channels: 1 });
          output.sendControlChange("holdpedal", 0, { channels: 1 });
        });
      });
    }

    if (showRecommendationNotification) {
      if (playRecommendationRef.current && midiNumbers.current.length == 0) {
        clearState();
        shouldUserBeAbleToTriggerMidiRef.current = false;
        midiDataArray = [];
        initialTimestamp = null;
        previousTimestamp = null;
      }
    } else {
      delay(100).then(() => {
        clearState();
        shouldUserBeAbleToTriggerMidiRef.current = true;
        isPausedRef.current = false;
      });
    }
  }, [playRecommendation, showRecommendationNotification]);

  useEffect(() => {
    if (WebMidi !== undefined) {
      midiInputs.forEach((input) => {
        input.removeListener("midimessage");
        input.addListener("noteon", handleMIDIMessage);
        input.addListener("noteoff", handleMIDIMessage);
        input.addListener("midimessage", handleSustainPedalMessage);
      });
    }

    clearState();
  }, [midiInputs]);

  useEffect(() => {
    enableSoundRef.current = enableSound;

    if (!enableSoundRef.current) {
      for (let pitch = 0; pitch < 128; pitch++) {
        noteOffListener(pitch);
      }
      controlChangeListener(0);
    }
  }, [enableSound]);

  const noteOnListener = (pitch: number, velocity: number) => {
    if (enableSoundRef.current) {
      // noteOn
      playingNotes[pitch] = playerRef.current.play(
        String(pitch),
        velocity / 127
      );
    }

    keyPressNotes[pitch] = true;
  };

  const noteOffListener = (pitch: number) => {
    // noteOff
    if (!sustainPedalDown) {
      if (playingNotes[pitch]) {
        playingNotes[pitch].stop();
        delete playingNotes[pitch];
      }
    }
    delete keyPressNotes[pitch];
  };

  const controlChangeListener = (value: number) => {
    // sustain pedal (CC 64)
    sustainPedalDown = value >= 64; // 64 is the threshold for sustain pedal down

    // stop all sustained notes when sustain pedal is released
    if (!sustainPedalDown) {
      Object.keys(playingNotes).forEach((pitch) => {
        if (!keyPressNotes[pitch]) {
          playingNotes[pitch].stop();
          delete playingNotes[pitch];
        }
      });
    }
  };

  const clearState = () => {
    setIsFootPedalPressed(false);
    setPitchValues([]);
    midiSetUpComplete.current = true;
    chord.current = "";
    altChords.current = [""];
    midiBuffer.current = [];
    midiNumbers.current = [];
    midiOutputs.forEach((output) => {
      output.sendAllSoundOff({ channels: 1 });
      output.sendControlChange("holdpedal", 127, { channels: 1 });
      output.sendControlChange("holdpedal", 0, { channels: 1 });
    });
  };

  const processMIDIMessageForRecommendations = (
    status: number,
    pitch: number,
    velocity: number
  ) => {
    // Collect MIDI data with normalized timestamp
    const currentTimestamp = Date.now();
    // OPENAI can only process vector embeddings that are less than around 100,000
    // There shouldn't be a long space between MIDI messages
    if (initialTimestamp === null) {
      initialTimestamp = currentTimestamp;
      previousTimestamp = currentTimestamp;
      midiDataArray = [];
    }

    if (midiDataArray.length < MAX_LENGTH_FOR_RECOMMENDATIONS) {
      // The max elapsed time between two MIDI messages is 2 second. There shouldn't be a long space between MIDI messages
      const normalizedTimestamp = Math.min(
        currentTimestamp - previousTimestamp,
        2000
      );
      previousTimestamp = currentTimestamp;
      midiDataArray.push([status, pitch, velocity, normalizedTimestamp]);
      setProgress(
        Math.floor(
          (midiDataArray.length / MAX_LENGTH_FOR_RECOMMENDATIONS) * 100
        )
      );
    }

    // Check if enough data is collected
    if (midiDataArray.length == MAX_LENGTH_FOR_RECOMMENDATIONS) {
      if (showRecProgressBar) {
        delay(1000).then(() => {
          setShowRecProgressBar(false);
          setItem("show-rec-progress-bar", false);
          storeMidiDataAndGenerateEmbeddingForRecommendations(midiDataArray);
          midiDataArray = []; // Clear the array after processing
          initialTimestamp = null; // Reset the initial timestamp
          previousTimestamp = null;
        });
      } else {
        storeMidiDataAndGenerateEmbeddingForRecommendations(midiDataArray);
        midiDataArray = []; // Clear the array after processing
        initialTimestamp = null; // Reset the initial timestamp
        previousTimestamp = null;
      }
    }
  };

  // Function to handle incoming MIDI data
  function handleMIDIMessage(event: any) {
    if (!shouldUserBeAbleToTriggerMidiRef.current) {
      return;
    }
    if (event.data.length === 3 && !playRecommendation) {
      const [status, pitch, velocity] = event.data;
      const type = event.type as string;

      processMIDIMessageForRecommendations(
        type === NOTE_ON ? 1 : 0,
        pitch,
        velocity
      );

      if (type == NOTE_ON) {
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
      } else if (type == NOTE_OFF) {
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
    }
  }

  function handleMIDIMessageFromRecommendation(type: string, pitch: number) {
    if (type == NOTE_ON) {
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
    } else if (type == NOTE_OFF) {
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
  }

  const storeMidiDataAndGenerateEmbeddingForRecommendations = async (
    midiDataArray: number[][]
  ) => {
    const obj = {
      midiDataArray,
    };

    try {
      await fetch(`${API_BASE_URL}/api/users/store_embedding`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + getItem("auth-token"),
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify(obj),
      });
    } catch (error) {
      console.error("Error storing MIDI data:", error);
    }
  };

  const getRecommendation = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/recommendations`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + getItem("auth-token"),
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        if (data.result !== null) {
          const username = data.result.username;
          const midiInformation = JSON.parse(data.result.recommendation);

          setShowRecommendationNotification(true);
          setRecommendedMidiInformation(midiInformation);
          setRecommendedMidiKey(data.result.id);
          setEligibleToPlayRecommendation(data.result.should_play);
        }
      }
    } catch (error) {
      console.error("Error storing MIDI data:", error);
    }
  };

  function handleSustainPedalMessage(event: any) {
    if (!shouldUserBeAbleToTriggerMidiRef.current) {
      return;
    }

    const [status, controlNumber, pedalValue] = event.data;

    if (controlNumber == HOLD_PEDAL_CONTROL_NUMBER) {
      if (midiDataArray.length > 0) {
        // The recording shouldn't start with a sustain pedal message
        processMIDIMessageForRecommendations(
          status,
          HOLD_PEDAL_CONTROL_NUMBER,
          pedalValue
        );
      }

      if (pedalValue >= 64) {
        setIsFootPedalPressed(true);
      } else {
        setIsFootPedalPressed(false);
      }
    }
  }

  function handleSustainPedalMessageForRecommendation(pedalValue: number) {
    if (pedalValue >= 64) {
      setIsFootPedalPressed(true);
    } else {
      setIsFootPedalPressed(false);
    }
  }

  const handlePlayRecommendation = (shouldPlay: boolean) => {
    playRecommendationRef.current = shouldPlay;
    if (!playRecommendationRef.current) {
      isPausedRef.current = true;
    }
    setPlayRecommendation(shouldPlay);
  };

  const handlePlaybackSpeedChange = (playbackSpeed: number) => {
    playbackSpeedRef.current = playbackSpeed;
  };

  const handleSubmitRating = async (rating: number) => {
    const obj = {
      midiKey: recommendedMidiKey,
      rating,
    };

    try {
      await fetch(`${API_BASE_URL}/api/users/submit_rating`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + getItem("auth-token"),
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify(obj),
      });
    } catch (error) {
      console.error("Error storing MIDI data:", error);
    }
  };
  return (
    <div>
      <div className="absolute z-10">
        <RecommendationNotification
          showRecommendationNotification={showRecommendationNotification}
          setShowRecommendationNotification={setShowRecommendationNotification}
          onPlayRecommendation={handlePlayRecommendation}
          playRecommendation={playRecommendationRef.current}
          onPlaybackSpeedChange={handlePlaybackSpeedChange}
          onSubmitRating={handleSubmitRating}
          eligibleToPlayRecommendation={eligibleToPlayRecommendation}
        />
      </div>
      <div className="absolute top-[5%] right-[40%]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <button
              type="button"
              className="cursor-pointer relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent focus:outline-none"
              style={{
                backgroundColor: utils.determineBackgroundColorReverse(),
              }}
              role="switch"
              aria-checked="false"
              aria-labelledby="annual-billing-label"
              onClick={() => {
                setIsRecommendationsEnabled(!isRecommendationsEnabled);
                setItem("show-ai-recommendations", !isRecommendationsEnabled);
              }}
            >
              <span
                aria-hidden="true"
                className={`inset-0 cursor-pointer inline-block w-5 h-5 ${
                  !isRecommendationsEnabled ? "translate-x-0" : "translate-x-5"
                } rounded-full`}
                style={{
                  backgroundColor: utils.determineBackgroundColor(),
                }}
              >
                {!isRecommendationsEnabled ? (
                  <svg fill="none" viewBox="0 0 12 12">
                    <path
                      d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                      stroke={utils.determineBackgroundColorReverse()}
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg fill="none" viewBox="0 0 24 24">
                    <path
                      d="M5 13l4 4L19 7"
                      stroke={utils.determineBackgroundColorReverse()}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
            </button>
            <span className="ml-3 text-sm" id="annual-billing-label">
              <span
                className="font-medium"
                style={{
                  color:
                    theme === "light-mode"
                      ? lightModeFontColor
                      : darkModeFontColor,
                }}
              >
                AI Recommendations
              </span>
            </span>
          </div>
          {showRecProgressBar && isRecommendationsEnabled && (
            <div className="flex flex-col gap-1">
              <div className="overflow-hidden rounded-full bg-gray-400 relative h-5">
                <div
                  style={{ width: progress + "%" }}
                  className="h-5 rounded-full bg-black"
                />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white">
                  {progress + "%"}
                </span>
              </div>
              <div className="flex justify-center">
                <p
                  className="text-[10px] w-[160px] text-center"
                  style={{
                    color:
                      theme === "light-mode"
                        ? lightModeFontColor
                        : darkModeFontColor,
                  }}
                >
                  AI calibration in progress. Play to unlock tailored
                  recommendations.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
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
