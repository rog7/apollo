import { ipcRenderer } from "electron";
import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import { BlockPicker, ColorResult } from "react-color";
import { ProUserContext } from "../pages/home";
import {
  AltChordsContext,
  ColorContext,
  EnableSoundContext,
  LiteVersionNotificationContext,
  ModeContext,
  ShowChordNumbersContext,
  ShowPracticeRoomContext,
  ThemeContext,
} from "../pages/main";
import { setItem } from "../utils/localStorage";
import { darkModeFontColor, lightModeFontColor } from "../utils/styles";
import DropdownList from "./DropdownList";
import ColorSymbol from "./symbols/ColorSymbol";
import KeySymbol from "./symbols/KeySymbol";
import OptionsSymbol from "./symbols/OptionsSymbol";

const Menu = () => {
  const { color, setColor } = useContext(ColorContext);
  const { mode } = useContext(ModeContext);
  const [visibleDropdown, setDropdown] = useState("");
  const { theme } = useContext(ThemeContext);
  const { triggerUpgradeNotification } = useContext(
    LiteVersionNotificationContext
  );
  const { showPracticeRoom } = useContext(ShowPracticeRoomContext);
  const { showChordNumbers, setShowChordNumbers } = useContext(
    ShowChordNumbersContext
  );
  const { showAltChords, setShowAltChords } = useContext(AltChordsContext);
  const { enableSound, setEnableSound } = useContext(EnableSoundContext);

  const showChordNumbersRef = useRef<boolean | string>(showChordNumbers);
  const enableSoundRef = useRef<boolean | string>(enableSound);

  const showAltChordNamesRef = useRef<boolean | string>(showAltChords);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { isProUser } = useContext(ProUserContext);

  const handleColorChange = (newColor: ColorResult) => {
    setItem("color-preference", newColor.hex);
    setColor(newColor.hex);
  };

  const handleDropdownChange = (menuItem: string) => {
    if (menuItem === visibleDropdown) {
      setDropdown("");
    } else {
      setDropdown(menuItem);
    }
  };

  window.addEventListener("click", (event) => {
    const menuDiv = document.getElementById("menu-id");
    if (menuDiv !== null) {
      if (!menuDiv.contains(event.target as Node)) {
        setDropdown("");
      }
    }
  });

  useEffect(() => {
    ipcRenderer.on("show_chord_numbers_clicked", setShowChordNumbersPreference);
    ipcRenderer.on("enable_sound_clicked", handleEnableSound);
    ipcRenderer.on(
      "show_alt_chord_names_clicked",
      setShowAltChordNamesPreference
    );
  }, []);

  function setShowChordNumbersPreference() {
    if (showChordNumbersRef.current === "false") {
      showChordNumbersRef.current = true;
    } else {
      showChordNumbersRef.current = !showChordNumbersRef.current;
    }

    setItem("show-chord-numbers-preference", showChordNumbersRef.current);
    setShowChordNumbers(showChordNumbersRef.current);
  }

  function handleEnableSound() {
    if (enableSoundRef.current === "false") {
      enableSoundRef.current = true;
    } else {
      enableSoundRef.current = !enableSoundRef.current;
    }

    setItem("enable-sound-preference", enableSoundRef.current);
    setEnableSound(enableSoundRef.current);
  }

  function setShowAltChordNamesPreference() {
    if (showAltChordNamesRef.current === "false") {
      showAltChordNamesRef.current = true;
    } else {
      showAltChordNamesRef.current = !showAltChordNamesRef.current;
    }

    setItem("show-alt-chords-preference", showAltChordNamesRef.current);
    setShowAltChords(showAltChordNamesRef.current);
  }

  return (
    <div
      id="menu-id"
      className="w-[39%] h-[37px] mt-8 mx-auto px-[70px] border-2 rounded-4xl flex justify-between items-center"
      style={{
        borderColor:
          theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
      }}
    >
      <div>
        <div
          className="cursor-pointer flex gap-[5px] items-center"
          onClick={() => handleDropdownChange("OPTIONS")}
        >
          <OptionsSymbol />
          <div
            style={{
              color:
                theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
            }}
          >
            OPTIONS
          </div>
        </div>
        <AnimatePresence>
          {visibleDropdown === "OPTIONS" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              <DropdownList
                dropdownList={
                  !showPracticeRoom
                    ? [
                        "show chord numbers",
                        mode === "detect mode"
                          ? "switch to search mode"
                          : "switch to detect mode",
                        "show alt chord names",
                        theme === "light-mode"
                          ? "switch to dark mode"
                          : "switch to light mode",
                        "edit profile",
                      ]
                    : [
                        "show chord numbers",
                        "show alt chord names",
                        theme === "light-mode"
                          ? "switch to dark mode"
                          : "switch to light mode",
                      ]
                }
                leftPosition={"33%"}
                width={"160px"}
                paddingX={"20px"}
                menuItem={"OPTIONS"}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div>
        <div
          className="cursor-pointer flex gap-[5px] items-center"
          onClick={() => handleDropdownChange("KEY")}
        >
          <KeySymbol />
          <div
            style={{
              color:
                theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
            }}
          >
            KEY
          </div>
        </div>
        <AnimatePresence>
          {visibleDropdown === "KEY" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              <DropdownList
                dropdownList={[
                  "Ab",
                  "A",
                  "Bb",
                  "B",
                  "C",
                  "Db",
                  "D",
                  "Eb",
                  "E",
                  "F",
                  "F#",
                  "G",
                ]}
                leftPosition={"46%"}
                width={"40px"}
                paddingX={"55px"}
                menuItem={"KEY"}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div>
        <div
          className="cursor-pointer flex gap-[5px] items-center"
          onClick={() => handleDropdownChange("COLOR")}
        >
          <ColorSymbol />
          <div
            style={{
              color:
                theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
            }}
          >
            COLOR
          </div>
        </div>
        <AnimatePresence>
          {visibleDropdown === "COLOR" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              <div className="absolute top-[12%] left-[55%] z-[1]">
                <BlockPicker
                  color={color}
                  colors={[
                    "#9D7575",
                    "#E1C7A0",
                    "#DBDC97",
                    "#A1B2A1",
                    "#AABDD9",
                    "#9F9482",
                    "#999999",
                    "#AC9BAA",
                    "#DDCCCC",
                    "#D6EACE",
                  ]}
                  onChange={
                    isProUser ? handleColorChange : triggerUpgradeNotification
                  }
                  className="premium-feature"
                  disableAlpha={true}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* {showProfileModal && (
        <ProfileModal setShowProfileModal={setShowProfileModal} />
      )} */}
    </div>
  );
};

export default Menu;
