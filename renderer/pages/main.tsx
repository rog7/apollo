import MIDIHandler from "../components/MIDIHandler";
import { createContext, useEffect, useState } from "react";
import { getItem, setItem } from "../utils/localStorage";
import NonSSRComponent from "../components/NonSSRComponent";
import Menu from "../components/Menu";
import { Input, WebMidi } from "webmidi";
import {
  darkModeBackgroundColor,
  lightModeBackgroundColor,
} from "../utils/styles";
import SearchMode from "../components/SearchMode";
import UpdateSoftwareNotification from "../components/UpdateSoftwareNotification";
import ProfileIconComponent from "../components/ProfileIconComponent";
import LiteVersionNotification from "../components/LiteVersionNotification";
import LoginStreak from "../components/symbols/LoginStreak";
import { resetSettings } from "../utils/resetSettings";

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

interface MidiInputsContextType {
  midiInputs: Input[];
  setMidiInputs: React.Dispatch<React.SetStateAction<Input[]>>;
}

export const MidiInputsContext = createContext<MidiInputsContextType>({
  midiInputs: [],
  setMidiInputs: () => {},
});

interface ThemeContextType {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "",
  setTheme: () => {},
});

interface SuiteUserContextType {
  isSuiteUser: boolean;
}

export const SuiteUserContext = createContext<SuiteUserContextType>({
  isSuiteUser: false,
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

interface Props {
  setShowProfileIcon: () => {};
  isSuiteUser: boolean;
  showProfileIcon: boolean;
  profileImageUrl: string;
  handleShowSettings: () => {};
  setShowLoginStreakInfo: () => {};
  currentLoginStreak: number;
}

export default function Main() {
  let colorPreference: string;
  let keyPreference: string;
  let modePreference: string;
  let showAltChordsPreference: boolean;
  let themePreference: string;

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
    modePreference = "detect mode";
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
  const [midiInputs, setMidiInputs] = useState<Input[]>([]);
  const [theme, setTheme] = useState(themePreference);
  const [showLiteVersionNotification, setShowLiteVersionNotification] =
    useState(false);

  const [
    liteVersionNotificationIsVisible,
    setliteVersionNotificationVisibility,
  ] = useState(false);

  useEffect(() => {
    WebMidi.enable();

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

  // useEffect(() => {
  //   if (!isSuiteUser) {
  //     resetSettings();

  //     if (getItem("color-preference") === null) {
  //       colorPreference = "#ceb695";
  //       setItem("color-preference", colorPreference);
  //     } else {
  //       colorPreference = getItem("color-preference") as string;
  //     }

  //     if (getItem("key-preference") === null) {
  //       keyPreference = "C";
  //       setItem("key-preference", keyPreference);
  //     } else {
  //       keyPreference = getItem("key-preference") as string;
  //     }

  //     if (getItem("mode-preference") === null) {
  //       modePreference = "detect mode";
  //       setItem("mode-preference", modePreference);
  //     } else {
  //       modePreference = getItem("mode-preference") as string;
  //     }

  //     if (getItem("show-alt-chords-preference") === null) {
  //       showAltChordsPreference = false;
  //       setItem("show-alt-chords-preference", showAltChordsPreference);
  //     } else {
  //       showAltChordsPreference = getItem(
  //         "show-alt-chords-preference"
  //       ) as boolean;
  //     }

  //     if (getItem("theme-preference") === null) {
  //       themePreference = "light-mode";
  //       setItem("theme-preference", themePreference);
  //     } else {
  //       themePreference = getItem("theme-preference") as string;
  //     }

  //     setColor(colorPreference);
  //     setKey(keyPreference);
  //     setMode(modePreference);
  //     setShowAltChords(showAltChordsPreference);
  //     setTheme(themePreference);
  //     setShowProfileIcon(true);
  //   }
  // }, [isSuiteUser]);

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

  return (
    <>
      <ColorContext.Provider value={{ color, setColor }}>
        <KeyContext.Provider value={{ key, setKey }}>
          <ModeContext.Provider value={{ mode, setMode }}>
            <AltChordsContext.Provider
              value={{ showAltChords, setShowAltChords }}
            >
              <MidiInputsContext.Provider value={{ midiInputs, setMidiInputs }}>
                <ThemeContext.Provider value={{ theme, setTheme }}>
                  <SuiteUserContext.Provider value={{ isSuiteUser: true }}>
                    <LiteVersionNotificationContext.Provider
                      value={{
                        showLiteVersionNotification,
                        setShowLiteVersionNotification,
                        triggerUpgradeNotification:
                          triggerUpgradeNotificationFn,
                      }}
                    >
                      <LiteVersionNotificationVisibilityContext.Provider
                        value={{
                          liteVersionNotificationIsVisible,
                          setliteVersionNotificationVisibility,
                        }}
                      >
                        <div>
                          <NonSSRComponent>
                            <UpdateSoftwareNotification />
                            <Menu />
                            {/* {showProfileIcon && (
                              <div
                                style={{
                                  position: "absolute",
                                  right: "3%",
                                  top: "4%",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "20px",
                                    alignItems: "center",
                                  }}
                                >
                                  <LoginStreak
                                    setShowLoginStreakInfo={
                                      setShowLoginStreakInfo
                                    }
                                    currentLoginStreak={currentLoginStreak}
                                  />
                                  <div onClick={handleShowSettings}>
                                    <ProfileIconComponent
                                      profileImageUrl={profileImageUrl}
                                    />
                                  </div>
                                </div>
                              </div>
                            )} */}
                            {/* <MIDIHandler /> */}
                            {mode === "detect mode" ? (
                              <MIDIHandler />
                            ) : (
                              <SearchMode
                                noteOnColor={color}
                                // setShowProfileIcon={setShowProfileIcon}
                              />
                            )}
                            {/* {showLiteVersionNotification == true &&
                          liteVersionNotificationIsVisible == true ? (
                            <LiteVersionNotification />
                          ) : (
                            <></>
                          )} */}
                          </NonSSRComponent>
                        </div>
                      </LiteVersionNotificationVisibilityContext.Provider>
                    </LiteVersionNotificationContext.Provider>
                  </SuiteUserContext.Provider>
                </ThemeContext.Provider>
              </MidiInputsContext.Provider>
            </AltChordsContext.Provider>
          </ModeContext.Provider>
        </KeyContext.Provider>
      </ColorContext.Provider>
    </>
  );
}
