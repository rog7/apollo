import { Fragment, useContext, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";
import * as ColorUtils from "../utils/determineColors";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import { getItem } from "../utils/localStorage";
import { ProfileImageUrlContext, UsernameContext } from "../pages/home";
import { API_BASE_URL } from "../utils/globalVars";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as utils from "../utils/determineColors";

interface Props {
  setShowProfileModal: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function ProfileModal({ setShowProfileModal }: Props) {
  const [open, setOpen] = useState(true);
  const [editingUsername, setEditingUsername] = useState(false);
  const { username, setUsername } = useContext(UsernameContext);
  const { profileImageUrl, setProfileImageUrl } = useContext(
    ProfileImageUrlContext
  );
  const [previousUsername, setPreviousUsername] = useState(username);
  const [errorPlaceholder, setErrorPlaceholder] = useState("");

  // useEffect(() => {
  //   reader.onload = async (event) => {
  //     try {
  //       const base64String = event.target.result;

  //       console.log(base64String);
  //       if (getItem("email") === null) return;
  //       const obj = {
  //         email: getItem("email"),
  //         base64String,
  //       };

  //       const response = await fetch(
  //         `${API_BASE_URL}/api/users/profile_image`,
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify(obj),
  //         }
  //       );

  //       const data = await response.json();

  //       if (response.status === 200) {
  //         setErrorPlaceholder("");
  //       } else {
  //         setErrorPlaceholder(data.message);
  //       }
  //     } catch (error) {
  //       console.log("Error reading or uploading file:", error);
  //     }
  //   };

  //   // Handle potential errors during file reading
  //   reader.onerror = (error) => {
  //     console.log("Error reading file:", error);
  //   };
  // }, []);
  const handleSaveUsername = async () => {
    if (username.length === 0) return;

    setErrorPlaceholder("");

    if (username === previousUsername) {
      setEditingUsername(false);
      return;
    }

    const tokenPayload = jwt.decode(getItem("auth-token")) as JwtPayload;
    const email = tokenPayload.email;

    const obj = {
      email,
      username,
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/update_username`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
          body: JSON.stringify(obj),
        }
      );
      const data = await response.json();

      if (response.status === 200) {
        setUsername(data.username);
        setEditingUsername(false);
        setPreviousUsername(data.username);
      } else {
        setErrorPlaceholder(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0] as File;

    const imageUrl = URL.createObjectURL(file);
    setProfileImageUrl(imageUrl);

    const S3_BUCKET = "apollo-profile-photos";
    const REGION = "us-east-1";

    // Configure AWS SDK v3
    const s3Client = new S3Client({
      region: REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const fileName = `${uuidv4()}.png`;

    const params = {
      ACL: "private",
      Body: file,
      Bucket: S3_BUCKET,
      Key: fileName,
    };

    const command = new PutObjectCommand(params);

    try {
      await s3Client.send(command);
    } catch (error) {
      console.error(error);
    }

    const profileImageUrl = `https://apollo-profile-photos.s3.amazonaws.com/${fileName}`;

    const tokenPayload = jwt.decode(getItem("auth-token")) as JwtPayload;
    const email = tokenPayload.email;
    const obj = {
      email,
      profileImageUrl,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/profile_image`, {
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
      } else {
        setErrorPlaceholder(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => {
          setShowProfileModal(false);
          setOpen(false);
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed z-40 inset-0 bg-opacity-50 transition-opacity"
            style={{ backgroundColor: "#313131" }}
          />
        </Transition.Child>

        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="relative text-center scale-150 mt-[20px]">
                    {profileImageUrl !== null ? (
                      <div className="inline-block h-14 w-14 overflow-hidden rounded-full">
                        <img
                          src={profileImageUrl}
                          alt="pic"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <span
                        className={`inline-block h-14 w-14 overflow-hidden rounded-full bg-gray-100`}
                      >
                        <svg
                          className="h-full w-full text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </span>
                    )}
                    <label
                      htmlFor="fileInput"
                      className="absolute bottom-[7%] left-[52.5%] h-4 w-4 cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#313131"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    </label>
                    <input
                      type="file"
                      id="fileInput"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <div className="flex justify-center items-center gap-x-2">
                      {editingUsername ? (
                        <div>
                          <div className="flex items-center gap-x-2">
                            <div
                              className="font-semibold"
                              style={{ color: "#313131" }}
                            >
                              {" "}
                              @
                              <input
                                type="text"
                                value={username}
                                onChange={(e) => {
                                  const inputValue = e.target.value
                                    .toLowerCase()
                                    .trim()
                                    .slice(0, 20);
                                  if (!inputValue.includes("@")) {
                                    setUsername(inputValue);
                                  }
                                }}
                                className="bg-white font-semibold outline-none border-b border-gray-300"
                                spellCheck="false"
                              />
                            </div>
                            <CheckIcon
                              className="h-4 w-4 cursor-pointer"
                              style={{ stroke: "green" }}
                              onClick={handleSaveUsername}
                            />
                            <XMarkIcon
                              className="h-4 w-4 cursor-pointer"
                              style={{ stroke: "red" }}
                              onClick={() => {
                                setEditingUsername(false);
                                setErrorPlaceholder("");
                                setUsername(previousUsername);
                              }}
                            />
                          </div>
                          <div
                            className="text-sm max-w-[250px] text-center mt-1.5"
                            style={{
                              color: ColorUtils.determineErrorColor(),
                            }}
                          >
                            {errorPlaceholder}
                          </div>
                        </div>
                      ) : (
                        <>
                          <Dialog.Title
                            as="h3"
                            className="text-base font-semibold leading-6 text-gray-900"
                          >
                            @{username}
                          </Dialog.Title>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#313131"
                            className="h-4 w-4 cursor-pointer"
                            onClick={() => setEditingUsername(true)}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>

                          {/* <PencilSquareIcon
                            className="h-4 w-4 cursor-pointer"
                            onClick={() => setEditingUsername(true)}
                          /> */}
                        </>
                      )}
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Upload a fire pic and choose a dope username.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-[#313131] px-3 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none"
                    onClick={() => {
                      setOpen(false);
                      setErrorPlaceholder("");
                      setShowProfileModal(false);
                      setUsername(previousUsername);
                    }}
                  >
                    Go back.
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
