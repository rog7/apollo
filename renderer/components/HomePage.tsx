import { useContext, useEffect, useRef } from "react";
import { ProUserContext } from "../pages/home";
import {
  ModeContext,
  ShowHomePageContext,
  ShowPricingTableContext,
  ThemeContext,
} from "../pages/main";
import * as utils from "../utils/determineColors";
import { setItem } from "../utils/localStorage";
import DetectModeSvg from "./svg/DetectModeSvg";
import EnterModeArrow from "./svg/EnterModeArrow";
import PracticeModeSvg from "./svg/PracticeModeSvg";
import SearchModeSvg from "./svg/SearchModeSvg";

interface Props {
  expirationTrialDate: Date | undefined;
}
const HomePage = ({ expirationTrialDate }: Props) => {
  const { setMode } = useContext(ModeContext);
  const { setShowHomePage } = useContext(ShowHomePageContext);
  const { theme } = useContext(ThemeContext);
  const { setShowPricingTable } = useContext(ShowPricingTableContext);
  const { isProUser } = useContext(ProUserContext);

  const handleModeSelection = (mode: string) => {
    setItem("mode-preference", mode);
    setMode(mode);
    setShowHomePage(false);
  };

  const isProUserRef = useRef(isProUser);

  useEffect(() => {
    isProUserRef.current = isProUser;
  }, [isProUser]);

  useEffect(() => {
    document.querySelectorAll(".premium-feature").forEach((element) => {
      element.addEventListener("click", () => {
        !isProUserRef.current && setShowPricingTable(true);
      });
    });
  }, []);

  return (
    <div className="h-screen flex justify-center">
      <div className="flex flex-col items-center">
        <p
          className={`mt-[37px] font-bold text-xl`}
          style={{
            color: utils.determineFontColor(),
          }}
        >
          Choose Your Mode
        </p>
        <div
          className={`cursor-pointer relative mt-[32px] rounded-2.5xl w-[711px] h-[188px]`}
          onClick={() => handleModeSelection("practice mode")}
          style={{
            backgroundColor: utils.determineBackgroundColorReverse(),
          }}
        >
          <div
            className={`absolute top-[3px] left-[3px] rounded-2.5xl w-[702px] h-[178px] p-[21px]`}
            style={{
              backgroundColor: utils.determineBackgroundColorForCard(),
            }}
          >
            <div className="flex justify-between">
              <div className="flex flex-col gap-[5px]">
                <div>
                  <p
                    className={`text-3xl font-bold`}
                    style={{
                      color: utils.determineFontColor(),
                    }}
                  >
                    Practice Mode
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      color: utils.determineFontColor(),
                    }}
                  >
                    Make learning fun with others.
                  </p>
                </div>
              </div>
              <div className="flex gap-[5px]">
                <div>
                  <PracticeModeSvg />
                </div>
                <div className="flex items-end">
                  <EnterModeArrow />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex mt-[24px] gap-[21px]">
          <div
            className="cursor-pointer premium-feature relative rounded-2.5xl w-[302px] h-[239px]"
            style={{
              backgroundColor: utils.determineBackgroundColorReverse(),
            }}
            onClick={() => isProUser && handleModeSelection("search mode")}
          >
            <div
              className={`absolute top-[3px] left-[3px] rounded-2.5xl w-[293px] h-[229px] p-[21px]`}
              style={{
                backgroundColor: utils.determineBackgroundColorForCard(),
              }}
            >
              <div className="flex flex-col">
                <div className="flex flex-col gap-[5px]">
                  <div>
                    <p
                      className={`text-3xl font-bold`}
                      style={{
                        color: utils.determineFontColor(),
                      }}
                    >
                      Search Mode
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        color: utils.determineFontColor(),
                      }}
                    >
                      Learn new chords with ease.
                    </p>
                  </div>
                </div>
                <div className="flex justify-between mt-[7px]">
                  <div>
                    <SearchModeSvg />
                  </div>
                  <div className="flex items-end mb-[5px]">
                    <EnterModeArrow />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`cursor-pointer relative rounded-2.5xl w-[386px] h-[239px]`}
            onClick={() => handleModeSelection("detect mode")}
            style={{
              backgroundColor: utils.determineBackgroundColorReverse(),
            }}
          >
            <div
              className={`absolute top-[3px] left-[3px] rounded-2.5xl w-[377px] h-[229px] p-[21px]`}
              style={{
                backgroundColor: utils.determineBackgroundColorForCard(),
              }}
            >
              <div className="flex flex-col">
                <div className="flex flex-col gap-[5px]">
                  <div>
                    <p
                      className={`text-3xl font-bold`}
                      style={{
                        color: utils.determineFontColor(),
                      }}
                    >
                      Detect Mode
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        color: utils.determineFontColor(),
                      }}
                    >
                      Get real time chord detection.
                    </p>
                  </div>
                </div>
                <div className="flex justify-between mt-[10px]">
                  <div>
                    <DetectModeSvg />
                  </div>
                  <div className="flex items-end">
                    <EnterModeArrow />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {expirationTrialDate !== undefined && (
        <div className="absolute bottom-10 font-bold">
          <p
            style={{
              color: utils.determineFontColor(),
            }}
          >
            Trial End Date:{" "}
            {new Date(expirationTrialDate).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              // hour: "2-digit",
              // minute: "2-digit",
              // timeZoneName: "short",
            })}
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
