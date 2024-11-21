import { useContext, useEffect, useRef, useState } from "react";
import { Manager, Socket } from "socket.io-client";
import { Chord, ChordType } from "tonal";
import {
  ProfileImageUrlContext,
  ProUserContext,
  UsernameContext,
} from "../pages/home";
import * as utils from "../utils/determineColors";
import { API_BASE_URL } from "../utils/globalVars";
import MultiPlayerMIDIHandler from "./MultiplayerMidiHandler";
import BackArrowSvg from "./svg/BackArrowSvg";
import EnterModeArrow from "./svg/EnterModeArrow";
import PracticeModeSvgTop from "./svg/PracticeModeSvgTop";
import _ from "lodash";
import { ShowPricingTableContext } from "../pages/main";
import { generateChords } from "../utils/generateChords";
import React from "react";

interface Props {
  onGoingBackToSetup: () => void;
}

interface User {
  username: string;
  profileImageUrl: string | null;
  score: number;
}

const CreateAMultiplayerRoom = ({ onGoingBackToSetup }: Props) => {
  const [showWaitingScreen, setShowWaitingScreen] = useState(false);
  const [numberOfChords, setNumberOfChords] = useState(10);
  const [numberOfMinutes, setNumberOfMinutes] = useState(5);
  const [levelOfDifficulty, setLevelOfDifficulty] = useState("Easy");

  const { profileImageUrl } = useContext(ProfileImageUrlContext);
  const { username } = useContext(UsernameContext);

  const numberOfChordsOptions = [10, 20, 30, 40, 50];
  const numberOfMinutesOptions = [5, 10, 15, 20, 25, 30];
  const levelOfDifficultyOptions = ["Easy", "Medium", "Hard"];

  const [code, setCode] = useState("");
  const socketRef = useRef<Socket>(null);
  const webSocketUrlRef = useRef<string>("");

  const personalUserInfo = {
    username: `@${username}`,
    profileImageUrl,
    score: 0,
  };

  const [users, setUsers] = useState<User[]>([personalUserInfo]);

  const [showGame, setShowGame] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(true);
  const [countdownValue, setCountdownValue] = useState(3);
  const countdownValueRef = useRef(countdownValue);
  const [currentIndex, setCurrentIndex] = useState(0);

  const generatedChordsRef = useRef([]);

  const chordsRef = useRef([]);
  const usersRef = useRef<User[]>(users);

  const { setShowPricingTable } = useContext(ShowPricingTableContext);
  const { isProUser } = useContext(ProUserContext);

  useEffect(() => {
    const fetchWebSocketUrl = async () => {
      try {
        // fetch websocket url
        const response = await fetch(`${API_BASE_URL}/api/socket/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
        });

        if (response.status) {
          const data = await response.json();

          webSocketUrlRef.current = data.webSocketUrl;
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (!showWaitingScreen) {
      fetchWebSocketUrl().then(() => {
        const manager = new Manager(webSocketUrlRef.current);
        socketRef.current = manager.socket("/");

        socketRef.current.emit("set_values", {
          username: `@${username}`,
          profileImageUrl: profileImageUrl === "" ? null : profileImageUrl,
        });

        socketRef.current.on("room_created", (obj) => {
          setCode(obj.code);
          setShowWaitingScreen(true);
        });

        socketRef.current.on("user_joined", (obj) => {
          setUsers(obj);
        });

        socketRef.current.on("disconnect", (obj) => {
          setUsers([personalUserInfo]);
          setShowWaitingScreen(false);
        });

        socketRef.current.on("start_game", (obj) => {
          setCountdownValue(3);
          countdownValueRef.current = 3;
          setNumberOfChords(obj.numberOfChords);
          setNumberOfMinutes(obj.numberOfMinutes);
          chordsRef.current = obj.chords;

          setShowGame(true);
          setIsCountingDown(true);
          handleCountdown();
        });
      });
    }
  }, [showWaitingScreen]);

  useEffect(() => {
    usersRef.current = users;
  }, [users]);

  const handleCountdown = () => {
    const timerId = setInterval(() => {
      if (countdownValueRef.current != 1) {
        setCountdownValue((countdownValueRef.current -= 1));
      } else {
        setIsCountingDown(false);
      }
    }, 1000);

    setTimeout(() => clearInterval(timerId), 3500);
  };

  const createRoom = () => {
    generatedChordsRef.current = generateChords(
      levelOfDifficulty,
      numberOfChords
    ).map((result) => result.symbol);

    socketRef.current.emit("create_room", {
      numberOfChords,
      numberOfMinutes,
      levelOfDifficulty,
      chords: generatedChordsRef.current,
    });
  };

  const closeRoom = () => {
    socketRef.current.emit("close_room");
    setShowWaitingScreen(false);
  };

  const initiateGame = () => {
    socketRef.current.emit("initiate_game");
  };

  const goBackToSetup = () => {
    socketRef.current.disconnect();
    onGoingBackToSetup();
  };

  const handleNextChord = (nextIndex: number) => {
    setCurrentIndex(nextIndex);
  };

  const handleUpdateRankings = (username: string, newScore: number) => {
    const sortedUsers = _.orderBy(usersRef.current, "score", "desc");
    setUsers(
      sortedUsers.map((user) =>
        user.username === username ? { ...user, score: newScore } : user
      )
    );
  };

  return !showGame ? (
    <div className="flex justify-center items-center h-screen">
      {!showWaitingScreen ? (
        <div
          className={`relative mt-[32px] rounded-2.5xl w-[769px] h-[368px]`}
          style={{
            backgroundColor: utils.determineBackgroundColorReverse(),
          }}
        >
          <div className="z-20 absolute top-[-66px] left-[320px]">
            <PracticeModeSvgTop />
          </div>
          <div
            className="cursor-pointer z-20 absolute top-[28px] left-[28px]"
            onClick={goBackToSetup}
          >
            <BackArrowSvg />
          </div>
          <div
            className={`absolute top-[3px] left-[3px] rounded-2.5xl w-[760px] h-[358px] p-[21px]`}
            style={{
              backgroundColor: utils.determineBackgroundColorForCard2(),
            }}
          >
            <div className="mt-[60px] flex flex-col items-center">
              <div>
                <p
                  className={`text-[20px] font-bold text-center`}
                  style={{
                    color: utils.determineFontColor(),
                  }}
                >
                  You've picked
                </p>
              </div>
              <div>
                <p
                  className={`text-[32px] font-bold text-center`}
                  style={{
                    color: utils.determineFontColor(),
                  }}
                >
                  Create a Room!
                </p>
              </div>
            </div>
            <div>
              <p
                className={`mt-[20px] text-[20px] font-light text-center`}
                style={{
                  color: utils.determineFontColor(),
                }}
              >
                Fill out the boxes below to start your practice session.
              </p>
            </div>
            <div className="mt-[25px] flex gap-[74px] justify-center">
              <div className="flex flex-col items-center gap-[5px]">
                <div>
                  {" "}
                  <p
                    className={`text-[20px] font-bold text-center`}
                    style={{
                      color: utils.determineFontColor(),
                    }}
                  >
                    Number of Chords
                  </p>
                </div>
                <select
                  className={`w-[131px] h-[50px] text-center select select-bordered focus:outline-none`}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (isProUser || value <= 20) {
                      setNumberOfChords(value);
                      if (value > 40) {
                        setLevelOfDifficulty("Medium");
                      }
                    } else {
                      setShowPricingTable(true);
                      e.target.value = String(numberOfChords); // reset the select value to the previous value
                    }
                  }}
                  defaultValue={numberOfChords}
                  style={{
                    color: utils.determineFontColor(),
                    backgroundColor: utils.determineBackgroundColorForCard(),
                  }}
                >
                  {numberOfChordsOptions.map((value, index) => (
                    <option key={index}>{value}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col items-center gap-[5px]">
                <div>
                  {" "}
                  <p
                    className={`text-[20px] font-bold text-center`}
                    style={{
                      color: utils.determineFontColor(),
                    }}
                  >
                    Time (Minutes)
                  </p>
                </div>
                <select
                  className={`w-[131px] h-[50px] text-center select select-bordered focus:outline-none`}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (isProUser || value <= 15) {
                      setNumberOfMinutes(value);
                    } else {
                      setShowPricingTable(true);
                      e.target.value = String(numberOfMinutes); // reset the select value to the previous value
                    }
                  }}
                  defaultValue={numberOfMinutes}
                  style={{
                    color: utils.determineFontColor(),
                    backgroundColor: utils.determineBackgroundColorForCard(),
                  }}
                >
                  {numberOfMinutesOptions.map((value, index) => (
                    <option key={index}>{value}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col items-center gap-[5px]">
                <div>
                  {" "}
                  <p
                    className={`text-[20px] font-bold text-center`}
                    style={{
                      color: utils.determineFontColor(),
                    }}
                  >
                    Level of Difficulty
                  </p>
                </div>
                <select
                  className={`w-[131px] h-[50px] text-center select select-bordered focus:outline-none`}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (isProUser || value === "Easy") {
                      setLevelOfDifficulty(value);
                    } else {
                      setShowPricingTable(true);
                      e.target.value = levelOfDifficulty; // reset the select value to the previous value
                    }
                  }}
                  defaultValue={levelOfDifficulty}
                  value={levelOfDifficulty}
                  style={{
                    color: utils.determineFontColor(),
                    backgroundColor: utils.determineBackgroundColorForCard(),
                  }}
                >
                  {levelOfDifficultyOptions.map((value, index) => (
                    <option
                      key={index}
                      disabled={numberOfChords > 40 && value === "Easy"}
                    >
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div
            className="absolute bottom-[20px] right-[20px]"
            onClick={createRoom}
          >
            <EnterModeArrow />
          </div>
        </div>
      ) : (
        <div
          className={`relative mt-[32px] rounded-2.5xl w-[1010px] h-[393px]`}
          style={{
            backgroundColor: utils.determineBackgroundColorReverse(),
          }}
        >
          <div className="z-20 absolute top-[-66px] left-[445px]">
            <PracticeModeSvgTop />
          </div>
          <div
            className="cursor-pointer z-20 absolute top-[28px] left-[28px]"
            onClick={closeRoom}
          >
            <BackArrowSvg />
          </div>
          <div
            className={`absolute top-[3px] left-[3px] rounded-2.5xl w-[1001px] h-[383px] p-[21px]`}
            style={{
              backgroundColor: utils.determineBackgroundColorForCard2(),
            }}
          >
            <div className="flex flex-col gap-[10px] items-center">
              <div className="mt-[50px] flex items-center gap-[60px] w-[900px] ml-[180px]">
                <div className="flex flex-col gap-[20px] items-center justify-center">
                  <div className="max-w-fit">
                    <p
                      className="text-[20px] font-bold text-center w-[306px]"
                      style={{
                        color: utils.determineFontColor(),
                      }}
                    >
                      Here's your personal room code!
                    </p>
                  </div>
                  <div
                    className="w-[220px] h-[60px] border-[1px] rounded-md flex justify-center items-center"
                    style={{ borderColor: utils.determineBorderColor() }}
                  >
                    <p
                      className="text-[20px]"
                      style={{
                        color: utils.determineFontColor(),
                      }}
                    >
                      {code}
                    </p>
                  </div>
                </div>
                <div
                  className="h-[180px] border-[1px] items-center"
                  style={{ borderColor: utils.determineBorderColor() }}
                ></div>
                <div className="flex flex-col w-[345px]">
                  <div>
                    <p
                      className="text-[20px] font-bold text-center"
                      style={{
                        color: utils.determineFontColor(),
                      }}
                    >
                      Participants
                    </p>
                  </div>
                  <div className="overflow-y-auto h-[190px] no-scrollbar">
                    <div className="mt-[20px] flex flex-col gap-[10px]">
                      {users.map((user, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-[10px]"
                        >
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
                              className="text-[16px] font-bold"
                              style={{
                                color: utils.determineFontColor(),
                              }}
                            >
                              {user.username}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {users.length > 1 && (
                <p
                  className="cursor-pointer flex justify-center items-center rounded-4xl w-[246px] h-[58px]"
                  onClick={initiateGame}
                  style={{
                    backgroundColor: utils.determineBackgroundColorReverse(),
                  }}
                >
                  <span
                    className="text-[22px] text-center"
                    style={{
                      color: utils.determineFontColorReverse(),
                    }}
                  >
                    Start the game
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  ) : (
    <>
      {isCountingDown && (
        <div className="flex justify-center items-center h-screen">
          {" "}
          <p
            className="-mt-[20px] text-[300px] font-bold"
            style={{
              color: utils.determineFontColor(),
            }}
          >
            {countdownValue}
          </p>
        </div>
      )}
      <div className={`fixed inset-0 ${isCountingDown && `opacity-20`}`}>
        <MultiPlayerMIDIHandler
          socket={socketRef.current}
          startTimer={!isCountingDown}
          index={currentIndex + 1}
          targetChord={chordsRef.current[currentIndex]}
          minutesToPractice={numberOfMinutes}
          totalChords={numberOfChords}
          onNextChord={handleNextChord}
          onUpdateRankings={handleUpdateRankings}
          users={users}
          isGameOver={chordsRef.current[currentIndex] === undefined}
          goBackToSetup={goBackToSetup}
        />
      </div>
    </>
  );
};

export default CreateAMultiplayerRoom;
