import { detect } from "@tonaljs/chord-detect";
import { AnimatePresence, motion } from "framer-motion";
import _ from "lodash";
import { useContext, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { Note } from "tonal";
import { v4 as uuidv4 } from "uuid";
import { WebMidi } from "webmidi";
import { ProUserContext, UsernameContext } from "../pages/home";
import { KeyContext, MidiInputContext, ThemeContext } from "../pages/main";
import * as utils from "../utils/determineColors";
import { getItem } from "../utils/localStorage";
import { darkModeFontColor, lightModeFontColor } from "../utils/styles";
import Piano from "./Piano";
import BronzeTrophySvg from "./svg/BronzeTrophySvg";
import GoldTrophySvg from "./svg/GoldTrophySvg";
import PracticeModeSvgTop from "./svg/PracticeModeSvgTop";
import SilverTrophySvg from "./svg/SilverTrophySvg";

interface User {
  username: string;
  profileImageUrl: string | null;
  score: number;
}

interface Props {
  socket: Socket;
  startTimer: boolean;
  index: number;
  targetChord: string;
  minutesToPractice: number;
  totalChords: number;
  onNextChord: (nextIndex: number) => void;
  onUpdateRankings: (username: string, newScore: number) => void;
  users: User[];
  isGameOver: boolean;
  goBackToSetup: () => void;
}

const MultiPlayerMIDIHandler = ({
  socket,
  startTimer,
  index,
  targetChord,
  minutesToPractice,
  totalChords,
  onNextChord,
  onUpdateRankings,
  users,
  isGameOver,
  goBackToSetup,
}: Props) => {
  const midiNumbers = useRef<number[]>([]);
  const [pitchValues, setPitchValues] = useState<number[]>([]);
  const { theme } = useContext(ThemeContext);

  const { midiInputs } = useContext(MidiInputContext);
  const { key } = useContext(KeyContext);
  const [isFootPedalPressed, setIsFootPedalPressed] = useState(false);

  const [minute, setMinute] = useState(minutesToPractice);
  const [second, setSecond] = useState(0);

  const secondRef = useRef(second);
  const minuteRef = useRef(minute);

  const [showResultScreen, setShowResultScreen] = useState(false);

  const [firstToSolveText, setFirstToSolveText] = useState("");
  const { username } = useContext(UsernameContext);

  let timerId: NodeJS.Timeout | null = null;

  const targetChordRef = useRef(targetChord);
  const indexRef = useRef(index);
  const isGameOverRef = useRef(isGameOver);
  const { isProUser } = useContext(ProUserContext);

  useEffect(() => {
    if (minute >= 0 && startTimer) {
      timerId = setInterval(() => {
        if (!isGameOver) {
          if (second > 0) {
            secondRef.current--;
            setSecond(second - 1);
          } else if (minute > 0) {
            minuteRef.current--;
            setMinute(minute - 1);
            setSecond(59);
          } else {
            setShowResultScreen(true);
            clearInterval(timerId!);
          }
        }
      }, 1000); // decrement every 1000ms (1 second)
    }

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [isGameOver, startTimer, minute, second]);

  useEffect(() => {
    if (WebMidi !== undefined) {
      midiInputs.forEach((input) => {
        input.removeListener("midimessage");
        input.addListener("noteon", handleMIDIMessage);
        input.addListener("noteoff", handleMIDIMessage);
        input.addListener("midimessage", handleSustainPedalMessage);
      });
    }

    setIsFootPedalPressed(false);
    setPitchValues([]);
    midiNumbers.current = [];
  }, [midiInputs]);

  useEffect(() => {
    socket.on("first_to_solve", async (obj) => {
      const name = obj.username === `@${username}` ? "You" : obj.username;
      setFirstToSolveText(`${name} answered first!`);

      await new Promise((resolve) => setTimeout(resolve, 500));

      setFirstToSolveText("");
      onUpdateRankings(obj.username, obj.score);
      onNextChord(indexRef.current);
    });
  }, []);

  useEffect(() => {
    if (!isGameOver) {
      targetChordRef.current = targetChord;
      indexRef.current = index;
      isGameOverRef.current = isGameOver;
    } else {
      setShowResultScreen(true);
      clearInterval(timerId!);
    }
  }, [isGameOver, targetChord, index]);

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
        !(minuteRef.current === 0 && secondRef.current === 0)
      ) {
        if (!isGameOverRef.current) {
          socket.emit("user_answered", { currentChord: indexRef.current });
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
      {/* <PremiumButton /> */}
      {showResultScreen && (
        <div className="flex justify-center items-center h-screen">
          <div
            className={`z-10 relative mt-[32px] rounded-2.5xl w-[482px] h-[480px]`}
            style={{
              backgroundColor: utils.determineBackgroundColorReverse(),
            }}
          >
            <div className="z-20 absolute top-[-66px] left-[180px]">
              <PracticeModeSvgTop />
            </div>
            <div
              className={`flex flex-col items-center absolute top-[3px] left-[3px] rounded-2.5xl w-[473px] h-[470px] p-[21px]`}
              style={{
                backgroundColor: utils.determineBackgroundColorForCard2(),
              }}
            >
              <div>
                <p
                  className="mt-[60px] text-[20px] font-bold"
                  style={{
                    color: utils.determineFontColor(),
                  }}
                >
                  Leaderboard
                </p>
              </div>
              <div className="overflow-y-auto h-[260px] no-scrollbar">
                <div className="flex flex-col gap-2">
                  {_.orderBy(users, "score", "desc").map((user, index) => (
                    <div key={index} className="flex items-center gap-[10px]">
                      <div className="w-[30px] flex justify-center">
                        {index === 0 && <GoldTrophySvg />}
                        {index === 1 && <SilverTrophySvg />}
                        {index === 2 && <BronzeTrophySvg />}
                        {index > 2 && (
                          <p
                            className="text-[16px] font-bold"
                            style={{
                              color: utils.determineFontColor(),
                            }}
                          >
                            {index + 1}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center">
                        {user.profileImageUrl !== null ? (
                          <div className="inline-block h-14 w-14 overflow-hidden rounded-full">
                            <img
                              src={user.profileImageUrl}
                              alt="pic"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <span
                            className={`inline-block h-14 w-14 overflow-hidden rounded-full bg-gray-100`}
                          >
                            <svg
                              className="h-full w-full text-gray-300"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </span>
                        )}
                      </div>
                      <div key={index}>
                        {" "}
                        <p
                          className="text-[16px] font-bold w-[200px] overflow-x-auto no-scrollbar"
                          style={{
                            color: utils.determineFontColor(),
                          }}
                        >
                          {user.username === `@${username}`
                            ? "You"
                            : user.username}
                        </p>
                      </div>
                      <div key={uuidv4()}>
                        {" "}
                        <p
                          className="text-[16px] font-bold"
                          style={{
                            color: utils.determineFontColor(),
                          }}
                        >
                          {`${user.score} / ${totalChords}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className={`cursor-pointer flex justify-center items-center rounded-4xl w-[120px] h-[50px] mt-[20px]`}
                onClick={goBackToSetup}
                style={{
                  backgroundColor: utils.determineBackgroundColorReverse(),
                }}
              >
                <p
                  className={`text-[20px] text-center`}
                  style={{
                    color: utils.determineFontColorReverse(),
                  }}
                >
                  Leave
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={`${showResultScreen && "fixed inset-0 opacity-20"}`}>
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
        {startTimer && (
          <div
            className={`absolute right-[30px] ${
              isProUser ? "top-[30px]" : "top-[120px]"
            }`}
          >
            <div className="overflow-y-auto h-[360px] no-scrollbar">
              <div className="flex flex-col gap-2">
                {_.orderBy(users, "score", "desc").map((user, index) => (
                  <div key={index} className="flex items-center gap-[10px]">
                    <div className="flex items-center">
                      {user.profileImageUrl !== null ? (
                        <div className="inline-block h-14 w-14 overflow-hidden rounded-full">
                          <img
                            src={user.profileImageUrl}
                            alt="pic"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <span
                          className={`inline-block h-14 w-14 overflow-hidden rounded-full bg-gray-100`}
                        >
                          <svg
                            className="h-full w-full text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <div key={index}>
                      {" "}
                      <p
                        className="text-[16px] font-bold w-[200px] overflow-x-auto no-scrollbar"
                        style={{
                          color: utils.determineFontColor(),
                        }}
                      >
                        {user.username}
                      </p>
                    </div>

                    <div key={`${index}+${uuidv4()}`}>
                      {" "}
                      <p
                        className="text-[16px] font-bold"
                        style={{
                          color: utils.determineFontColor(),
                        }}
                      >
                        {`${user.score} / ${totalChords}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <AnimatePresence>
          {firstToSolveText.length > 0 && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="absolute top-[20px]"
            >
              <div className="flex justify-center w-screen h-screen">
                <div
                  className="w-fit h-fit rounded-4xl"
                  style={{
                    backgroundColor: "white",
                  }}
                >
                  <p
                    className={`text-[14px] text-center p-[15px]`}
                    style={{
                      color: "black",
                    }}
                  >
                    {firstToSolveText}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
        {midiInputs.length === 0 ? (
          <div className="absolute top-[40%] w-full flex flex-col items-center leading-8">
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
          </div>
        ) : (
          startTimer && (
            <div className="flex flex-col mt-[80px] items-center">
              <p
                className="text-[20px]"
                style={{
                  color: utils.determineFontColor(),
                }}
              >{`${indexRef.current} / ${totalChords}`}</p>
              <div
                className="text-[64px] mt-[30px] font-bold"
                style={{
                  color: utils.determineFontColor(),
                }}
              >
                {targetChord}
              </div>
            </div>
          )
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

export default MultiPlayerMIDIHandler;
