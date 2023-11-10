import React, { useContext, useState } from "react";
import DropdownList from "./DropdownList";
import {
  ColorContext,
  LiteVersionNotificationContext,
  ModeContext,
  SuiteUserContext,
  ThemeContext,
} from "../pages/main";
import { ColorResult, BlockPicker } from "react-color";
import { setItem } from "../utils/localStorage";
import ColorSymbol from "./symbols/ColorSymbol";
import {
  darkModeFontColor,
  fontFamily,
  lightModeFontColor,
} from "../utils/styles";
import { AnimatePresence, motion } from "framer-motion";
import KeySymbol from "./symbols/KeySymbol";
import OptionsSymbol from "./symbols/OptionsSymbol";

const Menu = () => {
  const { color, setColor } = useContext(ColorContext);
  const { mode } = useContext(ModeContext);
  const [visibleDropdown, setDropdown] = useState("");
  const { theme } = useContext(ThemeContext);
  const { isSuiteUser } = useContext(SuiteUserContext);
  const { triggerUpgradeNotification } = useContext(
    LiteVersionNotificationContext
  );

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

  return (
    <div
      id="menu-id"
      className="theme-transition"
      style={{
        width: "39%",
        height: "37px",
        marginTop: "32px",
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: "70px",
        paddingRight: "70px",
        textAlign: "center",
        borderWidth: "3px",
        borderStyle: "solid",
        borderColor:
          theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
        borderRadius: "50px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transition: "border-color 0.5s",
      }}
    >
      <div>
        <div
          style={{
            cursor: "pointer",
            display: "flex",
            gap: "5px",
            alignItems: "center",
          }}
          onClick={() => handleDropdownChange("OPTIONS")}
        >
          <OptionsSymbol />
          <div
            style={{
              fontFamily: fontFamily,
              fontWeight: "400",
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
                dropdownList={[
                  mode === "detect mode"
                    ? "switch to search mode"
                    : "switch to detect mode",
                  "show alt chord names",
                  theme === "light-mode"
                    ? "switch to dark mode"
                    : "switch to light mode",
                ]}
                leftPosition={"27%"}
                width={"125px"}
                paddingX={"25px"}
                menuItem={"OPTIONS"}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div>
        <div
          style={{
            cursor: "pointer",
            display: "flex",
            gap: "5px",
            alignItems: "center",
          }}
          onClick={() => handleDropdownChange("KEY")}
        >
          <KeySymbol />
          <div
            style={{
              fontFamily: fontFamily,
              fontWeight: "400",
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
                leftPosition={"44.5%"}
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
          style={{
            cursor: "pointer",
            display: "flex",
            gap: "5px",
            alignItems: "center",
          }}
          onClick={() => handleDropdownChange("COLOR")}
        >
          <ColorSymbol />
          <div
            style={{
              fontFamily: fontFamily,
              fontWeight: "400",
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
              <div
                style={{
                  position: "absolute",
                  top: "85px",
                  left: "61%",
                  zIndex: 1,
                }}
              >
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
                    isSuiteUser ? handleColorChange : triggerUpgradeNotification
                  }
                  className="premium-feature"
                  disableAlpha={true}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Menu;
