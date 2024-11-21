import { shell } from "electron";
import React, { useContext } from "react";

import * as utils from "../utils/determineColors";
import { PaymentLinkContext, ProUserContext } from "../pages/home";
import { EnableFreeVersionContext } from "../pages/main";

interface Props {
  isTrialing?: boolean;
}

const PremiumButton = ({ isTrialing }: Props) => {
  const { isProUser } = useContext(ProUserContext);
  const { paymentLink } = useContext(PaymentLinkContext);
  const { enableFreeVersion } = useContext(EnableFreeVersionContext);

  return (
    <div className="fixed top-[42px] right-[42px]">
      <div
        className={`${
          isProUser
            ? isTrialing
              ? ""
              : "hidden"
            : enableFreeVersion
            ? ""
            : "hidden"
        } z-50 cursor-pointer flex justify-center items-center rounded-4xl w-[182px] h-[44px]`}
        onClick={() => shell.openExternal(paymentLink)}
        style={{
          backgroundColor: utils.determineBackgroundColorReverse(),
        }}
      >
        <p
          className={`text-[14px] font-bold text-center`}
          style={{
            color: utils.determineFontColorReverse(),
          }}
        >
          {paymentLink.includes("prefilled_promo_code")
            ? "Unlock 25% off now!"
            : "Become a Pro Member"}
        </p>
      </div>
    </div>
  );
};

export default PremiumButton;
