import Button from "@mui/material/Button";
import React, { useContext, useState } from "react";
import { ChromePicker, ColorResult, BlockPicker } from "react-color";
import { getItem, setItem } from "../utils/localStorage";
import Box from "@mui/material/Box";

const ColorPicker = () => {
  const [color, setColor] = useState(getItem("color-preference"));

  const [showColorPicker, setShowColorPicker] = useState(false);
  const handleColorChange = (newColor: ColorResult) => {
    setItem("color-preference", newColor.hex);
    setColor(newColor.hex);
  };

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={toggleColorPicker}
        sx={{ fontFamily: "Outfit", position: "absolute", left: "700px" }}
      >
        Set Color
      </Button>
      {showColorPicker && (
        <Box
          sx={{
            position: "absolute",
            top: "85px",
            left: "880px",
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
            ]}
            onChange={handleColorChange}
            disableAlpha={true}
          />
        </Box>
      )}
    </>
  );
};

export default ColorPicker;
