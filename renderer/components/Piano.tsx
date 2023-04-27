import Box from "@mui/material/Box";
import React from "react";

interface Props {
  midiNumbers: number[];
  noteOnColor: string;
}

const Piano = ({ midiNumbers, noteOnColor }: Props) => {
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
    width: "1.2%",
    backgroundColor: noteOnColor,
    border: "1px solid black",
  };

  return (
    <Box
      sx={{
        height: "18vh",
        width: "100vw",
        display: "flex",
        position: "relative",
      }}
    >
      <Box
        style={midiNumbers.includes(21) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(22) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="1.22%"
      ></Box>
      <Box
        style={midiNumbers.includes(23) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(24) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(25) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="5.06%"
      ></Box>
      <Box
        style={midiNumbers.includes(26) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(27) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="6.98%"
      ></Box>
      <Box
        style={midiNumbers.includes(28) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(29) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(30) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="10.82%"
      ></Box>
      <Box
        style={midiNumbers.includes(31) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(32) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="12.74%"
      ></Box>
      <Box
        style={midiNumbers.includes(33) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(34) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="14.66%"
      ></Box>
      <Box
        style={midiNumbers.includes(35) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(36) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(37) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="18.5%"
      ></Box>
      <Box
        style={midiNumbers.includes(38) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(39) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="20.42%"
      ></Box>
      <Box
        style={midiNumbers.includes(40) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(41) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(42) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="24.26%"
      ></Box>
      <Box
        style={midiNumbers.includes(43) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(44) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="26.18%"
      ></Box>
      <Box
        style={midiNumbers.includes(45) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(46) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="28.1%"
      ></Box>
      <Box
        style={midiNumbers.includes(47) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(48) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(49) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="31.94%"
      ></Box>
      <Box
        style={midiNumbers.includes(50) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(51) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="33.86%"
      ></Box>
      <Box
        style={midiNumbers.includes(52) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(53) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(54) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="37.7%"
      ></Box>
      <Box
        style={midiNumbers.includes(55) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(56) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="39.62%"
      ></Box>
      <Box
        style={midiNumbers.includes(57) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(58) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="41.54%"
      ></Box>
      <Box
        style={midiNumbers.includes(59) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(60) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(61) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="45.38%"
      ></Box>
      <Box
        style={midiNumbers.includes(62) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(63) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="47.3%"
      ></Box>
      <Box
        style={midiNumbers.includes(64) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(65) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(66) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="51.14%"
      ></Box>
      <Box
        style={midiNumbers.includes(67) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(68) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="53.06%"
      ></Box>
      <Box
        style={midiNumbers.includes(69) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(70) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="54.98%"
      ></Box>
      <Box
        style={midiNumbers.includes(71) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(72) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(73) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="58.82%"
      ></Box>
      <Box
        style={midiNumbers.includes(74) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(75) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="60.74%"
      ></Box>
      <Box
        style={midiNumbers.includes(76) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(77) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(78) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="64.58%"
      ></Box>
      <Box
        style={midiNumbers.includes(79) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(80) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="66.5%"
      ></Box>
      <Box
        style={midiNumbers.includes(81) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(82) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="68.42%"
      ></Box>
      <Box
        style={midiNumbers.includes(83) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(84) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(85) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="72.26%"
      ></Box>
      <Box
        style={midiNumbers.includes(86) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(87) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="74.18%"
      ></Box>
      <Box
        style={midiNumbers.includes(88) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(89) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(90) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="78.02%"
      ></Box>
      <Box
        style={midiNumbers.includes(91) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(92) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="79.94%"
      ></Box>
      <Box
        style={midiNumbers.includes(93) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(94) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="81.86%"
      ></Box>
      <Box
        style={midiNumbers.includes(95) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(96) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(97) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="85.7%"
      ></Box>
      <Box
        style={midiNumbers.includes(98) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(99) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="87.62%"
      ></Box>
      <Box
        style={midiNumbers.includes(100) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(101) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(102) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="91.46%"
      ></Box>
      <Box
        style={midiNumbers.includes(103) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(104) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="93.38%"
      ></Box>
      <Box
        style={midiNumbers.includes(105) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(106) ? blackKeyStyleOn : blackKeyStyleOff}
        position="absolute"
        left="95.3%"
      ></Box>
      <Box
        style={midiNumbers.includes(107) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
      <Box
        style={midiNumbers.includes(108) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></Box>
    </Box>
  );
};

export default Piano;
