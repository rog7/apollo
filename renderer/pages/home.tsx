import MIDIHandler from "../components/MIDIHandler";
import { createContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
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

export default function Home() {
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

  useEffect(() => {
    WebMidi.enable();
  }, []);

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
                  <Box>
                    <NonSSRComponent>
                      <UpdateSoftwareNotification />
                      <Menu />
                      {mode === "detect mode" ? (
                        <MIDIHandler />
                      ) : (
                        <SearchMode noteOnColor={color} />
                      )}
                    </NonSSRComponent>
                  </Box>
                </ThemeContext.Provider>
              </MidiInputsContext.Provider>
            </AltChordsContext.Provider>
          </ModeContext.Provider>
        </KeyContext.Provider>
      </ColorContext.Provider>
    </>
  );
}
