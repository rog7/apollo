import { ipcRenderer, shell } from "electron";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PostHogProvider, usePostHog } from "posthog-js/react";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Soundfont from "soundfont-player";
import { Input, Output, WebMidi } from "webmidi";
import AIMIDIHandler from "../components/AIMIDIHandler";
import BuyApollo from "../components/BuyApollo";
import FreeMIDIHandler from "../components/FreeMIDIHandler";
import HomePage from "../components/HomePage";
import Menu from "../components/Menu";
import MIDIHandler from "../components/MIDIHandler";
import NonSSRComponent from "../components/NonSSRComponent";
import PracticeModeInit from "../components/PracticeModeInit";
import PremiumButton from "../components/PremiumButton";
import PricingTable from "../components/PricingTable";
import ProfileModal from "../components/ProfileModal";
import SearchMode from "../components/SearchMode";
import DiscountSvg from "../components/svg/DiscountSvg";
import HomeSvg from "../components/svg/HomeSvg";
import CancelSymbol from "../components/symbols/CancelSymbol";
import UpdateSoftwareNotification from "../components/UpdateSoftwareNotification";
import * as utils from "../utils/determineColors";
import { API_BASE_URL, POSTHOG_API_KEY } from "../utils/globalVars";
import { getItem, setItem } from "../utils/localStorage";
import {
  darkModeBackgroundColor,
  darkModeFontColor,
  lightModeBackgroundColor,
  lightModeFontColor,
} from "../utils/styles";
import { PaymentLinkContext, ProUserContext } from "./home";

interface ColorContextType {
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
}

export const ColorContext = createContext<ColorContextType>({
  color: "",
  setColor: () => {},
});

interface KeyContextType {
  key: string;
  setKey: React.Dispatch<React.SetStateAction<string>>;
}

export const KeyContext = createContext<KeyContextType>({
  key: "",
  setKey: () => {},
});

interface ModeContextType {
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<string>>;
}

export const ModeContext = createContext<ModeContextType>({
  mode: "",
  setMode: () => {},
});

interface AltChordsContextType {
  showAltChords: boolean;
  setShowAltChords: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AltChordsContext = createContext<AltChordsContextType>({
  showAltChords: false,
  setShowAltChords: () => {},
});

interface ShowChordNumbersContextType {
  showChordNumbers: boolean;
  setShowChordNumbers: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ShowChordNumbersContext =
  createContext<ShowChordNumbersContextType>({
    showChordNumbers: false,
    setShowChordNumbers: () => {},
  });

interface EnableSoundContextType {
  enableSound: boolean;
  setEnableSound: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EnableSoundContext = createContext<EnableSoundContextType>({
  enableSound: false,
  setEnableSound: () => {},
});

interface ThemeContextType {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "",
  setTheme: () => {},
});

interface AIRecommendationIntervalContextType {
  recommendationInterval: number;
  setRecommendationInterval: React.Dispatch<React.SetStateAction<number>>;
}

export const AIRecommendationIntervalContext =
  createContext<AIRecommendationIntervalContextType>({
    recommendationInterval: 5,
    setRecommendationInterval: () => {},
  });

interface LiteVersionNotificationContextType {
  showLiteVersionNotification: boolean;
  setShowLiteVersionNotification: React.Dispatch<React.SetStateAction<boolean>>;
  triggerUpgradeNotification: () => void;
}

export const LiteVersionNotificationContext =
  createContext<LiteVersionNotificationContextType>({
    showLiteVersionNotification: false,
    setShowLiteVersionNotification: () => {},
    triggerUpgradeNotification: () => {},
  });

interface LiteVersionNotificationVisibilityContextType {
  liteVersionNotificationIsVisible: boolean;
  setliteVersionNotificationVisibility: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export const LiteVersionNotificationVisibilityContext =
  createContext<LiteVersionNotificationVisibilityContextType>({
    liteVersionNotificationIsVisible: false,
    setliteVersionNotificationVisibility: () => {},
  });

interface ShowPracticeRoomContextType {
  showPracticeRoom: boolean;
  setShowPracticeRoom: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ShowPracticeRoomContext =
  createContext<ShowPracticeRoomContextType>({
    showPracticeRoom: false,
    setShowPracticeRoom: () => {},
  });

interface ShowPracticeRoomInitContextType {
  showPracticeRoomInit: boolean;
  setShowPracticeRoomInit: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ShowPracticeRoomInitContext =
  createContext<ShowPracticeRoomInitContextType>({
    showPracticeRoomInit: true,
    setShowPracticeRoomInit: () => {},
  });

interface MidiInputContextType {
  midiInputs: Input[];
  setMidiInputs: React.Dispatch<React.SetStateAction<Input[]>>;
}

export const MidiInputContext = createContext<MidiInputContextType>({
  midiInputs: [],
  setMidiInputs: () => {},
});

interface MidiOutputContextType {
  midiOutputs: Output[];
  setMidiOutputs: React.Dispatch<React.SetStateAction<Output[]>>;
}

export const MidiOutputContext = createContext<MidiOutputContextType>({
  midiOutputs: [],
  setMidiOutputs: () => {},
});

interface ShowHomePageContextType {
  showHomePage: boolean;
  setShowHomePage: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ShowHomePageContext = createContext<ShowHomePageContextType>({
  showHomePage: true,
  setShowHomePage: () => {},
});

interface EnableFreeVersionContextType {
  enableFreeVersion: boolean;
  setEnableFreeVersion: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EnableFreeVersionContext =
  createContext<EnableFreeVersionContextType>({
    enableFreeVersion: false,
    setEnableFreeVersion: () => {},
  });

interface ShowPricingTableContextType {
  showPricingTable: boolean;
  setShowPricingTable: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ShowPricingTableContext =
  createContext<ShowPricingTableContextType>({
    showPricingTable: true,
    setShowPricingTable: () => {},
  });

interface Props {
  setShowProfileIcon?: () => {};
  isSuiteUser?: boolean;
  showProfileIcon?: boolean;
  profileImageUrl?: string;
  handleShowSettings?: () => {};
  setShowLoginStreakInfo?: () => {};
  currentLoginStreak?: number;
  expirationTrialDate: Date | undefined;
  showDiscountPopup: boolean;
  setShowDiscountPopup: Dispatch<SetStateAction<boolean>>;
  onEnableFreeVersion: (enableFreeVersion: boolean) => void;
  onExpirationTrialDate: (expirationTrialDate: Date | undefined) => void;
  onIsProUser: (isProUser: boolean) => void;
}

export default function Main({
  expirationTrialDate,
  showDiscountPopup,
  setShowDiscountPopup,
  onEnableFreeVersion,
  onExpirationTrialDate,
  onIsProUser,
}: Props) {
  let colorPreference: string;
  let keyPreference: string;
  let modePreference: string;
  let showAltChordsPreference: boolean;
  let themePreference: string;
  let showChordNumbersPreference: boolean;
  let enableSoundPreference: boolean;
  let aiRecommendationIntervalPreference: number;

  if (getItem("enable-sound-preference") === null) {
    enableSoundPreference = true;
    setItem("enable-sound-preference", enableSoundPreference);
  } else {
    if (getItem("enable-sound-preference") === "true") {
      enableSoundPreference = true;
    } else {
      enableSoundPreference = false;
    }
  }

  if (getItem("ai-rec-interval-preference") === null) {
    aiRecommendationIntervalPreference = 2;
    setItem("ai-rec-interval-preference", aiRecommendationIntervalPreference);
  } else {
    aiRecommendationIntervalPreference = getItem(
      "ai-rec-interval-preference"
    ) as number;
  }

  if (getItem("show-ai-recommendations") === null) {
    setItem("show-ai-recommendations", true);
  }

  if (getItem("show-rec-progress-bar") === null) {
    setItem("show-rec-progress-bar", true);
  }

  if (getItem("color-preference") === null) {
    colorPreference = "#ceb695";
    setItem("color-preference", colorPreference);
  } else {
    colorPreference = getItem("color-preference") as string;
  }

  if (getItem("key-preference") === null) {
    keyPreference = "C";
    setItem("key-preference", keyPreference);
  } else {
    keyPreference = getItem("key-preference") as string;
  }

  if (getItem("mode-preference") === null) {
    modePreference = "";
    setItem("mode-preference", modePreference);
  } else {
    modePreference = getItem("mode-preference") as string;
  }

  if (getItem("show-alt-chords-preference") === null) {
    showAltChordsPreference = false;
    setItem("show-alt-chords-preference", showAltChordsPreference);
  } else {
    showAltChordsPreference = getItem("show-alt-chords-preference") as boolean;
  }

  if (getItem("show-chord-numbers-preference") === null) {
    showChordNumbersPreference = false;
    setItem("show-chord-numbers-preference", showChordNumbersPreference);
  } else {
    showChordNumbersPreference = getItem(
      "show-chord-numbers-preference"
    ) as boolean;
  }

  if (getItem("theme-preference") === null) {
    themePreference = "light-mode";
    setItem("theme-preference", themePreference);
  } else {
    themePreference = getItem("theme-preference") as string;
  }

  const [color, setColor] = useState(colorPreference);
  const [key, setKey] = useState(keyPreference);
  const [mode, setMode] = useState(modePreference);
  const [showAltChords, setShowAltChords] = useState(showAltChordsPreference);
  const [showChordNumbers, setShowChordNumbers] = useState(
    showChordNumbersPreference
  );
  const [enableSound, setEnableSound] = useState(enableSoundPreference);
  const [recommendationInterval, setRecommendationInterval] = useState(
    aiRecommendationIntervalPreference
  );

  const [midiInputs, setMidiInputs] = useState<Input[]>([]);
  const [midiOutputs, setMidiOutputs] = useState<Output[]>([]);
  const [theme, setTheme] = useState(themePreference);
  const [showLiteVersionNotification, setShowLiteVersionNotification] =
    useState(false);

  const [
    liteVersionNotificationIsVisible,
    setliteVersionNotificationVisibility,
  ] = useState(false);

  const [showPracticeRoomInit, setShowPracticeRoomInit] = useState(false);

  const [showPracticeRoom, setShowPracticeRoom] = useState(false);
  const [showPracticeRoomButton, setShowPracticeRoomButton] = useState(true);
  const [showHomePage, setShowHomePage] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPricingTable, setShowPricingTable] = useState(false);
  const [premiumPrice, setPremiumPrice] = useState(0);
  const { paymentLink } = useContext(PaymentLinkContext);
  const [enableFreeVersion, setEnableFreeVersion] = useState(true);
  const [hidePremiumButton, setHidePremiumButton] = useState(false);
  const [shouldAccessAIMIDIHandler, setShouldAccessAIMIDIHandler] =
    useState(false);

  const { isProUser } = useContext(ProUserContext);
  const posthog = usePostHog();

  const recreateMenu = () => {
    ipcRenderer.send("recreate_menu", [
      getItem("key-preference"),
      getItem("theme-preference"),
      getItem("color-preference"),
      getItem("show-chord-numbers-preference") === "true",
      getItem("show-alt-chords-preference") === "true",
      [],
      undefined,
      isProUser,
      getItem("enable-sound-preference") === "true",
      getItem("ai-rec-interval-preference"),
    ]);
  };

  useEffect(() => {
    recreateMenu();

    ipcRenderer.on("light_theme_clicked", () => {
      setThemePreference("light-mode");
    });
    ipcRenderer.on("dark_theme_clicked", () => {
      setThemePreference("dark-mode");
    });

    ipcRenderer.on("key_preference_clicked", (_, args) => {
      setItem("key-preference", args[0]);
      setKey(args[0]);
    });

    ipcRenderer.on("color_changed", (_, args: any[]) => {
      setItem("color-preference", args[2]);
      setColor(args[2]);
      ipcRenderer.send("recreate_menu", args);
    });

    ipcRenderer.on("interval_changed", (_, args: any[]) => {
      setItem("ai-rec-interval-preference", args[9]);
      setRecommendationInterval(args[9]);
      ipcRenderer.send("recreate_menu", args);
    });

    ipcRenderer.on("edit_profile_clicked", () =>
      setShowProfileModal(!showProfileModal)
    );

    ipcRenderer.on("premium_feature_clicked", (_, args) =>
      handleShowingPricingTable(args)
    );

    ipcRenderer.on("enable_sound_clicked", (_, args: any[]) => {
      ipcRenderer.send("recreate_menu", args);
    });

    const authToken = getItem("auth-token");

    if (authToken) {
      const payload = jwt.decode(authToken) as JwtPayload;

      const isProUser = payload.isProUser as boolean;
      const email = payload.email as string;

      posthog?.identify(email, {
        email,
        isProUser,
      });
    }

    navigator
      .requestMIDIAccess()
      .then(() => {
        WebMidi.enable();
      })
      .catch((error) => {
        console.error("Error requesting MIDI access:", error);
      });

    const handleDivClick = (event) => {
      // Check if the clicked element has the class name "premium-feature"
      if (event.target.classList.contains("premium-feature")) {
        if (!showLiteVersionNotification && !liteVersionNotificationIsVisible) {
          setShowLiteVersionNotification(true);
          setliteVersionNotificationVisibility(true);
        }
      }
    };

    const handleContainerClick = (event) => {
      // Delegate the click event to the container element
      handleDivClick(event);
    };

    window.addEventListener("click", handleContainerClick);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("click", handleContainerClick);
    };
  }, []);

  useEffect(() => {
    if (WebMidi !== undefined) {
      WebMidi.addListener("connected", handleMidiInputs);
      WebMidi.addListener("disconnected", handleMidiInputs);
      WebMidi.addListener("connected", handleMidiOutputs);
      WebMidi.addListener("disconnected", handleMidiOutputs);

      handleMidiInputs();
      handleMidiOutputs();
    }
  }, []);

  useEffect(() => {
    const checkForAccessToAIRecommendations = () => {
      const authToken = getItem("auth-token");

      if (authToken) {
        const payload = jwt.decode(authToken) as JwtPayload;

        const isProUser = payload.isProUser as boolean;
        const email = payload.email as string;

        posthog?.identify(email, {
          email,
          isProUser,
        });

        setShouldAccessAIMIDIHandler(
          posthog.isFeatureEnabled("ai-recommendations")
        );
      }
    };

    checkForAccessToAIRecommendations();

    setInterval(() => {
      checkForAccessToAIRecommendations();
    }, 600000); // will check every 10 minutes
  }, []);

  useEffect(() => {
    recreateMenu();
  }, [isProUser]);

  const handleMidiInputs = () => {
    if (WebMidi !== undefined) {
      if (WebMidi.inputs.length === 0) {
        setMidiInputs([]);
      } else {
        setMidiInputs(WebMidi.inputs);
      }
    }
  };

  const handleMidiOutputs = () => {
    if (WebMidi !== undefined) {
      if (WebMidi.outputs.length === 0) {
        setMidiOutputs([]);
      } else {
        setMidiOutputs(WebMidi.outputs);
      }
    }
  };

  function setThemePreference(theme: string) {
    setItem("theme-preference", theme);
    setTheme(theme);
  }

  const handleShowingPricingTable = (args: any[]) => {
    ipcRenderer.send("recreate_menu", args);
    setShowPricingTable(true);
  };

  const triggerUpgradeNotificationFn = () => {
    if (!showLiteVersionNotification && !liteVersionNotificationIsVisible) {
      setShowLiteVersionNotification(true);
      setliteVersionNotificationVisibility(true);
    }
  };

  useEffect(() => {
    document.body.style.backgroundColor =
      theme === "light-mode"
        ? lightModeBackgroundColor
        : darkModeBackgroundColor;
  }, [theme]);

  useEffect(() => {
    const email = (jwt.decode(getItem("auth-token")) as JwtPayload)?.email;
    getUserInfo(email);
    setInterval(() => {
      getUserInfo(email);
    }, 10000);
  }, []);

  if (!enableFreeVersion) {
    !showHomePage &&
      Math.floor(new Date(expirationTrialDate).getTime() / 1000) <
        Math.floor(Date.now() / 1000) &&
      setShowHomePage(true);
  }

  const getUserInfo = async (email: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/me?email=${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        const authToken = response.headers.get("Authorization").split(" ")[1];
        setItem("auth-token", authToken);

        const payload = jwt.decode(authToken) as JwtPayload;

        setPremiumPrice(data.apolloPrice);
        setEnableFreeVersion(data.enableFreeVersion);
        onEnableFreeVersion(data.enableFreeVersion);
        onExpirationTrialDate(data.expirationDate);
        onIsProUser(payload.isProUser);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (hideButton: boolean) => {
    setShowPracticeRoomButton(!hideButton);
  };

  const enableSoundRef = useRef(enableSound);

  useEffect(() => {
    enableSoundRef.current = enableSound;
  }, [enableSound]);

  useEffect(() => {
    if (midiInputs.length > 0) {
      Soundfont.instrument(new AudioContext(), "acoustic_grand_piano").then(
        (piano) => {
          const playingNotes: { [pitch: number]: any } = {};
          const keyPressNotes: { [pitch: number]: boolean } = {};
          let sustainPedalDown = false;

          const noteOnListener = (event: any) => {
            const [status, pitch, velocity] = event.data;

            if (enableSoundRef.current) {
              // noteOn
              playingNotes[pitch] = piano.play(pitch, velocity / 127);
            }

            keyPressNotes[pitch] = true;
          };

          const noteOffListener = (event: any) => {
            const [status, pitch, velocity] = event.data;

            // noteOff
            if (!sustainPedalDown) {
              if (playingNotes[pitch]) {
                playingNotes[pitch].stop();
                delete playingNotes[pitch];
              }
            }
            delete keyPressNotes[pitch];
          };

          const controlChangeListener = (event: any) => {
            const [status, controller, value] = event.data;

            // sustain pedal (CC 64)
            if (controller === 64) {
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
            }
          };

          midiInputs.forEach((input) =>
            input.addListener("noteon", noteOnListener)
          );
          midiInputs.forEach((input) =>
            input.addListener("noteoff", noteOffListener)
          );
          midiInputs.forEach((input) =>
            input.addListener("controlchange", controlChangeListener)
          );
        }
      );
    }
  }, [midiInputs, enableSound]);

  return (
    <>
      <PostHogProvider apiKey={POSTHOG_API_KEY}>
        <ColorContext.Provider value={{ color, setColor }}>
          <KeyContext.Provider value={{ key, setKey }}>
            <ModeContext.Provider value={{ mode, setMode }}>
              <AltChordsContext.Provider
                value={{ showAltChords, setShowAltChords }}
              >
                <ThemeContext.Provider value={{ theme, setTheme }}>
                  <LiteVersionNotificationContext.Provider
                    value={{
                      showLiteVersionNotification,
                      setShowLiteVersionNotification,
                      triggerUpgradeNotification: triggerUpgradeNotificationFn,
                    }}
                  >
                    <LiteVersionNotificationVisibilityContext.Provider
                      value={{
                        liteVersionNotificationIsVisible,
                        setliteVersionNotificationVisibility,
                      }}
                    >
                      <ShowPracticeRoomContext.Provider
                        value={{ showPracticeRoom, setShowPracticeRoom }}
                      >
                        <MidiInputContext.Provider
                          value={{ midiInputs, setMidiInputs }}
                        >
                          <MidiOutputContext.Provider
                            value={{ midiOutputs, setMidiOutputs }}
                          >
                            <ShowPracticeRoomInitContext.Provider
                              value={{
                                showPracticeRoomInit,
                                setShowPracticeRoomInit,
                              }}
                            >
                              <ShowChordNumbersContext.Provider
                                value={{
                                  showChordNumbers,
                                  setShowChordNumbers,
                                }}
                              >
                                <ShowHomePageContext.Provider
                                  value={{ showHomePage, setShowHomePage }}
                                >
                                  <ShowPricingTableContext.Provider
                                    value={{
                                      showPricingTable,
                                      setShowPricingTable,
                                    }}
                                  >
                                    <EnableSoundContext.Provider
                                      value={{ enableSound, setEnableSound }}
                                    >
                                      <EnableFreeVersionContext.Provider
                                        value={{
                                          enableFreeVersion,
                                          setEnableFreeVersion,
                                        }}
                                      >
                                        <AIRecommendationIntervalContext.Provider
                                          value={{
                                            recommendationInterval,
                                            setRecommendationInterval,
                                          }}
                                        >
                                          <div>
                                            <NonSSRComponent>
                                              <UpdateSoftwareNotification />
                                              {/* {!showPracticeRoomInit &&
                                        !showPracticeRoom &&
                                        showPracticeRoomButton && (
                                          <div
                                            style={{
                                              position: 'absolute',
                                              right: '3%',
                                            }}
                                          >
                                            <button
                                              className="rounded-4xl py-2 px-4"
                                              onClick={() => {
                                                setShowPracticeRoomInit(
                                                  !showPracticeRoomInit
                                                );
                                              }}
                                              style={{
                                                color:
                                                  ColorUtils.determineFontColorReverse(),
                                                backgroundColor:
                                                  ColorUtils.determineBackgroundColorReverse(),
                                              }}
                                            >
                                              enter the shed.
                                            </button>
                                          </div>
                                        )} */}
                                              <div className="hidden">
                                                <Menu />
                                              </div>
                                              {!showHomePage && (
                                                <div
                                                  className="cursor-pointer z-20 absolute top-[42px] left-[42px]"
                                                  onClick={() => {
                                                    setMode("");
                                                    setShowHomePage(true);
                                                  }}
                                                >
                                                  <HomeSvg />
                                                </div>
                                              )}
                                              {(expirationTrialDate !==
                                                undefined ||
                                                !isProUser) && (
                                                <div
                                                  className={`${
                                                    hidePremiumButton
                                                      ? "z-0 hidden"
                                                      : ""
                                                  }`}
                                                >
                                                  {" "}
                                                  <PremiumButton
                                                    isTrialing={
                                                      new Date(
                                                        expirationTrialDate
                                                      ).getTime() /
                                                        1000 >
                                                      Math.floor(
                                                        Date.now() / 1000
                                                      )
                                                    }
                                                  />
                                                </div>
                                              )}
                                              {showDiscountPopup && (
                                                <div
                                                  className={`z-50 absolute rounded-2.5xl w-[477px] h-[389px] left-[440px] top-[140px] border-2`}
                                                  style={{
                                                    backgroundColor:
                                                      utils.determineBackgroundColorForSearchModeModal(),

                                                    borderColor:
                                                      theme === "light-mode"
                                                        ? lightModeFontColor
                                                        : darkModeFontColor,
                                                  }}
                                                >
                                                  <div
                                                    className="z-50 absolute right-[5%] top-[5%] cursor-pointer"
                                                    onClick={() => {
                                                      setItem(
                                                        "seen-discount-code",
                                                        true
                                                      );
                                                      setShowDiscountPopup(
                                                        false
                                                      );
                                                    }}
                                                  >
                                                    <CancelSymbol />
                                                  </div>
                                                  <div className="z-20 absolute top-[-80px] left-[82px]">
                                                    <DiscountSvg />
                                                  </div>
                                                  <div className="flex flex-col items-center mt-[75px]">
                                                    <div>
                                                      <p
                                                        className={`text-2xl font-bold text-center`}
                                                        style={{
                                                          color:
                                                            utils.determineFontColor(),
                                                        }}
                                                      >
                                                        You’ve been selected!
                                                      </p>
                                                    </div>
                                                    <div>
                                                      <p
                                                        className={`text-5xl font-bold text-center mt-4`}
                                                        style={{
                                                          color:
                                                            utils.determineFontColor(),
                                                        }}
                                                      >
                                                        GET 25% OFF APOLLO!
                                                      </p>
                                                    </div>
                                                    <div>
                                                      <p
                                                        className={`text-[18px] text-center mt-4`}
                                                        style={{
                                                          color:
                                                            utils.determineFontColor(),
                                                        }}
                                                      >
                                                        Become a premium user
                                                        today.
                                                      </p>
                                                    </div>
                                                    <div
                                                      className="mt-4 cursor-pointer flex justify-center items-center rounded-4xl w-[246px] h-[58px]"
                                                      onClick={() =>
                                                        shell.openExternal(
                                                          paymentLink
                                                        )
                                                      }
                                                      style={{
                                                        backgroundColor:
                                                          utils.determineBackgroundColorReverse(),
                                                      }}
                                                    >
                                                      <p
                                                        className={`text-[20px] text-center`}
                                                        style={{
                                                          color:
                                                            utils.determineFontColorReverse(),
                                                        }}
                                                      >
                                                        Redeem Now
                                                      </p>
                                                    </div>
                                                    <div>
                                                      <p
                                                        className={`text-[14px] font-bold text-center mt-2`}
                                                        style={{
                                                          color:
                                                            utils.determineFontColor(),
                                                        }}
                                                      >
                                                        OFFER ENDS IN 24 HOURS.
                                                      </p>
                                                    </div>
                                                  </div>
                                                </div>
                                              )}
                                              {/* <div className="hidden absolute top-[3%] left-[3%]">
                                              <div className="flex gap-[10px]">
                                                <div>
                                                  <MIDISetup
                                                    label={"Midi Input"}
                                                  />
                                                </div>
                                                <div>
                                                  <MIDISetup
                                                    label={"Midi Output"}
                                                  />
                                                </div>
                                              </div>
                                            </div> */}
                                              <div
                                                className={` ${
                                                  showDiscountPopup &&
                                                  `opacity-20 pointer-events-none`
                                                }`}
                                              >
                                                {showPricingTable && (
                                                  <PricingTable
                                                    price={premiumPrice}
                                                    setShowPricingTable={
                                                      setShowPricingTable
                                                    }
                                                  />
                                                )}
                                                {!showPricingTable &&
                                                  (showHomePage ? (
                                                    (expirationTrialDate ===
                                                      undefined &&
                                                      enableFreeVersion) ||
                                                    Math.floor(
                                                      new Date(
                                                        expirationTrialDate
                                                      ).getTime() / 1000
                                                    ) >
                                                      Math.floor(
                                                        Date.now() / 1000
                                                      ) ||
                                                    enableFreeVersion ||
                                                    isProUser ? (
                                                      <HomePage
                                                        expirationTrialDate={
                                                          expirationTrialDate
                                                        }
                                                      />
                                                    ) : (
                                                      <BuyApollo />
                                                    )
                                                  ) : mode === "detect mode" ? (
                                                    isProUser ? (
                                                      shouldAccessAIMIDIHandler ? (
                                                        <AIMIDIHandler />
                                                      ) : (
                                                        <MIDIHandler
                                                          socket={null}
                                                          roomName={null}
                                                          playAccess={null}
                                                        />
                                                      )
                                                    ) : shouldAccessAIMIDIHandler ? (
                                                      <AIMIDIHandler />
                                                    ) : (
                                                      <FreeMIDIHandler />
                                                    )
                                                  ) : mode === "search mode" ? (
                                                    <SearchMode
                                                      noteOnColor={color}
                                                      onSearch={handleSearch}
                                                      setHidePremiumButton={
                                                        setHidePremiumButton
                                                      }
                                                    />
                                                  ) : (
                                                    <PracticeModeInit />
                                                  ))}
                                              </div>
                                              {showProfileModal &&
                                                !showPricingTable && (
                                                  <ProfileModal
                                                    setShowProfileModal={
                                                      setShowProfileModal
                                                    }
                                                  />
                                                )}
                                            </NonSSRComponent>
                                          </div>
                                        </AIRecommendationIntervalContext.Provider>
                                      </EnableFreeVersionContext.Provider>
                                    </EnableSoundContext.Provider>
                                  </ShowPricingTableContext.Provider>
                                </ShowHomePageContext.Provider>
                              </ShowChordNumbersContext.Provider>
                            </ShowPracticeRoomInitContext.Provider>
                          </MidiOutputContext.Provider>
                        </MidiInputContext.Provider>
                      </ShowPracticeRoomContext.Provider>
                    </LiteVersionNotificationVisibilityContext.Provider>
                  </LiteVersionNotificationContext.Provider>
                </ThemeContext.Provider>
              </AltChordsContext.Provider>
            </ModeContext.Provider>
          </KeyContext.Provider>
        </ColorContext.Provider>
      </PostHogProvider>
    </>
  );
}
