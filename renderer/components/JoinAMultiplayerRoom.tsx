import { useContext, useEffect, useRef, useState } from "react";
import { Manager, Socket } from "socket.io-client";
import { ProfileImageUrlContext, UsernameContext } from "../pages/home";
import * as utils from "../utils/determineColors";
import { API_BASE_URL } from "../utils/globalVars";
import MultiPlayerMIDIHandler from "./MultiplayerMidiHandler";
import BackArrowSvg from "./svg/BackArrowSvg";
import PracticeModeSvgTop from "./svg/PracticeModeSvgTop";
import _ from "lodash";

interface Props {
  onGoingBackToSetup: () => void;
}

interface User {
  username: string;
  profileImageUrl: string | null;
  score: number;
}

const JoinAMultiplayerRoom = ({ onGoingBackToSetup }: Props) => {
  const divRefs = useRef([]);
  const socketRef = useRef<Socket>(null);
  const webSocketUrlRef = useRef<string>("");
  const [errorPlaceholder, setErrorPlaceholder] = useState("");
  const { profileImageUrl } = useContext(ProfileImageUrlContext);
  const { username } = useContext(UsernameContext);
  const [showWaitingScreen, setShowWaitingScreen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [showGame, setShowGame] = useState(false);

  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdownValue, setCountdownValue] = useState(3);
  const countdownValueRef = useRef(countdownValue);

  const chordsRef = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [numberOfChords, setNumberOfChords] = useState(10);
  const [numberOfMinutes, setNumberOfMinutes] = useState(5);
  const usersRef = useRef<User[]>(users);

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
          profileImageUrl: profileImageUrl,
        });

        socketRef.current.on("validate_code_response", (obj) => {
          if (obj.message === "true") {
            setShowWaitingScreen(true);
          } else {
            setErrorPlaceholder(obj.message);
          }
        });

        socketRef.current.on("user_joined", (obj) => {
          setUsers(obj);
        });

        socketRef.current.on("disconnect", (obj) => {
          setUsers([]);
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

  const handleInputChange = (event, index) => {
    setErrorPlaceholder("");
    const { value } = event.target;

    // onSetCode((prevInputValues) => {
    //   let newInputValues = prevInputValues.substr(0, index) + value;
    //   if (index < prevInputValues.length - 1) {
    //     newInputValues += prevInputValues.substr(index + 1);
    //   }
    //   return newInputValues;
    // });

    if (value.length === 1 && index < divRefs.current.length - 1) {
      divRefs.current[index + 1].focus();
    }

    const allDivsHaveValues = divRefs.current.every((div) => {
      return div.value.trim() !== ""; // or div.textContent.trim() !== ''
    });

    if (allDivsHaveValues) {
      socketRef.current.emit("validate_code", {
        code: divRefs.current.map((div) => div.value).join(""),
      });
    }
  };

  const handleKeyDown = (event, index) => {
    if (
      event.key === "Backspace" &&
      index > 0 &&
      event.target.value.length === 0
    ) {
      divRefs.current[index - 1].focus();
    }
  };

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
  const goBackToSetup = () => {
    socketRef.current.disconnect();
    onGoingBackToSetup();
  };

  return !showGame ? (
    <div className="flex justify-center items-center h-screen">
      {!showWaitingScreen ? (
        <div
          className={`relative mt-[32px] rounded-2.5xl w-[769px] h-[300px]`}
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
            className={`absolute top-[3px] left-[3px] rounded-2.5xl w-[760px] h-[290px] p-[21px]`}
            style={{
              backgroundColor: utils.determineBackgroundColorForCard2(),
            }}
          >
            <div className="mt-[60px] flex flex-col items-center justify-center">
              <p
                className={`text-[20px] font-bold text-center w-[257px]`}
                style={{
                  color: utils.determineFontColor(),
                }}
              >
                To join a room, please enter the 4-digit code.
              </p>
              <div>
                <div className="mt-[30px] flex gap-[10px]">
                  {[...Array(4)].map((_, index) => (
                    <input
                      className="text-[20px] text-center border-[1px] rounded-md w-[38px] h-[50px] focus:outline-none"
                      key={index}
                      ref={(ref) => (divRefs.current[index] = ref)}
                      style={{
                        borderColor: utils.determineBorderColor(),
                        backgroundColor:
                          utils.determineBackgroundColorForAccessCodeComponent(),
                        color: utils.determineFontColor(),
                      }}
                      maxLength={1}
                      onChange={(event) => handleInputChange(event, index)}
                      onKeyDown={(event) => handleKeyDown(event, index)}
                    />
                  ))}
                </div>
                {errorPlaceholder.length > 0 && (
                  <div className="mt-[10px]">
                    <div
                      className="text-[16px] text-center"
                      style={{
                        color: utils.determineErrorColor(),
                        fontSize: "16px",
                        maxWidth: "250px",
                        textAlign: "center",
                        overflowWrap: "break-word",
                      }}
                    >
                      {errorPlaceholder}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* <div
          className="absolute bottom-[20px] right-[20px]"
          // onClick={() => setShowAboutToStartScreen(true)}
        >
          <EnterModeArrow />
        </div> */}
        </div>
      ) : (
        <div
          className={`relative mt-[32px] rounded-2.5xl w-[448px] h-[415px]`}
          style={{
            backgroundColor: utils.determineBackgroundColorReverse(),
          }}
        >
          <div className="z-20 absolute top-[-66px] left-[160px]">
            <PracticeModeSvgTop />
          </div>
          <div
            className="cursor-pointer z-20 absolute top-[28px] left-[28px]"
            onClick={() => {
              socketRef.current.disconnect();
              setShowWaitingScreen(false);
            }}
          >
            <BackArrowSvg />
          </div>
          <div
            className={`absolute top-[3px] left-[3px] rounded-2.5xl w-[439px] h-[405px] p-[21px]`}
            style={{
              backgroundColor: utils.determineBackgroundColorForCard2(),
            }}
          >
            <div className="mt-[60px] flex flex-col items-center justify-center gap-[20px]">
              <p
                className={`text-[20px] font-bold text-center w-[260px]`}
                style={{
                  color: utils.determineFontColor(),
                }}
              >
                You're in! The game will start shortly.
              </p>
              <p
                className={`text-[20px] font-bold text-center w-[349px]`}
                style={{
                  color: utils.determineFontColor(),
                }}
              >
                Until then, check out the competition!{" "}
              </p>
              <div className="overflow-y-auto h-[180px] no-scrollbar">
                <div className="flex flex-col gap-[10px]">
                  {users.map((user, index) => (
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

export default JoinAMultiplayerRoom;
