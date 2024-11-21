import { useContext } from "react";
import { Input } from "webmidi";
import { ThemeContext } from "../pages/main";
import { darkModeFontColor, lightModeFontColor } from "../utils/styles";

interface Props {
  midiInputs: Input[] | null;
}

const MidiInputDefaultMessage = ({ midiInputs }: Props) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="absolute top-[40%] w-full flex flex-col items-center leading-8">
      {midiInputs.length === 0 && (
        <>
          {/* <MIDIInputSymbol /> */}
          <div
            className="text-lg mt-2"
            style={{
              color:
                theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
            }}
          >
            No MIDI input detected. Connect a device to begin.
          </div>
        </>
      )}
    </div>
  );
};

export default MidiInputDefaultMessage;
