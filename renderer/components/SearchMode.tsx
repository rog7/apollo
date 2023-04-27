import Box from "@mui/material/Box";
import React, { useContext, useEffect, useRef, useState } from "react";
import { WebMidi } from "webmidi";
import ArrowBackSymbol from "./symbols/ArrowBackSymbol";
import ArrowForwardSymbol from "./symbols/ArrowForwardSymbol";
import SearchSymbol from "./symbols/SearchSymbol";
import {
  darkModeFontColor,
  fontFamily,
  lightModeFontColor,
} from "../utils/styles";
import Typography from "@mui/material/Typography";
import { AltChordsContext, KeyContext, ThemeContext } from "../pages/home";
import CancelSymbol from "./symbols/CancelSymbol";
import { detect } from "@tonaljs/chord-detect";
import { Note } from "tonal";
import "animate.css";
import { midiNumbersArray } from "../utils/midiNumbersArray";
import convertChordToCorrectKey from "../utils/chordConversion";
import { getItem } from "../utils/localStorage";

interface Props {
  noteOnColor: string;
}

const SearchMode = ({ noteOnColor }: Props) => {
  const [selectedNotes, setSelectedNotes] = useState<number[]>([]);
  const midiNumbers = useRef<number[]>([]);
  const [searchResults, setSearchResults] = useState<number[][]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { theme } = useContext(ThemeContext);
  const index = useRef(0);
  const [currentChord, setCurrentChord] = useState("");
  const [searchResult, setSearchResult] = useState<number[]>([]);
  const divRef = useRef(null);
  const [altChords, setAltChords] = useState([""]);
  const textIndex = useRef(0);
  const allowNavigation = useRef(false);
  const texts = ["click below", "play keyboard"];
  const isLeftArrowPressed = useRef(false);
  const isRightArrowPressed = useRef(false);
  const { showAltChords } = useContext(AltChordsContext);
  const { key } = useContext(KeyContext);
  const updateAltChordsDisplay = useRef(true);

  useEffect(() => {
    if (WebMidi !== undefined) {
      WebMidi.addListener("connected", handleMidiInputs);
      WebMidi.addListener("disconnected", handleMidiInputs);

      for (const input of WebMidi.inputs) {
        if (input.id !== "") {
          input.addListener("noteon", handleMIDIMessage);
          input.addListener("noteoff", handleMIDIMessage);
        }
      }
    }

    const interval = setInterval(() => {
      const div = document.querySelector(".search");
      if (div !== null) {
        div.classList.add("animate__headShake");

        setTimeout(() => {
          div.classList.remove("animate__headShake");
        }, 1000);
      }
    }, 2000);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (searchResults.length > 0) {
      const chords = detect(
        searchResults[index.current].map((value) => Note.fromMidi(value)),
        { assumePerfectFifth: true }
      );

      const mainChord = convertChordToCorrectKey(chords[0], key);

      setCurrentChord(mainChord);

      const altChordsInKey = chords
        .slice(1, 4)
        .map((chord) => convertChordToCorrectKey(chord, key));

      setAltChords(altChordsInKey);
    }
  }, [key]);

  function handleKeyDown(event) {
    if (searchResults.length > 0) {
      if (
        event.key === "ArrowLeft" &&
        allowNavigation.current &&
        index.current !== 0 &&
        !isLeftArrowPressed.current
      ) {
        isLeftArrowPressed.current = true;
        handleGoingBackInSearchResults();
      } else if (
        event.key === "ArrowRight" &&
        allowNavigation.current &&
        index.current !== searchResults.length - 1 &&
        !isRightArrowPressed.current
      ) {
        isRightArrowPressed.current = true;
        handleGoingForwardInSearchResults();
      }
    }
  }

  function handleKeyUp(event) {
    if (event.key === "ArrowLeft") {
      isLeftArrowPressed.current = false;
    } else if (event.key === "ArrowRight") {
      isRightArrowPressed.current = false;
    }
  }

  // Add event listener when component mounts
  window.addEventListener("keydown", handleKeyDown);

  // Add event listener when component mounts
  window.addEventListener("keyup", handleKeyUp);

  const handleMidiInputs = () => {
    if (WebMidi.inputs.length !== 0) {
      for (const input of WebMidi.inputs) {
        if (input.id !== null) {
          input.addListener("noteon", handleMIDIMessage);
          input.addListener("noteoff", handleMIDIMessage);
        }
      }
    }
  };

  // Function to handle incoming MIDI data
  function handleMIDIMessage(event: any) {
    if (event.data.length === 3) {
      const [status, pitch, velocity] = event.data;
      if (status === 144 && velocity !== 0) {
        midiNumbers.current = Array.from(
          new Set(midiNumbers.current.concat(pitch))
        ).sort((a, b) => {
          return a - b;
        });

        setSelectedNotes(midiNumbers.current);
      } else if (status === 128 || (status === 144 && velocity === 0)) {
        midiNumbers.current = midiNumbers.current.filter(
          (value) => value !== pitch
        );
        setSelectedNotes(midiNumbers.current);
      }
    }
  }

  const whiteKeyStyleOff = {
    height: "100%",
    width: "1.92307692%",
    border: "0.7px solid black",
    borderTop: "1.7px solid black",
    backgroundColor: "white",
  };

  const blackKeyStyleOff = {
    height: "57%",
    width: "1%",
    backgroundColor: "#484848",
    borderWidth: "1px 2px 8px 2px",
    borderStyle: "solid",
    borderColor: "black",
  };

  const whiteKeyStyleOn = {
    height: "100%",
    width: "1.92307692%",
    border: "0.7px solid black",
    borderTop: "1.7px solid black",
    backgroundColor: noteOnColor,
  };

  const blackKeyStyleOn = {
    height: "63.8%",
    width: "1.1%",
    backgroundColor: noteOnColor,
    border: "1px solid black",
  };

  const handleClick = (midiNumber: number) => {
    if (selectedNotes.includes(midiNumber)) {
      const newMidiNumbers = selectedNotes.filter(
        (note) => note !== midiNumber
      );
      midiNumbers.current = newMidiNumbers;
      setSelectedNotes(newMidiNumbers);
    } else {
      const newMidiNumbers = selectedNotes.concat(midiNumber);
      midiNumbers.current = newMidiNumbers;
      setSelectedNotes(newMidiNumbers);
    }
  };

  const handleSearch = () => {
    const randomFn = function random() {
      return Math.random() - 0.5;
    };

    const tempValues = midiNumbersArray
      .filter((midiNumbers) =>
        selectedNotes.every((value) => midiNumbers.includes(value))
      )
      .sort(randomFn);

    const values = tempValues.filter((midiNumbers) => {
      const chords = detect(
        midiNumbers.map((value) => Note.fromMidi(value)),
        { assumePerfectFifth: true }
      );

      return chords.length > 0;
    });

    if (values.length === 0) {
      setIsSearching(true);
    } else {
      const chords = detect(
        values[index.current].map((value) => Note.fromMidi(value)),
        { assumePerfectFifth: true }
      );

      const mainChord = convertChordToCorrectKey(
        chords[0],
        getItem("key-preference")
      );

      setAltChords(
        chords
          .slice(1, 4)
          .map((chord) =>
            convertChordToCorrectKey(chord, getItem("key-preference"))
          )
      );

      allowNavigation.current = true;
      setCurrentChord(mainChord);
      setSearchResult(values[index.current]);
      setSearchResults(values);
      setIsSearching(true);
    }
  };

  const cancelSearch = () => {
    setSearchResults([]);
    setSelectedNotes([]);
    setSearchResult([]);
    index.current = 0;
    allowNavigation.current = false;
    midiNumbers.current = [];
    setCurrentChord("");
    setIsSearching(false);
  };

  const handleGoingBackInSearchResults = () => {
    index.current -= 1;

    const chords = detect(
      searchResults[index.current].map((value) => Note.fromMidi(value)),
      { assumePerfectFifth: true }
    );

    console.log("key", getItem("key-preference"));

    const mainChord = convertChordToCorrectKey(
      chords[0],
      getItem("key-preference")
    );

    setAltChords(
      chords
        .slice(1, 4)
        .map((chord) =>
          convertChordToCorrectKey(chord, getItem("key-preference"))
        )
    );

    setSearchResult(searchResults[index.current]);

    setCurrentChord(mainChord);
  };

  const handleGoingForwardInSearchResults = () => {
    index.current += 1;

    const chords = detect(
      searchResults[index.current].map((value) => Note.fromMidi(value)),
      { assumePerfectFifth: true }
    );

    const mainChord = convertChordToCorrectKey(
      chords[0],
      getItem("key-preference")
    );

    setAltChords(
      chords
        .slice(1, 4)
        .map((chord) =>
          convertChordToCorrectKey(chord, getItem("key-preference"))
        )
    );

    setSearchResult(searchResults[index.current]);

    setCurrentChord(mainChord);
  };

  return (
    <Box>
      {!isSearching ? (
        <Box
          className="theme-transition"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingX: "60px",
            position: "absolute",
            width: "100%",
            top: "43%",
            boxSizing: "border-box",
          }}
        >
          {selectedNotes.length === 0 ? (
            <Typography
              variant="h4"
              sx={{
                fontFamily: { fontFamily },
                fontWeight: "400",
                color:
                  theme === "light-mode"
                    ? lightModeFontColor
                    : darkModeFontColor,
              }}
            >
              {texts[textIndex.current]}
            </Typography>
          ) : (
            <Box
              ref={divRef}
              className="animate__animated search"
              sx={{ cursor: "pointer" }}
              onClick={handleSearch}
            >
              <SearchSymbol />
            </Box>
          )}
        </Box>
      ) : (
        <>
          {searchResults.length > 0 ? (
            <Box>
              <Box
                className="theme-transition"
                sx={{
                  position: "absolute",
                  left: "5%",
                  top: "5%",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: { fontFamily },
                    fontWeight: "400",
                    color:
                      theme === "light-mode"
                        ? lightModeFontColor
                        : darkModeFontColor,
                  }}
                  variant="h5"
                >
                  Key: {getItem("key-preference")}
                </Typography>
              </Box>
              <Box
                className="theme-transition"
                sx={{
                  position: "absolute",
                  right: "5%",
                  top: "5%",
                  cursor: "pointer",
                }}
                onClick={cancelSearch}
              >
                <CancelSymbol />
              </Box>
              <Box
                className="theme-transition"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingX: "60px",
                  position: "absolute",
                  width: "100%",
                  height: "70%",
                  boxSizing: "border-box",
                }}
              >
                <Box
                  sx={{
                    cursor: index.current === 0 ? "arrow" : "pointer",
                    opacity: index.current === 0 ? 0 : 1,
                  }}
                  onClick={
                    index.current !== 0
                      ? handleGoingBackInSearchResults
                      : undefined
                  }
                >
                  <ArrowBackSymbol />
                </Box>
                <Box>
                  {" "}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      color:
                        theme === "light-mode"
                          ? lightModeFontColor
                          : darkModeFontColor,
                    }}
                  >
                    <Typography
                      variant="h2"
                      sx={{
                        fontFamily: { fontFamily },
                        fontWeight: "400",
                        color:
                          theme === "light-mode"
                            ? lightModeFontColor
                            : darkModeFontColor,
                      }}
                    >
                      {currentChord}
                    </Typography>
                    {showAltChords &&
                      updateAltChordsDisplay.current &&
                      altChords.map((value, index) => (
                        <Typography
                          sx={{
                            fontFamily: { fontFamily },
                            fontWeight: "200",
                            color:
                              theme === "light-mode"
                                ? lightModeFontColor
                                : darkModeFontColor,
                          }}
                          variant="h5"
                          key={index}
                        >
                          {value}
                        </Typography>
                      ))}
                  </Box>
                </Box>
                <Box
                  sx={{
                    cursor:
                      index.current === searchResults.length - 1
                        ? "arrow"
                        : "pointer",
                    opacity: index.current === searchResults.length - 1 ? 0 : 1,
                  }}
                  onClick={
                    index.current !== searchResults.length - 1
                      ? handleGoingForwardInSearchResults
                      : undefined
                  }
                >
                  <ArrowForwardSymbol />
                </Box>
              </Box>
            </Box>
          ) : (
            <Box
              className="theme-transition"
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                position: "absolute",
                top: "40%",
                width: "100%",
                gap: "20px",
              }}
            >
              <Box sx={{ cursor: "pointer" }} onClick={cancelSearch}>
                <CancelSymbol />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: { fontFamily },
                  fontWeight: "400",
                  color:
                    theme === "light-mode"
                      ? lightModeFontColor
                      : darkModeFontColor,
                }}
              >
                no chords were found
              </Typography>
            </Box>
          )}
        </>
      )}
      <Box sx={{ position: "absolute", bottom: "0px" }}>
        {!isSearching ? (
          <Box
            sx={{
              height: "18vh",
              width: "100vw",
              display: "flex",
              cursor: "pointer",
            }}
            position="relative"
          >
            <Box
              style={
                selectedNotes.includes(21) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(21)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(22) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="1.22%"
              onClick={() => handleClick(22)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(23) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(23)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(24) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(24)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(25) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="5.06%"
              onClick={() => handleClick(25)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(26) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(26)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(27) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="6.98%"
              onClick={() => handleClick(27)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(28) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(28)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(29) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(29)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(30) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="10.82%"
              onClick={() => handleClick(30)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(31) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(31)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(32) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="12.74%"
              onClick={() => handleClick(32)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(33) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(33)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(34) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="14.66%"
              onClick={() => handleClick(34)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(35) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(35)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(36) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(36)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(37) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="18.5%"
              onClick={() => handleClick(37)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(38) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(38)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(39) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="20.42%"
              onClick={() => handleClick(39)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(40) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(40)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(41) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(41)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(42) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="24.26%"
              onClick={() => handleClick(42)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(43) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(43)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(44) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="26.18%"
              onClick={() => handleClick(44)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(45) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(45)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(46) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="28.1%"
              onClick={() => handleClick(46)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(47) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(47)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(48) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(48)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(49) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="31.94%"
              onClick={() => handleClick(49)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(50) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(50)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(51) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="33.86%"
              onClick={() => handleClick(51)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(52) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(52)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(53) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(53)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(54) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="37.7%"
              onClick={() => handleClick(54)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(55) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(55)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(56) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="39.62%"
              onClick={() => handleClick(56)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(57) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(57)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(58) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="41.54%"
              onClick={() => handleClick(58)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(59) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(59)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(60) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(60)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(61) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="45.38%"
              onClick={() => handleClick(61)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(62) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(62)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(63) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="47.3%"
              onClick={() => handleClick(63)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(64) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(64)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(65) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(65)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(66) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="51.14%"
              onClick={() => handleClick(66)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(67) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(67)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(68) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="53.06%"
              onClick={() => handleClick(68)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(69) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(69)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(70) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="54.98%"
              onClick={() => handleClick(70)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(71) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(71)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(72) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(72)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(73) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="58.82%"
              onClick={() => handleClick(73)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(74) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(74)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(75) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="60.74%"
              onClick={() => handleClick(75)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(76) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(76)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(77) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(77)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(78) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="64.58%"
              onClick={() => handleClick(78)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(79) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(79)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(80) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="66.5%"
              onClick={() => handleClick(80)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(81) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(81)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(82) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="68.42%"
              onClick={() => handleClick(82)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(83) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(83)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(84) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(84)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(85) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="72.26%"
              onClick={() => handleClick(85)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(86) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(86)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(87) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="74.18%"
              onClick={() => handleClick(87)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(88) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(88)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(89) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(89)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(90) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="78.02%"
              onClick={() => handleClick(90)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(91) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(91)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(92) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="79.94%"
              onClick={() => handleClick(92)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(93) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(93)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(94) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="81.86%"
              onClick={() => handleClick(94)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(95) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(95)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(96) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(96)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(97) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="85.7%"
              onClick={() => handleClick(97)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(98) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(98)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(99) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="87.62%"
              onClick={() => handleClick(99)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(100) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(100)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(101) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(101)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(102) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="91.46%"
              onClick={() => handleClick(102)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(103) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(103)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(104) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="93.38%"
              onClick={() => handleClick(104)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(105) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(105)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(106) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="95.3%"
              onClick={() => handleClick(106)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(107) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(107)}
            ></Box>
            <Box
              style={
                selectedNotes.includes(108) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(108)}
            ></Box>
          </Box>
        ) : (
          <Box
            sx={{
              height: "18vh",
              width: "100vw",
              display: "flex",
              cursor: "arrow",
            }}
            position="relative"
          >
            <Box
              style={
                searchResult.includes(21) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(22) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="1.22%"
            ></Box>
            <Box
              style={
                searchResult.includes(23) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(24) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(25) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="5.06%"
            ></Box>
            <Box
              style={
                searchResult.includes(26) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(27) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="6.98%"
            ></Box>
            <Box
              style={
                searchResult.includes(28) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(29) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(30) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="10.82%"
            ></Box>
            <Box
              style={
                searchResult.includes(31) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(32) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="12.74%"
            ></Box>
            <Box
              style={
                searchResult.includes(33) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(34) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="14.66%"
            ></Box>
            <Box
              style={
                searchResult.includes(35) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(36) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(37) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="18.5%"
            ></Box>
            <Box
              style={
                searchResult.includes(38) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(39) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="20.42%"
            ></Box>
            <Box
              style={
                searchResult.includes(40) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(41) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(42) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="24.26%"
            ></Box>
            <Box
              style={
                searchResult.includes(43) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(44) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="26.18%"
            ></Box>
            <Box
              style={
                searchResult.includes(45) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(46) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="28.1%"
            ></Box>
            <Box
              style={
                searchResult.includes(47) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(48) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(49) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="31.94%"
            ></Box>
            <Box
              style={
                searchResult.includes(50) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(51) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="33.86%"
            ></Box>
            <Box
              style={
                searchResult.includes(52) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(53) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(54) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="37.7%"
            ></Box>
            <Box
              style={
                searchResult.includes(55) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(56) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="39.62%"
            ></Box>
            <Box
              style={
                searchResult.includes(57) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(58) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="41.54%"
            ></Box>
            <Box
              style={
                searchResult.includes(59) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(60) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(61) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="45.38%"
            ></Box>
            <Box
              style={
                searchResult.includes(62) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(63) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="47.3%"
            ></Box>
            <Box
              style={
                searchResult.includes(64) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(65) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(66) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="51.14%"
            ></Box>
            <Box
              style={
                searchResult.includes(67) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(68) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="53.06%"
            ></Box>
            <Box
              style={
                searchResult.includes(69) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(70) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="54.98%"
            ></Box>
            <Box
              style={
                searchResult.includes(71) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(72) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(73) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="58.82%"
            ></Box>
            <Box
              style={
                searchResult.includes(74) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(75) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="60.74%"
            ></Box>
            <Box
              style={
                searchResult.includes(76) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(77) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(78) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="64.58%"
            ></Box>
            <Box
              style={
                searchResult.includes(79) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(80) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="66.5%"
            ></Box>
            <Box
              style={
                searchResult.includes(81) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(82) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="68.42%"
            ></Box>
            <Box
              style={
                searchResult.includes(83) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(84) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(85) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="72.26%"
            ></Box>
            <Box
              style={
                searchResult.includes(86) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(87) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="74.18%"
            ></Box>
            <Box
              style={
                searchResult.includes(88) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(89) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(90) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="78.02%"
            ></Box>
            <Box
              style={
                searchResult.includes(91) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(92) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="79.94%"
            ></Box>
            <Box
              style={
                searchResult.includes(93) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(94) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="81.86%"
            ></Box>
            <Box
              style={
                searchResult.includes(95) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(96) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(97) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="85.7%"
            ></Box>
            <Box
              style={
                searchResult.includes(98) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(99) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="87.62%"
            ></Box>
            <Box
              style={
                searchResult.includes(100) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(101) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(102) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="91.46%"
            ></Box>
            <Box
              style={
                searchResult.includes(103) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(104) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="93.38%"
            ></Box>
            <Box
              style={
                searchResult.includes(105) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(106) ? blackKeyStyleOn : blackKeyStyleOff
              }
              position="absolute"
              left="95.3%"
            ></Box>
            <Box
              style={
                searchResult.includes(107) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
            <Box
              style={
                searchResult.includes(108) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SearchMode;
