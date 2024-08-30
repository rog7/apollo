import jwt, { JwtPayload } from "jsonwebtoken";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import ApolloSymbol from "../components/symbols/ApolloSymbol";
import * as utils from "../utils/determineColors";
import { API_BASE_URL } from "../utils/globalVars";
import { getItem, removeItem, setItem } from "../utils/localStorage";
import Main, { MidiInputContext } from "./main";

interface UsernameContextType {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}

export const UsernameContext = createContext<UsernameContextType>({
  username: "",
  setUsername: () => {},
});

interface ProfileImageUrlContextType {
  profileImageUrl: string;
  setProfileImageUrl: React.Dispatch<React.SetStateAction<string>>;
}

export const ProfileImageUrlContext = createContext<ProfileImageUrlContextType>(
  {
    profileImageUrl: "",
    setProfileImageUrl: () => {},
  }
);

interface ProUserContextType {
  isProUser: boolean;
}

export const ProUserContext = createContext<ProUserContextType>({
  isProUser: false,
});

interface PaymentLinkContextType {
  paymentLink: string;
  setPaymentLink: React.Dispatch<React.SetStateAction<string>>;
}

export const PaymentLinkContext = createContext<PaymentLinkContextType>({
  paymentLink: "",
  setPaymentLink: () => {},
});

const Home = () => {
  const [email, setEmail] = useState("");
  const [showMain, setShowMain] = useState(false);
  const [errorPlaceholder, setErrorPlaceholder] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showAccessCodeComponent, setShowAccessCodeComponent] = useState(false);
  const divRefs = useRef([]);
  const [code, setCode] = useState<string[]>([]);
  const [username, setUsername] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isProUserVal, setIsProUserVal] = useState(false);
  const [expirationTrialDate, setExpirationTrialDate] = useState<
    Date | undefined
  >(undefined);
  const [paymentLink, setPaymentLink] = useState("");
  const [showDiscountPopup, setShowDiscountPopup] = useState(false);
  const { midiInput } = useContext(MidiInputContext);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Clean up event listeners
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (getItem("auth-token") !== null || getItem("email") !== null) {
      const tokenPayload = jwt.decode(getItem("auth-token")) as JwtPayload;

      let email: string;

      if (getItem("auth-token") !== null) {
        email = tokenPayload?.email;
      } else {
        email = getItem("email");
        removeItem("email");
        removeItem("is-pro-user");
        removeItem("is-validated");
        removeItem("userId");
      }

      if (email !== undefined) {
        getUserInfo(email).then(() => {
          setShowMain(true);
          setIsLoading(false);
        });
        // This will get called every 5 minutes
        // setInterval(() => {
        //   getUserInfo(email);
        // }, 300000);
        setInterval(() => {
          getUserInfo(email);
        }, 10000);
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [showMain]);

  const getUserInfo = async (email: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/me?email=${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        const authToken = response.headers.get("Authorization").split(" ")[1];
        setItem("auth-token", authToken);

        setUsername(data.username);
        if (data.profileImageUrl !== null) {
          setProfileImageUrl(data.profileImageUrl);
        }

        const payload = jwt.decode(getItem("auth-token")) as JwtPayload;
        setIsProUserVal(payload.isProUser);

        setExpirationTrialDate(data.expirationDate);
        setPaymentLink(data.paymentLink);

        if (
          (data.paymentLink as string).includes("prefilled_promo_code") &&
          getItem("seen-discount-code") !== "true"
        ) {
          setShowDiscountPopup(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = async (event, index) => {
    const { value } = event.target;

    const newCode =
      code.length > 0 ? [...code] : (Array(6).fill("") as string[]);

    // Update the value at the specified index
    newCode[index] = value;

    // Join the array into a string to update the state
    setCode(newCode);

    if (value.length === 1 && index < divRefs.current.length - 1) {
      // Move focus to the next div
      divRefs.current[index + 1].focus();
    }

    if (newCode.join("").length == 6) {
      setErrorPlaceholder("");
      await checkAuthCode(newCode.join(""));
    }
  };

  const sendAuthCode = async () => {
    if (email === "") {
      setErrorPlaceholder("Email is required");
      return;
    }

    setErrorPlaceholder("");

    const obj = {
      email,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send_auth_code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify(obj),
      });
      const data = await response.json();

      if (response.status === 200) {
        setErrorPlaceholder("");
        setShowAccessCodeComponent(true);
      } else {
        setErrorPlaceholder(data.message);
      }
    } catch (error) {
      setErrorPlaceholder(
        "Logging in is currently unavailable. Please try again later."
      );
    }
  };

  const checkAuthCode = async (authCode: string) => {
    const obj = {
      email,
      authCode,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/auth_code_check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify(obj),
      });

      const data = await response.json();

      if (response.status === 200) {
        const authToken = response.headers.get("Authorization").split(" ")[1];
        setItem("auth-token", authToken);

        setErrorPlaceholder("");
        setUsername(data.username);

        setShowMain(true);
      } else {
        setErrorPlaceholder(data.message);
      }
    } catch (error) {
      setErrorPlaceholder(
        "Auth code check is currently unavailable. Please try again later."
      );
    }
  };

  const handleKeyDown = (event, index) => {
    if (
      event.key === "Backspace" &&
      index > 0 &&
      event.target.value.length === 0
    ) {
      divRefs.current[index - 1].focus();
    }
  };

  return !isLoading ? (
    showMain ? (
      <UsernameContext.Provider value={{ username, setUsername }}>
        <ProfileImageUrlContext.Provider
          value={{ profileImageUrl, setProfileImageUrl }}
        >
          <ProUserContext.Provider
            value={{
              isProUser: isProUserVal,
              // isProUser: false,
            }}
          >
            <PaymentLinkContext.Provider
              value={{ paymentLink, setPaymentLink }}
            >
              {!isOnline && (
                <div
                  className="h-screen flex justify-center items-center"
                  style={{ backgroundColor: utils.determineBackgroundColor() }}
                >
                  <p
                    style={{
                      color: utils.determineFontColor(),
                    }}
                  >
                    You are currently offline. Please connect to the internet to
                    access Apollo.
                  </p>
                </div>
              )}
              <div className={!isOnline ? "hidden" : ""}>
                <Main
                  expirationTrialDate={expirationTrialDate}
                  showDiscountPopup={showDiscountPopup}
                  setShowDiscountPopup={setShowDiscountPopup}
                />
              </div>
            </PaymentLinkContext.Provider>
          </ProUserContext.Provider>
        </ProfileImageUrlContext.Provider>
      </UsernameContext.Provider>
    ) : (
      <div className="h-screen flex justify-center items-center bg-[#ECEBE8]">
        <div className="w-[352px] h-fit rounded-4xl border-2 border-solid border-[#E5E4DB] bg-[#FFFFFF] flex flex-col items-center py-10">
          <div>
            <ApolloSymbol />
          </div>

          {!showAccessCodeComponent ? (
            <div className="flex flex-col items-center">
              <div className="w-[280px] h-[53px] rounded-4xl border-2 border-solid border-black flex justify-center mt-12 select-none">
                <input
                  className="rounded-4xl border-none text-lg w-full outline-none px-2 bg-[#FFFFFF] text-black"
                  placeholder="Email"
                  spellCheck="false"
                  onChange={(e) => setEmail(e.target.value.trim())}
                />
              </div>
              <div>
                <div className="text-red-400 text-xs max-w-[250px] text-center mt-1">
                  {errorPlaceholder}
                </div>
              </div>
              <div
                className="w-[140px] h-[53px] rounded-4xl flex items-center justify-center mt-2.5 cursor-pointer bg-[#313131]"
                onClick={sendAuthCode}
              >
                <div className="text-lg text-white">Authorize</div>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-[10px] text-center flex justify-content">
                {" "}
                <p
                  style={{
                    color: "#313131",
                  }}
                >
                  {`Enter the 6-digit verification code sent to ${email}`}
                </p>
              </div>
              <div className="mt-[20px] flex gap-[10px]">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    ref={(ref) => (divRefs.current[index] = ref)}
                    className="border-2 border-solid border-black rounded-md w-[38px] h-[50px] outline-none text-xl text-center bg-[#FFFFFF] text-black"
                    maxLength={1}
                    onChange={(event) => handleInputChange(event, index)}
                    onKeyDown={(event) => handleKeyDown(event, index)}
                  />
                ))}
              </div>
              <div className="text-red-400 text-xs max-w-[250px] text-center mt-1">
                {errorPlaceholder}
              </div>
              <div
                className="mt-[20px] w-[140px] h-[53px] rounded-4xl flex items-center justify-center cursor-pointer bg-[#313131]"
                onClick={() => {
                  setShowAccessCodeComponent(false);
                  setErrorPlaceholder("");
                  setCode([]);
                }}
              >
                <div className="text-lg text-white outline-none">Go back</div>
              </div>{" "}
            </>
          )}
        </div>
      </div>
    )
  ) : (
    <div
      className={`h-screen`}
      style={{
        backgroundColor: utils.determineBackgroundColor(),
      }}
    ></div>
  );
};

export default Home;
