import React, { useContext } from "react";
import { getItem, setItem } from "../utils/localStorage";
import {
  AltChordsContext,
  KeyContext,
  ModeContext,
  SuiteUserContext,
  ThemeContext,
} from "../pages/main";
import Checkmark from "./symbols/Checkmark";
import {
  darkModeBackgroundColor,
  darkModeFontColor,
  lightModeBackgroundColor,
  lightModeFontColor,
} from "../utils/styles";

interface Props {
  dropdownList: string[];
  leftPosition: string;
  width: string;
  paddingX: string;
  menuItem: string;
}
const DropdownList = ({
  dropdownList,
  leftPosition,
  width,
  paddingX,
  menuItem,
}: Props) => {
  const { setKey } = useContext(KeyContext);
  const { showAltChords, setShowAltChords } = useContext(AltChordsContext);
  const { setMode } = useContext(ModeContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const { key } = useContext(KeyContext);
  const { isSuiteUser } = useContext(SuiteUserContext);

  const setPreference = (preference: string) => {
    if (menuItem === "OPTIONS" && preference.includes("show alt")) {
      setItem("show-alt-chords-preference", !showAltChords);
      setShowAltChords(!showAltChords);
    } else if (menuItem === "OPTIONS" && preference.includes("search mode")) {
      setItem("mode-preference", "search mode");
      setMode("search mode");
    } else if (menuItem === "OPTIONS" && preference.includes("detect mode")) {
      setItem("mode-preference", "detect mode");
      setMode("detect mode");
    } else if (menuItem === "OPTIONS" && preference.includes("light mode")) {
      setItem("theme-preference", "light-mode");
      setTheme("light-mode");
    } else if (menuItem === "OPTIONS" && preference.includes("dark mode")) {
      setItem("theme-preference", "dark-mode");
      setTheme("dark-mode");
    } else if (menuItem === "KEY") {
      setItem("key-preference", preference);
      setKey(preference);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          top: "72px",
          borderRadius: "0px 0px 50px 50px",
          borderWidth: "3px",
          borderStyle: "solid",
          borderColor:
            theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
          paddingTop: "11px",
          paddingLeft: paddingX,
          paddingRight: paddingX,
          left: leftPosition,
          width: width,
          color:
            theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
          backgroundColor:
            theme === "light-mode"
              ? lightModeBackgroundColor
              : darkModeBackgroundColor,
          zIndex: 1,
        }}
      >
        {dropdownList.map((value, index) => (
          <div
            style={{
              fontSize: "16px",
              paddingBottom: "8px",
              cursor: "pointer",
              width: "100%",
              color:
                theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
            }}
            onClick={isSuiteUser ? () => setPreference(value) : null}
            key={index}
            className={!isSuiteUser ? "premium-feature" : undefined}
          >
            {value} {menuItem === "KEY" && value === key && <Checkmark />}
            {menuItem === "OPTIONS" &&
            value.includes("show alt") &&
            getItem("show-alt-chords-preference") === "true" ? (
              <Checkmark />
            ) : (
              <></>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default DropdownList;
