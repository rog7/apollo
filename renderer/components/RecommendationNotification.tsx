import { Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Fragment, useContext, useState } from "react";
import { ShowPricingTableContext } from "../pages/main";

interface Props {
  showRecommendationNotification: boolean;
  setShowRecommendationNotification: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  onPlayRecommendation: (shouldPlay: boolean) => void;
  playRecommendation: boolean;
  onPlaybackSpeedChange: (playbackSpeed: number) => void;
  onSubmitRating: (rating: number) => void;
  eligibleToPlayRecommendation: boolean;
}

export default function RecommendationNotification({
  showRecommendationNotification,
  setShowRecommendationNotification,
  onPlayRecommendation,
  playRecommendation,
  onPlaybackSpeedChange,
  onSubmitRating,
  eligibleToPlayRecommendation,
}: Props) {
  const [selectedSpeed, setSelectedSpeed] = useState(1);

  const speeds = [0.25, 0.5, 0.75, 1, 2];

  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    onSubmitRating(rating);
  };

  const { setShowPricingTable } = useContext(ShowPricingTableContext);

  return (
    <>
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          <Transition
            show={showRecommendationNotification}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="black"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900">
                      You have a new recommendation!
                    </p>
                    <div className="flex flex-col items-center">
                      <div className="mt-3 flex justify-center items-center gap-5">
                        <button
                          type="button"
                          className="rounded-md bg-white text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
                          onClick={() => {
                            if (eligibleToPlayRecommendation) {
                              onPlayRecommendation(
                                !playRecommendation ? true : false
                              );
                            } else {
                              setShowPricingTable(true);
                            }
                          }}
                        >
                          {!playRecommendation ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              className="text-black w-[24px] h-[24px]"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              className="text-black w-[24px] h-[24px]"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>

                        <div className="flex gap-2 items-center">
                          {speeds.map((speed) => (
                            <p
                              key={speed}
                              className={`font-medium cursor-pointer ${
                                selectedSpeed === speed
                                  ? "text-md text-slate-900 opacity-100"
                                  : "text-sm text-gray-900 opacity-50"
                              }`}
                              onClick={() => {
                                if (eligibleToPlayRecommendation) {
                                  onPlaybackSpeedChange(speed);
                                  setSelectedSpeed(speed);
                                } else {
                                  setShowPricingTable(true);
                                }
                              }}
                            >
                              {speed}x
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="mt-[15px] flex gap-2 justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke={selectedRating === 0 ? "#000000" : "#9ca3af"}
                          className="no-transition w-6 h-6 cursor-pointer"
                          onClick={() => {
                            if (eligibleToPlayRecommendation) {
                              handleRatingClick(0);
                            } else {
                              setShowPricingTable(true);
                            }
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke={selectedRating === 1 ? "#000000" : "#9ca3af"}
                          className="no-transition w-6 h-6 cursor-pointer"
                          onClick={() => {
                            if (eligibleToPlayRecommendation) {
                              handleRatingClick(1);
                            } else {
                              setShowPricingTable(true);
                            }
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                          />
                        </svg>
                      </div>
                      <p className="text-[10px] text-gray-400">
                        Your feedback improves recommendations.
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 outline-none"
                      onClick={() => {
                        setSelectedRating(null);
                        onPlayRecommendation(false);
                        setShowRecommendationNotification(false);
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
}
