import React from "react";
import { getItem } from "../../utils/localStorage";

const LockSvg = () => {
  return getItem("theme-preference") === "light-mode" ? (
    <svg
      width="43"
      height="43"
      viewBox="0 0 43 43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.9668 20.4082V17.2C27.9668 13.6391 25.0609 10.75 21.5 10.75C17.9391 10.75 15.0332 13.6391 15.0332 17.2V20.4082H12.8916V32.25H30.1084V20.4082H27.9668ZM17.2168 17.2C17.2168 14.8232 19.1232 12.9 21.5 12.9C23.8768 12.9 25.7832 14.8232 25.7832 17.2V20.4082H17.2168V17.2Z"
        fill="#313131"
      />
    </svg>
  ) : (
    <svg
      width="43"
      height="43"
      viewBox="0 0 43 43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.9668 20.4082V17.2C27.9668 13.6391 25.0609 10.75 21.5 10.75C17.9391 10.75 15.0332 13.6391 15.0332 17.2V20.4082H12.8916V32.25H30.1084V20.4082H27.9668ZM17.2168 17.2C17.2168 14.8232 19.1232 12.9 21.5 12.9C23.8768 12.9 25.7832 14.8232 25.7832 17.2V20.4082H17.2168V17.2Z"
        fill="#E5E4DB"
      />
    </svg>
  );
};

export default LockSvg;
