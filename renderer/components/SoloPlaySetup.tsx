import React, { useContext, useEffect, useState } from "react";
import * as utils from "../utils/determineColors";
import PracticeModeSvgTop from "./svg/PracticeModeSvgTop";
import BackArrowSvg from "./svg/BackArrowSvg";
import EnterModeArrow from "./svg/EnterModeArrow";
import SoloPlayMidiHandler from "./SoloPlayMidiHandler";
import { ProUserContext } from "../pages/home";
import { ShowPricingTableContext } from "../pages/main";

interface Props {
  onGoingBackToInit: () => void;
}

const SoloPlaySetup = ({ onGoingBackToInit }: Props) => {
  const [showAboutToStartScreen, setShowAboutToStartScreen] = useState(false);
  const [numberOfChords, setNumberOfChords] = useState(10);
  const [numberOfMinutes, setNumberOfMinutes] = useState(5);
  const [levelOfDifficulty, setLevelOfDifficulty] = useState("Easy");
  const [showPopupModal, setShowPopupModal] = useState(true);

  const numberOfChordsOptions = [10, 20, 30, 40, 50];
  const numberOfMinutesOptions = [5, 10, 15, 20, 25, 30];
  const levelOfDifficultyOptions = ["Easy", "Medium", "Hard"];

  const { isProUser } = useContext(ProUserContext);
  const { setShowPricingTable } = useContext(ShowPricingTableContext);

  return !showAboutToStartScreen ? (
    <div className="flex justify-center items-center h-screen">
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
          onClick={onGoingBackToInit}
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
                Solo Play!
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
          onClick={() => setShowAboutToStartScreen(true)}
        >
          <EnterModeArrow />
        </div>
      </div>
    </div>
  ) : (
    <>
      {showPopupModal && (
        <div className="flex justify-center items-center h-screen">
          <div
            className={`z-10 relative mt-[32px] rounded-2.5xl w-[482px] h-[359px]`}
            style={{
              backgroundColor: utils.determineBackgroundColorReverse(),
            }}
          >
            <div className="z-20 absolute top-[-66px] left-[180px]">
              <PracticeModeSvgTop />
            </div>
            <div
              className="cursor-pointer z-20 absolute top-[28px] left-[28px]"
              onClick={() => setShowAboutToStartScreen(false)}
            >
              <BackArrowSvg />
            </div>
            <div
              className={`flex flex-col items-center absolute top-[3px] left-[3px] rounded-2.5xl w-[473px] h-[349px] p-[21px]`}
              style={{
                backgroundColor: utils.determineBackgroundColorForCard2(),
              }}
            >
              <div className="mt-[60px]">
                <p
                  className={`text-[20px] font-bold text-center`}
                  style={{
                    color: utils.determineFontColor(),
                  }}
                >
                  Your solo practice is about to start!
                </p>
              </div>
              <div className="mt-[20px] w-[310px] flex flex-col gap-[20px]">
                <p
                  className={`text-[20px] font-bold text-center`}
                  style={{
                    color: utils.determineFontColor(),
                  }}
                >
                  {`You have ${numberOfMinutes} minutes to get`}
                  <br /> {`${numberOfChords} chords correct.`}
                </p>
                <p
                  className={`text-[20px] font-light text-center`}
                  style={{
                    color: utils.determineFontColor(),
                  }}
                >
                  Get your game face on because your time starts as soon as you
                  get to the next screen. Good luck!
                </p>
              </div>
            </div>
            <div
              className="absolute bottom-[20px] right-[20px]"
              onClick={() => setShowPopupModal(false)}
            >
              <EnterModeArrow />
            </div>
          </div>
        </div>
      )}
      <div className={`${showPopupModal && "fixed inset-0 opacity-20"}`}>
        <SoloPlayMidiHandler
          isSoloPlay={!showPopupModal}
          minutesToPractice={numberOfMinutes}
          totalChords={numberOfChords}
          levelOfDifficulty={levelOfDifficulty}
          onGoingBackToInit={onGoingBackToInit}
        />
      </div>
    </>
  );
};

export default SoloPlaySetup;
