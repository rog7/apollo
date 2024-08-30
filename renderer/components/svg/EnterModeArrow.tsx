import React from "react";
import { getItem } from "../../utils/localStorage";

const PracticeModeTrophy = () => {
  return getItem("theme-preference") === "light-mode" ? (
    <div className="cursor-pointer">
      {" "}
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="20" cy="20" r="20" fill="#313131" />
        <path
          d="M21.2222 14L27.2222 20L21.2222 26"
          stroke="#E5E4DB"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M27.2222 20H13"
          stroke="#E5E4DB"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  ) : (
    <div className="cursor-pointer">
      {" "}
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="20" cy="20" r="20" fill="#ECEBE8" />
        <path
          d="M21.2222 14L27.2222 20L21.2222 26"
          stroke="#313131"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M27.2222 20H13"
          stroke="#313131"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default PracticeModeTrophy;
