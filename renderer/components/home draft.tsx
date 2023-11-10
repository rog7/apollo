// import {
//   darkModeFontColor,
//   fontFamily,
//   lightModeFontColor,
// } from "../utils/styles";
// import ApolloSymbol from "../components/symbols/ApolloSymbol";
// import { useEffect, useRef, useState } from "react";
// import Main from "./main";
// import SignUp from "../components/SignUp";
// import ForgotPasswordComponent from "../components/ForgotPasswordComponent";
// import AccessCodeComponent from "../components/AccessCodeComponent";
// import SetNewPasswordComponent from "../components/SetNewPasswordComponent";
// import { getItem, removeItem, setItem } from "../utils/localStorage";
// import { v4 as uuidv4 } from "uuid";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import posthog from "posthog-js";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import ArrowBackSymbol from "../components/symbols/ArrowBackSymbol";
// import CancelSymbol from "../components/symbols/CancelSymbol";
// import * as ColorUtils from "../utils/determineColors";
// import FireSymbol from "../components/symbols/FireSymbol";
// import SolidFireSymbol from "../components/symbols/SolidFireSymbol";
// import moment from "moment-timezone";
// import { shell } from "electron";

// const Home = () => {
//   const [username, setUsername] = useState("");
//   const [usernamePlaceholder, setUsernamePlaceholder] = useState("");
//   const [usernameOrEmail, setUsernameOrEmail] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [password1, setPassword1] = useState("");
//   const [password2, setPassword2] = useState("");
//   const [oldPassword, setOldPassword] = useState("");
//   const [showMain, setShowMain] = useState(false);
//   const [showAccessCodeComponent, setShowAccessCodeComponent] = useState(false);
//   const [showSignUp, setShowSignUp] = useState(false);
//   const [errorPlaceholder, setErrorPlaceholder] = useState("");
//   const [signUpCode, setSignUpCode] = useState("");
//   const [forgotPasswordCode, setForgotPasswordCode] = useState("");
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const [showSetNewPasswordComponent, setShowSetNewPasswordComponent] =
//     useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [profileImageUrl, setProfileImageUrl] = useState("");
//   const [showProfileIcon, setShowProfileIcon] = useState(true);
//   const [isSuiteUser, setIsSuiteUser] = useState(false);
//   const [showSettings, setShowSettings] = useState(false);
//   const settingsModalRef = useRef();
//   const loginStreakModalRef = useRef();
//   const [showAccountDetails, setShowAccountDetails] = useState(false);
//   const [showUpdateUsername, setShowUpdateUsername] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [showLoginStreakInfo, setShowLoginStreakInfo] = useState(false);
//   const [currentDate, setCurrentDate] = useState(
//     new Date().toLocaleDateString()
//   );
//   const [currentLoginStreak, setCurrentLoginStreak] = useState(0);
//   const [weeklyLoginStreak, setWeeklyLoginStreak] = useState(0);
//   const [daysInApolloThisYear, setDaysInApolloThisYear] = useState(0);
//   const [currentWeekDays, setCurrentWeekDays] = useState<string[]>();
//   const [loggedDays, setLoggedDays] = useState<string[]>();
//   const [subscriptionRenewalDate, setSubscriptionRenewalDate] = useState("");
//   const [subscriptionExpirationDate, setSubscriptionExpirationDate] =
//     useState("");
//   const [subscriptionId, setSubscriptionId] = useState("");
//   const [currentPlan, setCurrentPlan] = useState("");

//   // const POSTHOG_API_KEY =
//   //   process.env.NODE_ENV === "development"
//   //     ? "phc_LoagHxfPPfHfXM6uzfl7rNUEuS6XHnzTQLB0bQNUh3e"
//   //     : "phc_gEpaJyNvzPGIeAFAe9XZL6Pmb7RubHQT0GhjUdSA9oC";

//   // const CLOUDFRONT_URL =
//   //   process.env.NODE_ENV === "development"
//   //     ? "https://d1a8rq8nqnl9s9.cloudfront.net"
//   //     : "https://d1a8rq8nqnl9s9.cloudfront.net";

//   const API_BASE_URL =
//     process.env.NODE_ENV === "development"
//       ? "http://localhost:3000"
//       : "http://3.86.102.164:3000";

//   // const AWS_ACCESS_KEY_ID =
//   //   process.env.NODE_ENV === "development"
//   //     ? "AKIAVSM3BXPFB6ZBJ7O6"
//   //     : "AKIAVSM3BXPFB6ZBJ7O6";

//   // const AWS_SECRET_ACCESS_KEY =
//   //   process.env.NODE_ENV === "development"
//   //     ? "/iPoXOqbJhTBZxe069EWJ2/x0wTP+CHZjZipHuWp"
//   //     : "/iPoXOqbJhTBZxe069EWJ2/x0wTP+CHZjZipHuWp";

//   // useEffect(() => {
//   //   posthog.init(POSTHOG_API_KEY, {
//   //     api_host: "https://app.posthog.com",
//   //   });

//   //   handleIfUserShouldAuthenticate();
//   // }, []);

//   // useEffect(() => {
//   //   const interval = setInterval(async () => {
//   //     await handleIfUserShouldAuthenticate();
//   //   }, 3600000); // Checks every hour

//   //   return () => {
//   //     clearInterval(interval); // Clean up the interval when the component unmounts
//   //   };
//   // }, []);

//   // useEffect(() => {
//   //   const interval = setInterval(async () => {
//   //     const newDate = new Date().toLocaleDateString();
//   //     if (newDate !== currentDate) {
//   //       const refreshTokenId = getItem("refresh-token-id");
//   //       if (refreshTokenId !== null) {
//   //         await checkLoginStreak(refreshTokenId);
//   //       } else {
//   //         logOutUser();
//   //       }
//   //       setCurrentDate(newDate); // Update the current date state
//   //     }
//   //   }, 600000); // Checks every ten minutes

//   //   return () => {
//   //     clearInterval(interval); // Clean up the interval when the component unmounts
//   //   };
//   // }, [currentDate]);

//   // useEffect(() => {
//   //   const interval = setInterval(async () => {
//   //     await getSubscriptionStatus();
//   //   }, 300000); // Checks every five minutes

//   //   return () => {
//   //     clearInterval(interval); // Clean up the interval when the component unmounts
//   //   };
//   // }, []);

//   // const getSubscriptionStatus = async () => {
//   //   const authToken = getItem("auth-token");
//   //   if (authToken !== null) {
//   //     try {
//   //       const response = await fetch(
//   //         `${API_BASE_URL}/api/users/subscription_status`,
//   //         {
//   //           method: "GET",
//   //           headers: {
//   //             "Content-Type": "application/json",
//   //             Authorization: "Bearer " + authToken,
//   //           },
//   //         }
//   //       );

//   //       const data = await response.json();

//   //       if (response.status === 200) {
//   //         const authToken = response.headers.get("Authorization").split(" ")[1];
//   //         setItem("auth-token", authToken);

//   //         const tokenPayload = jwt.decode(authToken) as JwtPayload;

//   //         posthog.identify(tokenPayload._id.toString(), {
//   //           isSuiteUser: data.hasActiveSubscription,
//   //         });

//   //         setIsSuiteUser(data.hasActiveSubscription);
//   //       }
//   //     } catch (error) {
//   //       console.log(error);
//   //     }
//   //   }
//   // };

//   // const checkLoginStreak = async (refreshTokenId: string) => {
//   //   try {
//   //     const response = await fetch(`${API_BASE_URL}/api/users/login_streak`, {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify({
//   //         refreshTokenId: refreshTokenId,
//   //         timezone: moment.tz.guess(),
//   //       }),
//   //     });
//   //     const data = await response.json();

//   //     if (response.status === 200) {
//   //       setCurrentLoginStreak(data.currentLoginStreak);
//   //       setWeeklyLoginStreak(data.weeklyLoginStreak);
//   //       setDaysInApolloThisYear(data.daysInApolloThisYear);
//   //       setCurrentWeekDays(data.currentWeekDays);
//   //       setLoggedDays(data.loggedDays);
//   //     }
//   //   } catch (error) {
//   //     console.log(error);
//   //   }
//   // };

//   // const handleIfUserShouldAuthenticate = async () => {
//   //   const refreshTokenId = getItem("refresh-token-id");
//   //   if (refreshTokenId !== null) {
//   //     try {
//   //       const response = await fetch(`${API_BASE_URL}/api/auth/check_refresh`, {
//   //         method: "POST",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify({
//   //           refreshTokenId: refreshTokenId,
//   //         }),
//   //       });
//   //       const data = await response.json();

//   //       if (response.status === 200) {
//   //         if (data.message) {
//   //           const authToken = response.headers
//   //             .get("Authorization")
//   //             .split(" ")[1];

//   //           await getUserInformation(authToken);
//   //           setItem("auth-token", authToken);

//   //           await checkLoginStreak(refreshTokenId);
//   //           await getSubscriptionStatus();

//   //           setShowMain(true);
//   //           setIsLoading(false);
//   //         } else {
//   //           setIsLoading(false);
//   //           setShowMain(false);
//   //         }
//   //       }
//   //     } catch (error) {
//   //       console.log(error);
//   //     }
//   //   } else {
//   //     setIsLoading(false);
//   //   }
//   // };

//   // useEffect(() => {
//   //   setErrorPlaceholder("");
//   // }, [
//   //   showSignUp,
//   //   showForgotPassword,
//   //   showAccessCodeComponent,
//   //   showSetNewPasswordComponent,
//   // ]);

//   // const getUserInformation = async (authToken: string) => {
//   //   try {
//   //     const response = await fetch(`${API_BASE_URL}/api/users/me`, {
//   //       method: "GET",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //         Authorization: "Bearer " + authToken,
//   //       },
//   //     });

//   //     const data = await response.json();

//   //     if (response.status === 200) {
//   //       posthog.identify(data._id.toString(), {
//   //         email: data.email,
//   //         userId: data._id,
//   //       });

//   //       setEmail(data.email);
//   //       setUsername(data.username);

//   //       if (data.profileImageObj !== undefined) {
//   //         setProfileImageUrl(`${CLOUDFRONT_URL}/${data.profileImageObj}`);
//   //       } else {
//   //         setProfileImageUrl(`${CLOUDFRONT_URL}/default_pic.png`);
//   //       }
//   //     } else {
//   //       setProfileImageUrl(`${CLOUDFRONT_URL}/default_pic.png`);
//   //     }
//   //   } catch (error) {
//   //     console.log(error);
//   //   }
//   // };

//   // const logOutUser = () => {
//   //   setUsernameOrEmail("");
//   //   setPassword("");
//   //   removeItem("refresh-token-id");
//   //   removeItem("auth-token");
//   //   setShowSignUp(false);
//   //   setShowSettings(false);
//   //   setShowMain(false);
//   // };

//   // const loginUser = async () => {
//   //   const obj = {
//   //     usernameOrEmail,
//   //     password,
//   //   };

//   //   try {
//   //     const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify(obj),
//   //     });
//   //     const data = await response.json();

//   //     if (response.status === 200) {
//   //       const authToken = response.headers.get("Authorization").split(" ")[1];
//   //       setItem("auth-token", authToken);

//   //       await getUserInformation(authToken);

//   //       const tokenPayload = jwt.decode(authToken) as JwtPayload;

//   //       setIsSuiteUser(tokenPayload.hasActiveSubscription);

//   //       const refreshTokenId = response.headers.get("Refresh-Token-Id");
//   //       setItem("refresh-token-id", refreshTokenId);

//   //       await checkLoginStreak(refreshTokenId);

//   //       setErrorPlaceholder("");
//   //       setShowMain(true);
//   //     } else {
//   //       const attemptsRemaining = parseInt(
//   //         response.headers.get("RateLimit-Remaining")
//   //       );
//   //       if (attemptsRemaining < 5) {
//   //         if (attemptsRemaining === 0) {
//   //           const timeReset = Math.ceil(
//   //             parseInt(response.headers.get("RateLimit-Reset")) / 60
//   //           );
//   //           if (timeReset == 1) {
//   //             setErrorPlaceholder(
//   //               `you have ${attemptsRemaining} attempts remaining. please try again in ${timeReset} minute.`
//   //             );
//   //           } else {
//   //             setErrorPlaceholder(
//   //               `you have ${attemptsRemaining} attempts remaining. please try again in ${timeReset} minutes.`
//   //             );
//   //           }
//   //         } else {
//   //           if (attemptsRemaining == 1) {
//   //             setErrorPlaceholder(
//   //               `for security purposes, you have ${attemptsRemaining} attempt remaining.`
//   //             );
//   //           } else {
//   //             setErrorPlaceholder(
//   //               `for security purposes, you have ${attemptsRemaining} attempts remaining.`
//   //             );
//   //           }
//   //         }
//   //       } else {
//   //         setErrorPlaceholder(data.message);
//   //       }
//   //     }
//   //   } catch (error) {
//   //     setErrorPlaceholder(
//   //       "logging in is currently unavailable. please try again later."
//   //     );
//   //   }
//   // };

//   const authorizeUser = async () => {
//     if (email === "") {
//       setErrorPlaceholder("email is required");
//       return;
//     }

//     const obj = {
//       email,
//     };

//     try {
//       const response = await fetch(`${API_BASE_URL}/api/auth/authorize_user`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(obj),
//       });
//       const data = await response.json();

//       if (response.status === 200) {
//         setErrorPlaceholder("");
//         setShowMain(true);
//       } else {
//         const attemptsRemaining = parseInt(
//           response.headers.get("RateLimit-Remaining")
//         );
//         if (attemptsRemaining < 5) {
//           if (attemptsRemaining === 0) {
//             const timeReset = Math.ceil(
//               parseInt(response.headers.get("RateLimit-Reset")) / 60
//             );
//             if (timeReset == 1) {
//               setErrorPlaceholder(
//                 `you have ${attemptsRemaining} attempts remaining. please try again in ${timeReset} minute.`
//               );
//             } else {
//               setErrorPlaceholder(
//                 `you have ${attemptsRemaining} attempts remaining. please try again in ${timeReset} minutes.`
//               );
//             }
//           } else {
//             if (attemptsRemaining == 1) {
//               setErrorPlaceholder(
//                 `for security purposes, you have ${attemptsRemaining} attempt remaining.`
//               );
//             } else {
//               setErrorPlaceholder(
//                 `for security purposes, you have ${attemptsRemaining} attempts remaining.`
//               );
//             }
//           }
//         } else {
//           setErrorPlaceholder(data.message);
//         }
//       }
//     } catch (error) {
//       setErrorPlaceholder(
//         "logging in is currently unavailable. please try again later."
//       );
//     }
//   };

//   // const signUpUser = async () => {
//   //   try {
//   //     const response = await fetch(`${API_BASE_URL}/api/users/`, {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify({
//   //         username: username,
//   //         email: email,
//   //         password: password,
//   //       }),
//   //     });
//   //     const data = await response.json();

//   //     if (response.status === 200) {
//   //       setShowAccessCodeComponent(true);
//   //     } else {
//   //       setErrorPlaceholder(data.message);
//   //     }
//   //   } catch (error) {
//   //     setErrorPlaceholder(
//   //       "signing up is currently unavailable. please try again later."
//   //     );
//   //   }
//   // };

//   // const handleSignUpCodeCheck = async () => {
//   //   try {
//   //     const response = await fetch(
//   //       `${API_BASE_URL}/api/auth/sign_up_code_check`,
//   //       {
//   //         method: "POST",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify({
//   //           signUpCode,
//   //           email,
//   //           username,
//   //           password,
//   //         }),
//   //       }
//   //     );
//   //     const data = await response.json();

//   //     if (response.status === 200) {
//   //       const authToken = response.headers.get("Authorization").split(" ")[1];
//   //       setItem("auth-token", authToken);

//   //       const refreshTokenId = response.headers.get("Refresh-Token-Id");
//   //       setItem("refresh-token-id", refreshTokenId);

//   //       const tokenPayload = jwt.decode(authToken) as JwtPayload;

//   //       setIsSuiteUser(tokenPayload.hasActiveSubscription);

//   //       setProfileImageUrl(`${CLOUDFRONT_URL}/default_pic.png`);

//   //       await checkLoginStreak(refreshTokenId);

//   //       setShowMain(true);
//   //     } else {
//   //       setErrorPlaceholder(data.message);
//   //     }
//   //   } catch (error) {
//   //     setErrorPlaceholder("something went wrong. please try again later.");
//   //   }
//   // };

//   // const handleForgotPasswordSubmissionOfEmail = async () => {
//   //   try {
//   //     const response = await fetch(`${API_BASE_URL}/api/auth/reset_password`, {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify({
//   //         email: email,
//   //       }),
//   //     });
//   //     const data = await response.json();

//   //     if (response.status === 200) {
//   //       setShowAccessCodeComponent(true);
//   //     } else {
//   //       setErrorPlaceholder(data.message);
//   //     }
//   //   } catch (error) {
//   //     setErrorPlaceholder("something went wrong. please try again later.");
//   //   }
//   // };

//   // const handleForgotPasswordCodeCheck = async () => {
//   //   try {
//   //     const response = await fetch(
//   //       `${API_BASE_URL}/api/auth/password_reset_code_check`,
//   //       {
//   //         method: "POST",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify({
//   //           resetCode: forgotPasswordCode,
//   //         }),
//   //       }
//   //     );
//   //     const data = await response.json();

//   //     if (response.status === 200) {
//   //       setShowSetNewPasswordComponent(true);
//   //     } else {
//   //       setErrorPlaceholder(data.message);
//   //     }
//   //   } catch (error) {
//   //     setErrorPlaceholder("something went wrong. please try again later.");
//   //   }
//   // };

//   // const handleSetNewPassword = async (newPassword: string) => {
//   //   try {
//   //     const response = await fetch(`${API_BASE_URL}/api/auth/update_password`, {
//   //       method: "PUT",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify({
//   //         resetCode: forgotPasswordCode,
//   //         email: email,
//   //         password: newPassword,
//   //       }),
//   //     });
//   //     const data = await response.json();

//   //     if (response.status === 200) {
//   //       const authToken = response.headers.get("Authorization").split(" ")[1];
//   //       setItem("auth-token", authToken);

//   //       const refreshTokenId = response.headers.get("Refresh-Token-Id");
//   //       setItem("refresh-token-id", refreshTokenId);

//   //       await checkLoginStreak(refreshTokenId);

//   //       setShowForgotPassword(false);
//   //       setShowAccessCodeComponent(false);
//   //       setShowSetNewPasswordComponent(false);
//   //       setShowMain(true);
//   //     } else {
//   //       setErrorPlaceholder(data.message);
//   //     }
//   //   } catch (error) {
//   //     setErrorPlaceholder("something went wrong. please try again later.");
//   //   }
//   // };

//   // const handleShowSettings = () => {
//   //   setShowSettings(true);

//   //   getSubscriptionDetails();
//   // };

//   const getSubscriptionDetails = async () => {
//     const authToken = getItem("auth-token");

//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/users/subscription_details`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + authToken,
//           },
//         }
//       );

//       const data = await response.json();

//       if (response.status === 200) {
//         const authToken = response.headers.get("Authorization").split(" ")[1];
//         setItem("auth-token", authToken);

//         if (data.currentPlan === "Suite") {
//           setCurrentPlan(data.currentPlan);
//           setSubscriptionId(data.subscriptionId);
//           setSubscriptionRenewalDate(data.renewalDate);
//           setSubscriptionExpirationDate(data.expirationDate);
//         } else {
//           // User is on lite plan
//           setCurrentPlan(data.currentPlan);
//           setSubscriptionId("");
//           setSubscriptionRenewalDate("");
//           setSubscriptionExpirationDate("");
//         }
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const cancelSubscription = async () => {
//     try {
//       await fetch(`${API_BASE_URL}/api/users/cancel_subscription`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: "Bearer " + getItem("auth-token"),
//         },
//         body: JSON.stringify({
//           subscriptionId,
//         }),
//       });

//       await getSubscriptionDetails();
//     } catch (error) {
//       console.log(error);
//     }
//   };

// const continueSubscription = async () => {
//   try {
//     await fetch(`${API_BASE_URL}/api/users/continue_subscription`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + getItem("auth-token"),
//       },
//       body: JSON.stringify({
//         subscriptionId,
//       }),
//     });

//   //     await getSubscriptionDetails();
//   //   } catch (error) {
//   //     console.log(error);
//   //   }
//   // };

//   // const handleImageUpload = () => {
//   //   const S3_BUCKET = "apollo-app-profile-photos";
//   //   const REGION = "us-east-1";

//   //   // Configure AWS SDK v3
//   //   const s3Client = new S3Client({
//   //     region: REGION,
//   //     credentials: {
//   //       accessKeyId: AWS_ACCESS_KEY_ID,
//   //       secretAccessKey: AWS_SECRET_ACCESS_KEY,
//   //     },
//   //   });

//   //   const imageInput = document.createElement("input");
//   //   imageInput.type = "file";
//   //   imageInput.accept = "image/*";

//   //   imageInput.addEventListener("change", async (event: any) => {
//   //     const file = event.target.files[0];
//   //     if (file) {
//   //       const fileName = `${uuidv4()}.png`;
//   //       setProfileImageUrl(URL.createObjectURL(file));

//   //       const params = {
//   //         ACL: "private",
//   //         Body: file,
//   //         Bucket: S3_BUCKET,
//   //         Key: fileName,
//   //       };

//   //       const command = new PutObjectCommand(params);

//   //       try {
//   //         await s3Client.send(command);
//   //       } catch (error) {
//   //         console.error(error);
//   //       }

//   //       try {
//   //         await fetch(`${API_BASE_URL}/api/users/profile_image`, {
//   //           method: "POST",
//   //           headers: {
//   //             "Content-Type": "application/json",
//   //             Authorization: "Bearer " + getItem("auth-token"),
//   //           },
//   //           body: JSON.stringify({
//   //             profileImageObj: fileName,
//   //           }),
//   //         });
//   //       } catch (error) {
//   //         console.log(error);
//   //       }
//   //     }
//   //   });

//   //   imageInput.click();
//   // };

//   // const closeSettingsModal = (event) => {
//   //   if (event.target !== settingsModalRef.current) {
//   //     setUsernamePlaceholder("");
//   //     setOldPassword("");
//   //     setPassword1("");
//   //     setPassword2("");
//   //     setSuccessMessage("");
//   //     setErrorPlaceholder("");
//   //     setShowAccountDetails(false);
//   //     setShowUpdateUsername(false);
//   //     setShowSettings(false);
//   //   }
//   // };

//   // const closeLoginStreakModal = (event) => {
//   //   if (event.target !== loginStreakModalRef.current) {
//   //     setShowLoginStreakInfo(false);
//   //   }
//   // };

//   // const updatePassword = async () => {
//   //   if (oldPassword.trim().length === 0)
//   //     return setErrorPlaceholder("old password must be provided");

//   //   if (password1.trim().length === 0 || password2.trim().length === 0)
//   //     return setErrorPlaceholder("new password must be provided");

//   //   if (password1 !== password2)
//   //     return setErrorPlaceholder("passwords do not match");

//   //   try {
//   //     const response = await fetch(`${API_BASE_URL}/api/auth/update_password`, {
//   //       method: "PUT",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify({
//   //         email: email,
//   //         oldPassword: oldPassword,
//   //         password: password1,
//   //       }),
//   //     });
//   //     const data = await response.json();

//   //     if (response.status === 200) {
//   //       const authToken = response.headers.get("Authorization").split(" ")[1];
//   //       setItem("auth-token", authToken);

//   //       displaySuccess();
//   //     } else {
//   //       setErrorPlaceholder(data.message);
//   //     }
//   //   } catch (error) {
//   //     setErrorPlaceholder("something went wrong. please try again later.");
//   //   }
//   // };

//   // const updateUsername = async () => {
//   //   if (usernamePlaceholder.includes("@"))
//   //     return setErrorPlaceholder("username cannot include '@' symbol");
//   //   try {
//   //     const response = await fetch(
//   //       `${API_BASE_URL}/api/users/update_username`,
//   //       {
//   //         method: "PUT",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //           Authorization: "Bearer " + getItem("auth-token"),
//   //         },
//   //         body: JSON.stringify({
//   //           username: usernamePlaceholder,
//   //         }),
//   //       }
//   //     );
//   //     const data = await response.json();

//   //     if (response.status === 200) {
//   //       const authToken = response.headers.get("Authorization").split(" ")[1];
//   //       setItem("auth-token", authToken);

//   //       setUsername(data.username);
//   //       displaySuccess();
//   //     } else {
//   //       setErrorPlaceholder(data.message);
//   //     }
//   //   } catch (error) {
//   //     setErrorPlaceholder("something went wrong. please try again later.");
//   //   }
//   // };

//   // const displaySuccess = () => {
//   //   setErrorPlaceholder("");
//   //   setOldPassword("");
//   //   setPassword1("");
//   //   setPassword2("");
//   //   setUsernamePlaceholder("");
//   //   setSuccessMessage("success!");
//   // };

//   return !isLoading ? (
//     !showMain ? (
//       !showSignUp ? (
//         !showForgotPassword ? (
//           <div
//             style={{
//               width: "100%",
//               height: "100vh",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               flexDirection: "column",
//               backgroundColor: ColorUtils.determineBackgroundColor(),
//             }}
//           >
//             <div
//               style={{
//                 width: "352px",
//                 height: "240px",
//                 borderRadius: "43px 43px 43px 43px",
//                 border: "3px solid #E5E4DB",
//                 backgroundColor: ColorUtils.determineBackgroundColorForLogin(),
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 paddingTop: "40px",
//                 paddingBottom: "40px",
//               }}
//             >
//               <div>
//                 <ApolloSymbol />
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: "30px",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: "280px",
//                       height: "53px",
//                       borderRadius: "50px",
//                       border: `3px solid ${ColorUtils.determineBorderColor()}`,
//                       display: "flex",
//                       justifyContent: "center",
//                       marginTop: "40px",
//                     }}
//                   >
//                     <input
//                       style={{
//                         borderRadius: "50px",
//                         border: "none",
//                         fontSize: "1.5rem",
//                         width: "95%",
//                         outline: "none",
//                         paddingLeft: "15px",
//                         backgroundColor:
//                           ColorUtils.determineBackgroundColorForLogin(),
//                         color: ColorUtils.determineFontColor(),
//                       }}
//                       placeholder="email"
//                       spellCheck="false"
//                       onChange={(e) => setUsernameOrEmail(e.target.value)}
//                     />
//                   </div>
//                   {/* <div
//                     style={{
//                       width: "280px",
//                       height: "53px",
//                       borderRadius: "50px",
//                       border: `3px solid ${ColorUtils.determineBorderColor()}`,
//                       display: "flex",
//                       justifyContent: "center",
//                       marginTop: "16px",
//                     }}
//                   >
//                     <input
//                       style={{
//                         borderRadius: "50px",
//                         border: "none",
//                         fontSize: "1.5rem",
//                         width: "95%",
//                         outline: "none",
//                         paddingLeft: "15px",
//                         backgroundColor:
//                           ColorUtils.determineBackgroundColorForLogin(),
//                         color: ColorUtils.determineFontColor(),
//                       }}
//                       placeholder="password"
//                       spellCheck="false"
//                       type="password"
//                       onChange={(e) => setPassword(e.target.value)}
//                     />
//                   </div> */}
//                   {/* <div
//                     style={{
//                       fontFamily: fontFamily,
//                       color: ColorUtils.determineFontColor(),
//                       opacity: 0.5,
//                       fontSize: "16px",
//                       marginTop: "10px",
//                       cursor: "pointer",
//                     }}
//                     onClick={() => setShowForgotPassword(true)}
//                   >
//                     provide email used to purchase Apollo
//                   </div> */}

//                   <div>
//                     <div
//                       style={{
//                         fontFamily: fontFamily,
//                         color: ColorUtils.determineErrorColor(),
//                         fontSize: "12px",
//                         maxWidth: "250px",
//                         textAlign: "center",
//                         marginTop: "5px",
//                       }}
//                     >
//                       {errorPlaceholder}
//                     </div>
//                   </div>
//                   <div
//                     style={{
//                       width: "213px",
//                       height: "53px",
//                       borderRadius: "50px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       marginTop: "10px",
//                       cursor: "pointer",
//                       backgroundColor:
//                         ColorUtils.determineBackgroundColorReverse(),
//                     }}
//                     onClick={authorizeUser}
//                   >
//                     <div
//                       style={{
//                         fontFamily: fontFamily,
//                         fontSize: "1.4rem",
//                         color: ColorUtils.determineFontColorReverse(),
//                       }}
//                     >
//                       authorize
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* <div
//               style={{
//                 width: "352px",
//                 height: "100px",
//                 borderRadius: "0 0 43px 43px",
//                 borderTop: "0px",
//                 borderLeftWidth: "3px",
//                 borderRightWidth: "3px",
//                 borderBottomWidth: "3px",
//                 borderStyle: "solid",
//                 borderColor: "#E5E4DB",
//                 backgroundColor: ColorUtils.determineBackgroundColorForLogin(),
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 paddingTop: "10px",
//                 paddingBottom: "10px",
//               }}
//             >
//               <div
//                 style={{
//                   fontFamily: fontFamily,
//                   color: ColorUtils.determineFontColor(),
//                   fontSize: "20px",
//                   cursor: "pointer",
//                   width: "60%",
//                   textAlign: "center",
//                 }}
//               >
//                 don’t have an account? sign up{" "}
//                 <span
//                   onClick={() => {
//                     setShowSignUp(true);
//                     setEmail("");
//                     setUsername("");
//                     setPassword("");
//                   }}
//                   style={{
//                     textDecoration: "underline",
//                     cursor: "pointer",
//                   }}
//                 >
//                   here
//                 </span>
//                 .
//               </div>
//             </div> */}
//           </div>
//         ) : (
//           <div
//             style={{
//               width: "100%",
//               height: "100vh",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               flexDirection: "column",
//               backgroundColor: ColorUtils.determineBackgroundColor(),
//             }}
//           >
//             {!showAccessCodeComponent ? (
//               <ForgotPasswordComponent
//                 errorPlaceholder={errorPlaceholder}
//                 displayMessage={
//                   "please provide your email address to receive a reset code."
//                 }
//                 onSubmitEmail={handleForgotPasswordSubmissionOfEmail}
//                 setShowForgotPassword={setShowForgotPassword}
//                 setEmail={setEmail}
//               />
//             ) : !showSetNewPasswordComponent ? (
//               <AccessCodeComponent
//                 errorPlaceholder={errorPlaceholder}
//                 displayMessage={`enter the 6-digit verfication code sent to ${email}.`}
//                 setShowSignUp={setShowSignUp}
//                 onSetCode={setForgotPasswordCode}
//                 onCodeCheck={handleForgotPasswordCodeCheck}
//                 setShowForgotPassword={setShowForgotPassword}
//                 setShowAccessCodeComponent={setShowAccessCodeComponent}
//               />
//             ) : (
//               <SetNewPasswordComponent
//                 errorPlaceholder={errorPlaceholder}
//                 setErrorPlaceholder={setErrorPlaceholder}
//                 onSetNewPassword={handleSetNewPassword}
//                 setShowForgotPassword={setShowForgotPassword}
//                 setShowSetNewPasswordComponent={setShowAccessCodeComponent}
//               />
//             )}
//           </div>
//         )
//       ) : (
//         <SignUp
//           setUsername={setUsername}
//           setEmail={setEmail}
//           setPassword={setPassword}
//           signUpUser={signUpUser}
//           showAccessCodeComponent={showAccessCodeComponent}
//           setShowSignUp={setShowSignUp}
//           errorPlaceholder={errorPlaceholder}
//           setSignUpCode={setSignUpCode}
//           onSignUpCodeCheck={handleSignUpCodeCheck}
//           setShowForgotPassword={setShowForgotPassword}
//           setShowAccessCodeComponent={setShowAccessCodeComponent}
//           email={email}
//           password={password}
//           username={username}
//         />
//       )
//     ) : (
//       <>
//         <Main
//           setShowProfileIcon={setShowProfileIcon}
//           isSuiteUser={isSuiteUser}
//           showProfileIcon={showProfileIcon}
//           profileImageUrl={profileImageUrl}
//           handleShowSettings={handleShowSettings}
//           setShowLoginStreakInfo={setShowLoginStreakInfo}
//           currentLoginStreak={currentLoginStreak}
//         />
//         {showSettings && (
//           <>
//             <div
//               style={{
//                 position: "absolute",
//                 top: 0,
//                 width: "100%",
//                 height: "100vh",
//                 backgroundColor: "rgba(0,0,0,0.5)",
//                 backdropFilter: "blur(4px)",
//                 zIndex: 2,
//               }}
//               onClick={closeSettingsModal}
//             ></div>
//             <div
//               style={{
//                 position: "absolute",
//                 left: "36%",
//                 top: "15%",
//                 zIndex: 3,
//               }}
//             >
//               {!showAccountDetails && !showUpdateUsername && (
//                 <div
//                   ref={settingsModalRef}
//                   style={{
//                     width: "352px",
//                     height: "400px",
//                     borderRadius: "43px 43px 43px 43px ",
//                     border:
//                       getItem("theme-preference") === "light-mode"
//                         ? "3px solid black"
//                         : "3px solid #E5E4DB",
//                     backgroundColor: ColorUtils.determineBackgroundColor(),
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     gap: "22px",
//                   }}
//                 >
//                   <div
//                     style={{
//                       position: "absolute",
//                       top: "8%",
//                       right: "8%",
//                       cursor: "pointer",
//                     }}
//                     onClick={() => setShowSettings(false)}
//                   >
//                     <CancelSymbol />
//                   </div>
//                   <div
//                     style={{
//                       marginTop: "40px",
//                       display: "flex",
//                       flexDirection: "column",
//                       alignItems: "center",
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: "75px",
//                         height: "75px",
//                         borderRadius: "50%",
//                         overflow: "hidden",
//                       }}
//                     >
//                       <img
//                         style={{
//                           objectFit: "cover",
//                           borderRadius: "50%",
//                           width: "100%",
//                           height: "100%",
//                           display: "block",
//                           maxWidth: "100%",
//                         }}
//                         src={profileImageUrl}
//                       />
//                     </div>
//                     <div>
//                       <div
//                         style={{
//                           fontFamily: fontFamily,
//                           color:
//                             getItem("theme-preference") === "light-mode"
//                               ? lightModeFontColor
//                               : darkModeFontColor,
//                           fontSize: "15px",
//                         }}
//                       >
//                         @{username}
//                       </div>
//                     </div>
//                   </div>
//                   <div>
//                     <div
//                       style={{
//                         fontFamily: fontFamily,
//                         color:
//                           getItem("theme-preference") === "light-mode"
//                             ? lightModeFontColor
//                             : darkModeFontColor,
//                         fontSize: "24px",
//                         cursor: "pointer",
//                       }}
//                       onClick={handleImageUpload}
//                     >
//                       edit picture
//                     </div>
//                   </div>
//                   <div>
//                     <div
//                       style={{
//                         fontFamily: fontFamily,
//                         color:
//                           getItem("theme-preference") === "light-mode"
//                             ? lightModeFontColor
//                             : darkModeFontColor,
//                         fontSize: "24px",
//                         cursor: "pointer",
//                       }}
//                       onClick={() => setShowUpdateUsername(true)}
//                     >
//                       change username
//                     </div>
//                   </div>
//                   {/* <div>
//                     <div
//                       style={{
//                         fontFamily:  fontFamily ,
//                         color:
//                           getItem("theme-preference") === "light-mode"
//                             ? lightModeFontColor
//                             : darkModeFontColor,
//                         fontSize: "24px",
//                         cursor: "pointer",
//                       }}
//                       onClick={() => setShowAccountDetails(true)}
//                     >
//                       account details
//                     </div>
//                   </div> */}
//                   <div style={{ marginBottom: "30px" }}>
//                     <div
//                       style={{
//                         fontFamily: fontFamily,
//                         color:
//                           getItem("theme-preference") === "light-mode"
//                             ? lightModeFontColor
//                             : darkModeFontColor,
//                         fontSize: "24px",
//                         cursor: "pointer",
//                       }}
//                       onClick={logOutUser}
//                     >
//                       log out
//                     </div>
//                   </div>
//                 </div>
//               )}
//               {showAccountDetails && (
//                 <div
//                   ref={settingsModalRef}
//                   style={{
//                     marginTop: currentPlan == "Lite" ? "60px" : "40px",
//                     width: currentPlan == "Lite" ? "352px" : "380px",
//                     height: currentPlan == "Lite" ? "250px" : "315px",
//                     borderRadius: "43px 43px 43px 43px ",
//                     border:
//                       getItem("theme-preference") === "light-mode"
//                         ? "3px solid black"
//                         : "3px solid #E5E4DB",
//                     backgroundColor: ColorUtils.determineBackgroundColor(),
//                     display: "flex",
//                     flexDirection: "column",
//                     // justifyContent: "center",
//                     alignItems: "center",
//                     paddingTop: "60px",
//                     gap: "20px",
//                   }}
//                 >
//                   <div
//                     style={{
//                       position: "absolute",
//                       top: currentPlan == "Lite" ? "24%" : "16%",
//                       left: "8%",
//                       cursor: "pointer",
//                     }}
//                     onClick={() => {
//                       setSuccessMessage("");
//                       setErrorPlaceholder("");
//                       setShowAccountDetails(false);
//                     }}
//                   >
//                     <ArrowBackSymbol />
//                   </div>
//                   <div
//                     style={{
//                       fontFamily: fontFamily,
//                       color:
//                         getItem("theme-preference") === "light-mode"
//                           ? lightModeFontColor
//                           : darkModeFontColor,
//                       fontSize: "28px",
//                       fontWeight: "700",
//                     }}
//                   >
//                     Account Details
//                   </div>
//                   <div
//                     style={{
//                       fontFamily: fontFamily,
//                       color:
//                         getItem("theme-preference") === "light-mode"
//                           ? lightModeFontColor
//                           : darkModeFontColor,
//                       fontSize: "18px",
//                       marginTop: currentPlan == "Lite" ? "20px" : "20px",
//                     }}
//                   >
//                     Current Plan: {currentPlan}
//                   </div>
//                   <div
//                     style={{
//                       fontFamily: fontFamily,
//                       color:
//                         getItem("theme-preference") === "light-mode"
//                           ? lightModeFontColor
//                           : darkModeFontColor,
//                       fontSize: "18px",
//                       marginTop: currentPlan == "Lite" ? "0px" : "20px",
//                     }}
//                   >
//                     {currentPlan === "Suite"
//                       ? subscriptionExpirationDate.length === 0
//                         ? `Renewal Date: ${subscriptionRenewalDate}`
//                         : `Expiration Date: ${subscriptionExpirationDate}`
//                       : ""}
//                   </div>
//                   <div
//                     style={{
//                       width: "270px",
//                       height: "53px",
//                       borderRadius: "50px",
//                       display: "flex",
//                       alignItems: "center",
//                       marginTop: currentPlan == "Lite" ? "0px" : "20px",
//                       justifyContent: "center",
//                       cursor: "pointer",
//                       backgroundColor:
//                         ColorUtils.determineBackgroundColorReverse(),
//                     }}
//                     onClick={() => {
//                       if (
//                         currentPlan === "Suite" &&
//                         subscriptionExpirationDate.length > 0
//                       ) {
//                         continueSubscription();
//                       } else if (
//                         currentPlan === "Suite" &&
//                         subscriptionExpirationDate.length == 0
//                       ) {
//                         cancelSubscription();
//                       } else {
//                         shell.openExternal(
//                           "https://buy.stripe.com/28o5mcfVXcOH8Mw005"
//                         );
//                       }
//                     }}
//                   >
//                     <div
//                       style={{
//                         fontFamily: fontFamily,
//                         fontSize: "1.4rem",
//                         color:
//                           getItem("theme-preference") === "light-mode"
//                             ? darkModeFontColor
//                             : lightModeFontColor,
//                       }}
//                     >
//                       {currentPlan === "Suite" &&
//                       subscriptionExpirationDate.length > 0
//                         ? "continue membership"
//                         : currentPlan === "Suite" &&
//                           subscriptionExpirationDate.length == 0
//                         ? "cancel membership"
//                         : "upgrade membership"}
//                     </div>
//                   </div>
//                   {/* <div>
//                     <div
//                       style={{
//                         fontFamily:  fontFamily ,
//                         color: "#5ab35a",
//                         fontSize: "18px",
//                         maxWidth: "213px",
//                         textAlign: "center",
//                         overflowWrap: "break-word",
//                       }}
//                     >
//                       {successMessage}
//                     </div>
//                   </div>
//                   <div
//                     style={{
//                       width: "280px",
//                       height: "53px",
//                       borderRadius: "50px",
//                       border:
//                         getItem("theme-preference") === "light-mode"
//                           ? "2px solid black"
//                           : "2px solid #E5E4DB",
//                       display: "flex",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <input
//                       style={{
//                         borderRadius: "50px",
//                         border: "none",
//                         fontSize: "1.5rem",
//                         width: "95%",
//                         outline: "none",
//                         paddingLeft: "15px",
//                         backgroundColor: ColorUtils.determineBackgroundColor(),
//                         color:
//                           getItem("theme-preference") === "light-mode"
//                             ? lightModeFontColor
//                             : darkModeFontColor,
//                       }}
//                       value={oldPassword}
//                       placeholder="old password"
//                       type="password"
//                       spellCheck="false"
//                       onChange={(e) => setOldPassword(e.target.value)}
//                     />
//                   </div>
//                   <div
//                     style={{
//                       width: "280px",
//                       height: "53px",
//                       borderRadius: "50px",
//                       border:
//                         getItem("theme-preference") === "light-mode"
//                           ? "2px solid black"
//                           : "2px solid #E5E4DB",
//                       display: "flex",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <input
//                       style={{
//                         borderRadius: "50px",
//                         border: "none",
//                         fontSize: "1.5rem",
//                         width: "95%",
//                         outline: "none",
//                         paddingLeft: "15px",
//                         backgroundColor: ColorUtils.determineBackgroundColor(),
//                         color:
//                           getItem("theme-preference") === "light-mode"
//                             ? lightModeFontColor
//                             : darkModeFontColor,
//                       }}
//                       value={password1}
//                       placeholder="new password"
//                       type="password"
//                       spellCheck="false"
//                       onChange={(e) => setPassword1(e.target.value)}
//                     />
//                   </div>
//                   <div
//                     style={{
//                       width: "280px",
//                       height: "53px",
//                       borderRadius: "50px",
//                       border:
//                         getItem("theme-preference") === "light-mode"
//                           ? "2px solid black"
//                           : "2px solid #E5E4DB",
//                       display: "flex",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <input
//                       style={{
//                         borderRadius: "50px",
//                         border: "none",
//                         fontSize: "1.5rem",
//                         width: "95%",
//                         outline: "none",
//                         paddingLeft: "15px",
//                         backgroundColor: ColorUtils.determineBackgroundColor(),
//                         color:
//                           getItem("theme-preference") === "light-mode"
//                             ? lightModeFontColor
//                             : darkModeFontColor,
//                       }}
//                       value={password2}
//                       placeholder="confirm new password"
//                       type="password"
//                       spellCheck="false"
//                       onChange={(e) => setPassword2(e.target.value)}
//                     />
//                   </div>
//                   <div>
//                     <div
//                       style={{
//                         fontFamily:  fontFamily ,
//                         color:
//                           getItem("theme-preference") === "light-mode"
//                             ? "red"
//                             : "#FF8080",
//                         fontSize: "12px",
//                         maxWidth: "213px",
//                         textAlign: "center",
//                         overflowWrap: "break-word",
//                       }}
//                     >
//                       {errorPlaceholder}
//                     </div>
//                   </div>
//                   <div
//                     style={{
//                       width: "213px",
//                       height: "53px",
//                       borderRadius: "50px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       cursor: "pointer",
//                       backgroundColor:
//                         ColorUtils.determineBackgroundColorReverse(),
//                     }}
//                     onClick={updatePassword}
//                   >
//                     <div
//                       style={{
//                         fontFamily:  fontFamily ,
//                         fontSize: "1.4rem",
//                         color:
//                           getItem("theme-preference") === "light-mode"
//                             ? darkModeFontColor
//                             : lightModeFontColor,
//                       }}
//                     >
//                       update
//                     </div>
//                   </div> */}
//                 </div>
//               )}
//               {showUpdateUsername && (
//                 <div
//                   ref={settingsModalRef}
//                   style={{
//                     width: "352px",
//                     height: "310px",
//                     borderRadius: "43px 43px 43px 43px ",
//                     border:
//                       getItem("theme-preference") === "light-mode"
//                         ? "3px solid black"
//                         : "3px solid #E5E4DB",
//                     backgroundColor: ColorUtils.determineBackgroundColor(),
//                     display: "flex",
//                     flexDirection: "column",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     paddingTop: "50px",
//                     gap: "15px",
//                   }}
//                 >
//                   <div
//                     style={{
//                       position: "absolute",
//                       top: "8%",
//                       left: "8%",
//                       cursor: "pointer",
//                     }}
//                     onClick={() => {
//                       setSuccessMessage("");
//                       setErrorPlaceholder("");
//                       setUsernamePlaceholder("");
//                       setShowUpdateUsername(false);
//                     }}
//                   >
//                     <ArrowBackSymbol />
//                   </div>
//                   <div>
//                     <div
//                       style={{
//                         fontFamily: fontFamily,
//                         color: "#5ab35a",
//                         fontSize: "18px",
//                         maxWidth: "213px",
//                         textAlign: "center",
//                         overflowWrap: "break-word",
//                       }}
//                     >
//                       {successMessage}
//                     </div>
//                   </div>
//                   <div
//                     style={{
//                       width: "213px",
//                       height: "53px",
//                       borderRadius: "50px",
//                       border:
//                         getItem("theme-preference") === "light-mode"
//                           ? "2px solid black"
//                           : "2px solid #E5E4DB",
//                       display: "flex",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <input
//                       style={{
//                         borderRadius: "50px",
//                         border: "none",
//                         fontSize: "1.5rem",
//                         width: "95%",
//                         outline: "none",
//                         paddingLeft: "15px",
//                         backgroundColor: ColorUtils.determineBackgroundColor(),
//                         color: ColorUtils.determineFontColor(),
//                       }}
//                       value={usernamePlaceholder}
//                       placeholder="new username"
//                       spellCheck="false"
//                       onChange={(e) => setUsernamePlaceholder(e.target.value)}
//                     />
//                   </div>
//                   <div>
//                     <div
//                       style={{
//                         fontFamily: fontFamily,
//                         color: ColorUtils.determineErrorColor(),
//                         fontSize: "14px",
//                         maxWidth: "213px",
//                         textAlign: "center",
//                         overflowWrap: "break-word",
//                       }}
//                     >
//                       {errorPlaceholder}
//                     </div>
//                   </div>
//                   <div
//                     style={{
//                       width: "213px",
//                       height: "53px",
//                       borderRadius: "50px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       cursor: "pointer",
//                       backgroundColor:
//                         ColorUtils.determineBackgroundColorReverse(),
//                     }}
//                     onClick={updateUsername}
//                   >
//                     <div
//                       style={{
//                         fontFamily: fontFamily,
//                         fontSize: "1.4rem",
//                         color:
//                           getItem("theme-preference") === "light-mode"
//                             ? darkModeFontColor
//                             : lightModeFontColor,
//                       }}
//                     >
//                       update
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//         {showLoginStreakInfo && (
//           <>
//             <div
//               style={{
//                 position: "absolute",
//                 top: 0,
//                 width: "100%",
//                 height: "100vh",
//                 backgroundColor: "rgba(0,0,0,0.5)",
//                 backdropFilter: "blur(4px)",
//                 zIndex: 2,
//               }}
//               onClick={closeLoginStreakModal}
//             ></div>
//             <div
//               style={{
//                 position: "absolute",
//                 left: "36%",
//                 top: "12%",
//                 zIndex: 3,
//               }}
//             >
//               <div
//                 ref={loginStreakModalRef}
//                 style={{
//                   width: "380px",
//                   height: "452px",
//                   borderRadius: "43px 43px 43px 43px ",
//                   border:
//                     getItem("theme-preference") === "light-mode"
//                       ? "3px solid black"
//                       : "3px solid #E5E4DB",
//                   backgroundColor: ColorUtils.determineBackgroundColor(),
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   paddingTop: "80px",
//                   gap: "30px",
//                 }}
//               >
//                 <div
//                   style={{
//                     position: "absolute",
//                     top: "8%",
//                     right: "8%",
//                     cursor: "pointer",
//                   }}
//                   onClick={() => setShowLoginStreakInfo(false)}
//                 >
//                   <CancelSymbol />
//                 </div>
//                 <div>
//                   <div
//                     style={{
//                       fontFamily: fontFamily,
//                       color: ColorUtils.determineFontColor(),
//                       fontSize: "24px",
//                       maxWidth: "280px",
//                       textAlign: "center",
//                       fontWeight: "700",
//                     }}
//                   >
//                     The only place where streaking is welcomed.
//                   </div>
//                 </div>
//                 <div
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "10px",
//                       marginTop: "20px",
//                     }}
//                   >
//                     <FireSymbol width="25.2" height="36" />
//                     <div
//                       style={{
//                         fontFamily: fontFamily,
//                         color: ColorUtils.determineFontColor(),
//                         fontSize: "45px",
//                         fontWeight: "700",
//                         lineHeight: "0",
//                       }}
//                     >
//                       {currentLoginStreak}
//                     </div>
//                   </div>
//                   <div
//                     style={{
//                       fontFamily: fontFamily,
//                       color: ColorUtils.determineFontColor(),
//                       fontSize: "16px",
//                     }}
//                   >
//                     App Streak
//                   </div>
//                 </div>
//                 <div
//                   style={{
//                     fontFamily: fontFamily,
//                     color: ColorUtils.determineFontColor(),
//                     fontSize: "20px",
//                   }}
//                 >
//                   {weeklyLoginStreak == 1
//                     ? "1 week"
//                     : `${weeklyLoginStreak} weeks`}{" "}
//                   in a row
//                 </div>
//                 <div
//                   style={{
//                     fontFamily: fontFamily,
//                     color: ColorUtils.determineFontColor(),
//                     fontSize: "20px",
//                   }}
//                 >
//                   {daysInApolloThisYear == 1
//                     ? "1 day"
//                     : `${daysInApolloThisYear} days`}{" "}
//                   in Apollo this year
//                 </div>
//                 <div
//                   style={{
//                     display: "flex",
//                     gap: "10px",
//                     justifyContent: "center",
//                   }}
//                 >
//                   {currentWeekDays.map((weekDay, index) => (
//                     <div
//                       key={index}
//                       style={{
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                         gap: "5px",
//                       }}
//                     >
//                       <div
//                         style={{
//                           fontFamily: fontFamily,
//                           color: ColorUtils.determineFontColor(),
//                           fontSize: "18px",
//                         }}
//                       >
//                         {moment.tz(moment.tz.guess()).day(index).format("ddd")}
//                       </div>
//                       {loggedDays.includes(currentWeekDays[index]) ? (
//                         <SolidFireSymbol />
//                       ) : (
//                         <div
//                           style={{
//                             padding: "5px",
//                             height: "25px",
//                             width: "25px",
//                             textAlign: "center",
//                           }}
//                         >
//                           <div
//                             style={{
//                               fontFamily: fontFamily,
//                               color: ColorUtils.determineFontColor(),
//                               fontSize: "18px",
//                             }}
//                           >
//                             {currentWeekDays[index]}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </>
//     )
//   ) : (
//     <></>
//   );
// };

// export default Home;

export {};
