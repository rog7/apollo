import React, { useContext, useState } from "react";
import * as utils from "../utils/determineColors";
import PracticeModeSvgTop from "./svg/PracticeModeSvgTop";
import BackArrowSvg from "./svg/BackArrowSvg";
import { ShowHomePageContext } from "../pages/main";
import SoloPlaySetup from "./SoloPlaySetup";
import MultiPlaySetup from "./MultiPlaySetup";

const PracticeModeInit = () => {
  const { setShowHomePage } = useContext(ShowHomePageContext);
  const [showPracticeModeInit, setShowPracticeModeInit] = useState(true);
  const [mode, setMode] = useState("");

  const goBackToHomePage = () => {
    setShowHomePage(true);
  };

  const handleGoingBackToInit = () => {
    setMode("");
    setShowPracticeModeInit(true);
  };

  const handleModeSelection = (mode: string) => {
    setShowPracticeModeInit(false);
    setMode(mode);
  };

  return showPracticeModeInit ? (
    <div className="flex justify-center items-center h-screen">
      <div
        className={`relative mt-[32px rounded-2.5xl w-[358px] h-[368px]`}
        style={{
          backgroundColor: utils.determineBackgroundColorReverse(),
        }}
      >
        <div className="z-20 absolute top-[-66px] left-[110px]">
          <PracticeModeSvgTop />
        </div>
        <div
          className="cursor-pointer z-20 absolute top-[28px] left-[28px]"
          onClick={goBackToHomePage}
        >
          <BackArrowSvg />
        </div>
        <div
          className={`absolute top-[3px] left-[3px] rounded-2.5xl w-[349px] h-[358px] p-[21px]`}
          style={{
            backgroundColor: utils.determineBackgroundColorForCard2(),
          }}
        >
          <div className="mt-[60px] flex flex-col items-center">
            <div>
              <p
                className={`text-[24px] font-bold text-center`}
                style={{
                  color: utils.determineFontColor(),
                }}
              >
                Welcome to
              </p>
            </div>
            <div>
              <p
                className={`-mt-[5px] text-[32px] font-bold text-center`}
                style={{
                  color: utils.determineFontColor(),
                }}
              >
                Practice Mode!
              </p>
            </div>
            <div className="mt-[30px] flex flex-col gap-[20px]">
              <div
                className={`cursor-pointer flex justify-center items-center rounded-4xl w-[246px] h-[58px]`}
                onClick={() => handleModeSelection("solo")}
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
                  Solo Play
                </p>
              </div>
              <div
                className={`cursor-pointer flex justify-center items-center rounded-4xl w-[246px] h-[58px]`}
                onClick={() => handleModeSelection("multi")}
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
                  Multiplayer
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : mode === "solo" ? (
    <SoloPlaySetup onGoingBackToInit={handleGoingBackToInit} />
  ) : (
    <MultiPlaySetup onGoingBackToInit={handleGoingBackToInit} />
  );
};

export default PracticeModeInit;
