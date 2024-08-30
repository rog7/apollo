import React, { useContext } from "react";
import { Input } from "webmidi";
import MIDIInputSymbol from "./symbols/MIDIInputSymbol";
import { darkModeFontColor, lightModeFontColor } from "../utils/styles";
import { ThemeContext } from "../pages/main";

interface Props {
  midiInput: Input | null;
}

const MidiInputDefaultMessage = ({ midiInput }: Props) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="absolute top-[40%] w-full flex flex-col items-center leading-8">
      {midiInput === null && (
        <>
          {/* <MIDIInputSymbol /> */}
          <div
            className="text-lg mt-2"
            style={{
              color:
                theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
            }}
          >
            No midi input devices selected
          </div>
        </>
      )}
    </div>
  );
};

export default MidiInputDefaultMessage;
