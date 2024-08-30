import React from "react";
import { getItem } from "../../utils/localStorage";

const GoldTrophySvg = () => {
  return getItem("theme-preference") === "light-mode" ? (
    <svg
      width="30"
      height="30"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.76445 14.5127L9.06836 16.8309H12.9742L12.3426 14.5664"
        fill="#FBBA22"
      />
      <path
        d="M10.9594 14.659C15.5807 14.659 15.5807 11.1098 15.5807 11.1098V4.24121H6.46484V11.1098C6.46484 11.1098 6.46484 14.659 11.0861 14.659H10.9594Z"
        fill="#FBBA22"
      />
      <path
        d="M11.0732 16.8311H13.0305C13.0305 16.8311 14.9533 16.8805 14.9533 18.567H7.1416C7.1416 16.8783 9.06445 16.8311 9.06445 16.8311H11.0217"
        fill="#FBBA22"
      />
      <path
        d="M17.3461 8.2571V5.57578C17.3461 5.33457 17.1579 5.14074 16.9236 5.14074H15.8592V4.24266C15.8592 4.00145 15.6709 3.80762 15.4367 3.80762H6.56322C6.32899 3.80762 6.14077 4.00145 6.14077 4.24266V5.14074H5.07629C4.84206 5.14074 4.65384 5.33457 4.65384 5.57578V8.2571C4.65384 8.28295 4.6392 9.16595 5.22268 9.78406C5.46737 10.0425 5.77688 10.2126 6.14077 10.2966V11.1279C6.14077 11.1624 6.18469 14.0505 9.23175 14.8904L8.77584 16.4561C7.96022 16.5789 6.79954 17.1281 6.79954 18.6033C6.79954 18.8446 6.98776 19.0384 7.22199 19.0384H14.826C15.0603 19.0384 15.2485 18.8446 15.2485 18.6033C15.2485 17.1044 14.0522 16.5638 13.2283 16.4518L12.8016 14.8818C15.8152 14.0289 15.8592 11.1624 15.8592 11.1279V10.2966C16.223 10.2126 16.5305 10.0425 16.7772 9.78406C17.3607 9.16595 17.3461 8.28295 17.3461 8.2571ZM5.82707 9.17672C5.49246 8.82352 5.49664 8.27433 5.49664 8.27003V6.01298H6.13868V9.38778C6.01948 9.33609 5.91282 9.26718 5.82707 9.17672ZM12.8999 17.2982C12.902 17.2982 12.902 17.2982 12.8999 17.2982H12.9418C13.0714 17.3025 14.0711 17.3628 14.3388 18.1683H7.70927C7.97695 17.3628 8.97452 17.3025 9.09372 17.2982H12.8999ZM9.66674 16.4281L10.0662 15.0584C10.3276 15.0929 10.6078 15.1122 10.9048 15.1187C10.9153 15.1187 10.9278 15.1209 10.9383 15.1209H11.0617C11.0721 15.1209 11.0847 15.1209 11.0951 15.1187C11.4067 15.1122 11.6974 15.0907 11.9714 15.0541L12.3457 16.4303H9.66674V16.4281ZM15.0143 11.1258C15.0122 11.2529 14.9411 14.2185 11.001 14.2486C10.6329 14.2465 10.2983 14.2185 9.99508 14.1689C9.96371 14.1496 9.93234 14.1323 9.89679 14.1216C9.82987 14.1022 9.76504 14.1 9.7002 14.1129C7.04213 13.525 6.98776 11.2378 6.98567 11.1279V4.6777H15.0143V11.1258ZM16.1708 9.17672C16.085 9.26718 15.9804 9.33609 15.8571 9.38778V6.01082H16.4991V8.26787C16.5012 8.27433 16.5054 8.82352 16.1708 9.17672Z"
        fill="#211F1E"
      />
      <path
        d="M9.5971 9.65762L9.35647 11.0584C9.33499 11.1809 9.38655 11.3033 9.48538 11.3764C9.58635 11.4494 9.71741 11.458 9.82913 11.4L11.086 10.7383L12.3428 11.4C12.3901 11.4258 12.4416 11.4365 12.4953 11.4365C12.5619 11.4365 12.6307 11.415 12.6865 11.3742C12.7875 11.3012 12.8369 11.1787 12.8155 11.0562L12.5748 9.65547L13.5932 8.66289C13.6813 8.57695 13.7135 8.4459 13.6748 8.32988C13.6362 8.21172 13.5352 8.12578 13.4127 8.10859L12.0098 7.90664L11.3803 6.63262C11.3244 6.5209 11.2127 6.45215 11.0881 6.45215C10.9635 6.45215 10.8518 6.52305 10.7959 6.63262L10.1664 7.90664L8.75921 8.11074C8.63675 8.12793 8.53577 8.21387 8.4971 8.33203C8.45842 8.4502 8.49065 8.5791 8.57874 8.66504L9.5971 9.65762ZM10.4307 8.52754C10.536 8.5125 10.6283 8.4459 10.6756 8.34922L11.0881 7.51348L11.5006 8.34922C11.5479 8.4459 11.6403 8.5125 11.7455 8.52754L12.6694 8.66074L12.0012 9.31172C11.9239 9.38691 11.8895 9.49434 11.9067 9.59961L12.0635 10.5191L11.2385 10.0852C11.144 10.0357 11.0301 10.0357 10.9356 10.0852L10.1106 10.5191L10.2674 9.59961C10.2846 9.49434 10.2502 9.38691 10.1729 9.31172L9.50471 8.66074L10.4307 8.52754Z"
        fill="#211F1E"
      />
    </svg>
  ) : (
    <svg
      width="30"
      height="30"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.76445 14.5127L9.06836 16.8309H12.9742L12.3426 14.5664"
        fill="#FBBA22"
      />
      <path
        d="M10.9594 14.659C15.5807 14.659 15.5807 11.1098 15.5807 11.1098V4.24121H6.46484V11.1098C6.46484 11.1098 6.46484 14.659 11.0861 14.659H10.9594Z"
        fill="#FBBA22"
      />
      <path
        d="M11.0732 16.8311H13.0305C13.0305 16.8311 14.9533 16.8805 14.9533 18.567H7.1416C7.1416 16.8783 9.06445 16.8311 9.06445 16.8311H11.0217"
        fill="#FBBA22"
      />
      <path
        d="M17.3461 8.2571V5.57578C17.3461 5.33457 17.1579 5.14074 16.9236 5.14074H15.8592V4.24266C15.8592 4.00145 15.6709 3.80762 15.4367 3.80762H6.56322C6.32899 3.80762 6.14077 4.00145 6.14077 4.24266V5.14074H5.07629C4.84206 5.14074 4.65384 5.33457 4.65384 5.57578V8.2571C4.65384 8.28295 4.6392 9.16595 5.22268 9.78406C5.46737 10.0425 5.77688 10.2126 6.14077 10.2966V11.1279C6.14077 11.1624 6.18469 14.0505 9.23175 14.8904L8.77584 16.4561C7.96022 16.5789 6.79954 17.1281 6.79954 18.6033C6.79954 18.8446 6.98776 19.0384 7.22199 19.0384H14.826C15.0603 19.0384 15.2485 18.8446 15.2485 18.6033C15.2485 17.1044 14.0522 16.5638 13.2283 16.4518L12.8016 14.8818C15.8152 14.0289 15.8592 11.1624 15.8592 11.1279V10.2966C16.223 10.2126 16.5305 10.0425 16.7772 9.78406C17.3607 9.16595 17.3461 8.28295 17.3461 8.2571ZM5.82707 9.17672C5.49246 8.82352 5.49664 8.27433 5.49664 8.27003V6.01298H6.13868V9.38778C6.01948 9.33609 5.91282 9.26718 5.82707 9.17672ZM12.8999 17.2982C12.902 17.2982 12.902 17.2982 12.8999 17.2982H12.9418C13.0714 17.3025 14.0711 17.3628 14.3388 18.1683H7.70927C7.97695 17.3628 8.97452 17.3025 9.09372 17.2982H12.8999ZM9.66674 16.4281L10.0662 15.0584C10.3276 15.0929 10.6078 15.1122 10.9048 15.1187C10.9153 15.1187 10.9278 15.1209 10.9383 15.1209H11.0617C11.0721 15.1209 11.0847 15.1209 11.0951 15.1187C11.4067 15.1122 11.6974 15.0907 11.9714 15.0541L12.3457 16.4303H9.66674V16.4281ZM15.0143 11.1258C15.0122 11.2529 14.9411 14.2185 11.001 14.2486C10.6329 14.2465 10.2983 14.2185 9.99508 14.1689C9.96371 14.1496 9.93234 14.1323 9.89679 14.1216C9.82987 14.1022 9.76504 14.1 9.7002 14.1129C7.04213 13.525 6.98776 11.2378 6.98567 11.1279V4.6777H15.0143V11.1258ZM16.1708 9.17672C16.085 9.26718 15.9804 9.33609 15.8571 9.38778V6.01082H16.4991V8.26787C16.5012 8.27433 16.5054 8.82352 16.1708 9.17672Z"
        fill="#211F1E"
      />
      <path
        d="M9.5971 9.65762L9.35647 11.0584C9.33499 11.1809 9.38655 11.3033 9.48538 11.3764C9.58635 11.4494 9.71741 11.458 9.82913 11.4L11.086 10.7383L12.3428 11.4C12.3901 11.4258 12.4416 11.4365 12.4953 11.4365C12.5619 11.4365 12.6307 11.415 12.6865 11.3742C12.7875 11.3012 12.8369 11.1787 12.8155 11.0562L12.5748 9.65547L13.5932 8.66289C13.6813 8.57695 13.7135 8.4459 13.6748 8.32988C13.6362 8.21172 13.5352 8.12578 13.4127 8.10859L12.0098 7.90664L11.3803 6.63262C11.3244 6.5209 11.2127 6.45215 11.0881 6.45215C10.9635 6.45215 10.8518 6.52305 10.7959 6.63262L10.1664 7.90664L8.75921 8.11074C8.63675 8.12793 8.53577 8.21387 8.4971 8.33203C8.45842 8.4502 8.49065 8.5791 8.57874 8.66504L9.5971 9.65762ZM10.4307 8.52754C10.536 8.5125 10.6283 8.4459 10.6756 8.34922L11.0881 7.51348L11.5006 8.34922C11.5479 8.4459 11.6403 8.5125 11.7455 8.52754L12.6694 8.66074L12.0012 9.31172C11.9239 9.38691 11.8895 9.49434 11.9067 9.59961L12.0635 10.5191L11.2385 10.0852C11.144 10.0357 11.0301 10.0357 10.9356 10.0852L10.1106 10.5191L10.2674 9.59961C10.2846 9.49434 10.2502 9.38691 10.1729 9.31172L9.50471 8.66074L10.4307 8.52754Z"
        fill="#211F1E"
      />
    </svg>
  );
};

export default GoldTrophySvg;