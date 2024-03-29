import MIDIHandler from "../components/MIDIHandler";
import { createContext, useEffect, useState } from "react";
import { getItem, setItem } from "../utils/localStorage";
import NonSSRComponent from "../components/NonSSRComponent";
import Menu from "../components/Menu";
import { Input, Output, WebMidi } from "webmidi";
import {
  darkModeBackgroundColor,
  lightModeBackgroundColor,
} from "../utils/styles";
import SearchMode from "../components/SearchMode";
import UpdateSoftwareNotification from "../components/UpdateSoftwareNotification";
import PracticeRoomInit from "../components/PracticeRoomInit";
import MIDISetup from "../components/MIDISetup";
import * as ColorUtils from "../utils/determineColors";

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
  midiInput: Input;
  setMidiInput: React.Dispatch<React.SetStateAction<Input>>;
}

export const MidiInputContext = createContext<MidiInputContextType>({
  midiInput: null,
  setMidiInput: () => {},
});

interface MidiOutputContextType {
  midiOutput: Output;
  setMidiOutput: React.Dispatch<React.SetStateAction<Output>>;
}

export const MidiOutputContext = createContext<MidiOutputContextType>({
  midiOutput: null,
  setMidiOutput: () => {},
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
  const [midiInput, setMidiInput] = useState<Input>(null);
  const [midiOutput, setMidiOutput] = useState<Output>(null);
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

  const handleSearch = (hideButton: boolean) => {
    setShowPracticeRoomButton(!hideButton);
  };

  return (
    <>
      <ColorContext.Provider value={{ color, setColor }}>
        <KeyContext.Provider value={{ key, setKey }}>
          <ModeContext.Provider value={{ mode, setMode }}>
            <AltChordsContext.Provider
              value={{ showAltChords, setShowAltChords }}
            >
              <ThemeContext.Provider value={{ theme, setTheme }}>
                <SuiteUserContext.Provider value={{ isSuiteUser: true }}>
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
                          value={{ midiInput, setMidiInput }}
                        >
                          <MidiOutputContext.Provider
                            value={{ midiOutput, setMidiOutput }}
                          >
                            <ShowPracticeRoomInitContext.Provider
                              value={{
                                showPracticeRoomInit,
                                setShowPracticeRoomInit,
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
                                          position: "absolute",
                                          right: "3%",
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
                                  <Menu />
                                  <div className="absolute top-[3%] left-[3%] flex gap-[10px]">
                                    <div>
                                      <MIDISetup label={"Midi Input"} />
                                    </div>
                                    <div>
                                      <MIDISetup label={"Midi Output"} />
                                    </div>
                                  </div>
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

                                  {showPracticeRoomInit ? (
                                    <PracticeRoomInit />
                                  ) : mode === "detect mode" ? (
                                    <MIDIHandler
                                      socket={null}
                                      roomName={null}
                                      playAccess={null}
                                    />
                                  ) : (
                                    <SearchMode
                                      noteOnColor={color}
                                      onSearch={handleSearch}
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
                            </ShowPracticeRoomInitContext.Provider>
                          </MidiOutputContext.Provider>
                        </MidiInputContext.Provider>
                      </ShowPracticeRoomContext.Provider>
                    </LiteVersionNotificationVisibilityContext.Provider>
                  </LiteVersionNotificationContext.Provider>
                </SuiteUserContext.Provider>
              </ThemeContext.Provider>
            </AltChordsContext.Provider>
          </ModeContext.Provider>
        </KeyContext.Provider>
      </ColorContext.Provider>
    </>
  );
}
