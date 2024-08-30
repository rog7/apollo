import { useState } from "react";
import * as utils from "../utils/determineColors";
import CreateAMultiplayerRoom from "./CreateAMultiplayerRoom";
import JoinAMultiplayerRoom from "./JoinAMultiplayerRoom";
import BackArrowSvg from "./svg/BackArrowSvg";
import PracticeModeSvgTop from "./svg/PracticeModeSvgTop";

interface Props {
  onGoingBackToInit: () => void;
}

interface User {
  username: string;
  profileImageUrl: string | null;
}

const MultiPlaySetup = ({ onGoingBackToInit }: Props) => {
  const [action, setAction] = useState(""); // join or create

  const handleGoingBackToSetup = () => {
    setAction("");
  };

  return action === "" ? (
    <div className="flex justify-center items-center h-screen">
      <div
        className={`relative mt-[32px] rounded-2.5xl w-[761px] h-[362px]`}
        style={{
          backgroundColor: utils.determineBackgroundColorReverse(),
        }}
      >
        <div className="z-10 absolute top-[-66px] left-[310px]">
          <PracticeModeSvgTop />
        </div>
        <div
          className="cursor-pointer z-20 absolute top-[28px] left-[28px]"
          onClick={onGoingBackToInit}
        >
          <BackArrowSvg />
        </div>
        <div
          className={`absolute top-[3px] left-[3px] rounded-2.5xl w-[752px] h-[352px] p-[21px]`}
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
                Multiplayer!
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
              Are you here to...
            </p>
          </div>
          <div className="mt-[30px] flex gap-[20px] justify-center">
            <div
              className={`cursor-pointer flex justify-center items-center rounded-4xl w-[246px] h-[58px]`}
              onClick={() => setAction("join")}
              style={{
                backgroundColor: utils.determineBackgroundColorReverse(),
              }}
            >
              <p
                className={`text-[22px] text-center`}
                style={{
                  color: utils.determineFontColorReverse(),
                }}
              >
                Join a room
              </p>
            </div>
            <div
              className={`cursor-pointer flex justify-center items-center rounded-4xl w-[246px] h-[58px]`}
              onClick={() => {
                setAction("create");
              }}
              style={{
                backgroundColor: utils.determineBackgroundColorReverse(),
              }}
            >
              <p
                className={`text-[22px] text-center`}
                style={{
                  color: utils.determineFontColorReverse(),
                }}
              >
                Create a room
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : action === "join" ? (
    <JoinAMultiplayerRoom onGoingBackToSetup={handleGoingBackToSetup} />
  ) : (
    <CreateAMultiplayerRoom onGoingBackToSetup={handleGoingBackToSetup} />
  );
};

export default MultiPlaySetup;
