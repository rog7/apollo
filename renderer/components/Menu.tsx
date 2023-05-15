import Box from "@mui/material/Box";
import React, { RefObject, useContext, useRef, useState } from "react";
import DropdownList from "./DropdownList";
import { ColorContext, ModeContext, ThemeContext } from "../pages/home";
import { ColorResult, BlockPicker } from "react-color";
import { getItem, setItem } from "../utils/localStorage";
import ColorSymbol from "./symbols/ColorSymbol";
import Typography from "@mui/material/Typography";
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
    if (!menuDiv.contains(event.target as Node)) {
      setDropdown("");
    }
  });

  return (
    <Box
      id="menu-id"
      className="theme-transition"
      sx={{
        width: "39%",
        height: "37px",
        marginTop: "32px",
        marginX: "auto",
        paddingX: "70px",
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
      <Box>
        <Box
          sx={{
            cursor: "pointer",
            display: "flex",
            gap: "5px",
            alignItems: "center",
          }}
          onClick={() => handleDropdownChange("OPTIONS")}
        >
          <OptionsSymbol />
          <Typography
            sx={{
              fontFamily: { fontFamily },
              fontWeight: "400",
              color:
                theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
            }}
          >
            OPTIONS
          </Typography>
        </Box>
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
      </Box>
      <Box>
        <Box
          sx={{
            cursor: "pointer",
            display: "flex",
            gap: "5px",
            alignItems: "center",
          }}
          onClick={() => handleDropdownChange("KEY")}
        >
          <KeySymbol />
          <Typography
            sx={{
              fontFamily: { fontFamily },
              fontWeight: "400",
              color:
                theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
            }}
          >
            KEY
          </Typography>
        </Box>
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
      </Box>
      <Box>
        <Box
          sx={{
            cursor: "pointer",
            display: "flex",
            gap: "5px",
            alignItems: "center",
          }}
          onClick={() => handleDropdownChange("COLOR")}
        >
          <ColorSymbol />
          <Typography
            sx={{
              fontFamily: { fontFamily },
              fontWeight: "400",
              color:
                theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
            }}
          >
            COLOR
          </Typography>
        </Box>
        <AnimatePresence>
          {visibleDropdown === "COLOR" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              <Box
                sx={{
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
                  onChange={handleColorChange}
                  disableAlpha={true}
                />
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default Menu;
