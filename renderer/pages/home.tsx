import {
  darkModeFontColor,
  fontFamily,
  lightModeFontColor,
} from "../utils/styles";
import ApolloSymbol from "../components/symbols/ApolloSymbol";
import { useEffect, useState } from "react";
import Main from "./main";
import * as ColorUtils from "../utils/determineColors";
import { getItem } from "../utils/localStorage";

const Home = () => {
  const [email, setEmail] = useState("");
  const [showMain, setShowMain] = useState(false);
  const [errorPlaceholder, setErrorPlaceholder] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "http://3.86.102.164:3000";

  useEffect(() => {
    if (getItem("color-preference") !== null) {
      setShowMain(true);
    }
    setIsLoading(false);
  }, []);

  const authorizeUser = async () => {
    if (email === "") {
      setErrorPlaceholder("email is required");
      return;
    }

    const obj = {
      email,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/authorize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });
      const data = await response.json();

      if (response.status === 200) {
        setErrorPlaceholder("");
        setShowMain(true);
      } else {
        const attemptsRemaining = parseInt(
          response.headers.get("RateLimit-Remaining")
        );
        if (attemptsRemaining < 5) {
          if (attemptsRemaining === 0) {
            const timeReset = Math.ceil(
              parseInt(response.headers.get("RateLimit-Reset")) / 60
            );
            if (timeReset == 1) {
              setErrorPlaceholder(
                `you have ${attemptsRemaining} attempts remaining. please try again in ${timeReset} minute.`
              );
            } else {
              setErrorPlaceholder(
                `you have ${attemptsRemaining} attempts remaining. please try again in ${timeReset} minutes.`
              );
            }
          } else {
            if (attemptsRemaining == 1) {
              setErrorPlaceholder(
                `for security purposes, you have ${attemptsRemaining} attempt remaining.`
              );
            } else {
              setErrorPlaceholder(
                `for security purposes, you have ${attemptsRemaining} attempts remaining.`
              );
            }
          }
        } else {
          setErrorPlaceholder(data.message);
        }
      }
    } catch (error) {
      setErrorPlaceholder(
        "logging in is currently unavailable. please try again later."
      );
    }
  };

  return !isLoading ? (
    showMain ? (
      <Main />
    ) : (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          backgroundColor: ColorUtils.determineBackgroundColor(),
        }}
      >
        <div
          style={{
            width: "352px",
            height: "240px",
            borderRadius: "43px 43px 43px 43px",
            border: "3px solid #E5E4DB",
            backgroundColor: ColorUtils.determineBackgroundColorForLogin(),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "40px",
            paddingBottom: "40px",
          }}
        >
          <div>
            <ApolloSymbol />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "30px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "280px",
                  height: "53px",
                  borderRadius: "50px",
                  border: `3px solid ${ColorUtils.determineBorderColor()}`,
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "40px",
                }}
              >
                <input
                  style={{
                    borderRadius: "50px",
                    border: "none",
                    fontSize: "1.5rem",
                    width: "95%",
                    outline: "none",
                    paddingLeft: "15px",
                    backgroundColor:
                      ColorUtils.determineBackgroundColorForLogin(),
                    color: ColorUtils.determineFontColor(),
                  }}
                  placeholder="email"
                  spellCheck="false"
                  onChange={(e) => setEmail(e.target.value.trim())}
                />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: fontFamily,
                    color: ColorUtils.determineErrorColor(),
                    fontSize: "12px",
                    maxWidth: "250px",
                    textAlign: "center",
                    marginTop: "5px",
                  }}
                >
                  {errorPlaceholder}
                </div>
              </div>
              <div
                style={{
                  width: "213px",
                  height: "53px",
                  borderRadius: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "10px",
                  cursor: "pointer",
                  backgroundColor: ColorUtils.determineBackgroundColorReverse(),
                }}
                onClick={authorizeUser}
              >
                <div
                  style={{
                    fontFamily: fontFamily,
                    fontSize: "1.4rem",
                    color: ColorUtils.determineFontColorReverse(),
                  }}
                >
                  authorize
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  ) : (
    <></>
  );
};

export default Home;
