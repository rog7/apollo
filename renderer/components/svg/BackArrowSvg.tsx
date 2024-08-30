import React from "react";
import { getItem } from "../../utils/localStorage";

const BackArrowSvg = () => {
  return getItem("theme-preference") === "light-mode" ? (
    <div className="cursor-pointer">
      <svg
        width="18"
        height="14"
        viewBox="0 0 18 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 13L2 7L8 1"
          stroke="#313131"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M1.99995 7L16.2222 7"
          stroke="#313131"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  ) : (
    <div className="cursor-pointer">
      {" "}
      <svg
        width="18"
        height="14"
        viewBox="0 0 18 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 13L2 7L8 1"
          stroke="#E5E4DB"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M1.99995 7L16.2222 7"
          stroke="#E5E4DB"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
export default BackArrowSvg;
