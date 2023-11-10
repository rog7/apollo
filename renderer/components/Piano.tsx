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
    width: "1.1%",
    backgroundColor: noteOnColor,
    border: "1px solid black",
  };

  return (
    <div
      style={{
        height: "18vh",
        width: "100vw",
        display: "flex",
        position: "relative",
      }}
    >
      <div
        style={midiNumbers.includes(21) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(22) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "1.22%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(23) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(24) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(25) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "5.06%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(26) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(27) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "6.98%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(28) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(29) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(30) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "10.82%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(31) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(32) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "12.74%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(33) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(34) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "14.66%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(35) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(36) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(37) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "18.5%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(38) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(39) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "20.42%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(40) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(41) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(42) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "24.26%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(43) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(44) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "26.18%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(45) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(46) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "28.1%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(47) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(48) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(49) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "31.94%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(50) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(51) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "33.86%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(52) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(53) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(54) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "37.7%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(55) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(56) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "39.62%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(57) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(58) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "41.54%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(59) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(60) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(61) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "45.38%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(62) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(63) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "47.3%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(64) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(65) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(66) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "51.14%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(67) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(68) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "53.06%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(69) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(70) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "54.98%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(71) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(72) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(73) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "58.82%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(74) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(75) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "60.74%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(76) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(77) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(78) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "64.58%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(79) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(80) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "66.5%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(81) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(82) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "68.42%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(83) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(84) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(85) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "72.26%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(86) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(87) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "74.18%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(88) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(89) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(90) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "78.02%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(91) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(92) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "79.94%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(93) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(94) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "81.86%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(95) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(96) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(97) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "85.7%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(98) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(99) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "87.62%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(100) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(101) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(102) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "91.46%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(103) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(104) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "93.38%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(105) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={{
          ...(midiNumbers.includes(106) ? blackKeyStyleOn : blackKeyStyleOff),
          position: "absolute",
          left: "95.3%",
        }}
      ></div>
      <div
        style={midiNumbers.includes(107) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(108) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
    </div>
  );
};

export default Piano;
