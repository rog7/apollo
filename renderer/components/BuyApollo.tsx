import LockClosedIcon from "@heroicons/react/20/solid/LockClosedIcon";
import { shell } from "electron";
import ApolloSymbol from "./symbols/ApolloSymbol";
import { PaymentLinkContext } from "../pages/home";
import { useContext } from "react";

const BuyApollo = () => {
  const { paymentLink } = useContext(PaymentLinkContext);

  // useEffect(() => {
  //   const performPaymentCheck = async () => {
  //     const authToken = getItem("auth-token");

  //     const isProUser = (jwt.decode(authToken) as JwtPayload).isProUser;
  //     if (!isProUser) {
  //       try {
  //         await fetch(`${API_BASE_URL}/api/users/payment_check`, {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: "Bearer " + authToken,
  //             "ngrok-skip-browser-warning": "69420",
  //           },
  //         });
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   };

  //   setInterval(performPaymentCheck, 10000);
  // }, []);
  const buyApollo = () => {
    shell.openExternal(paymentLink);
  };

  return (
    <div className="bg-[#ECEBE8] flex h-screen items-center">
      <div className="mx-auto max-w-lg">
        <div className="flex justify-center">
          <ApolloSymbol />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="mt-6 w-full rounded-md border border-transparent bg-[#2F6EEB] px-4 py-2 text-md font-medium text-white focus:outline-none"
            onClick={buyApollo}
          >
            Become a Pro Member
          </button>

          <p className="mt-6 flex justify-center text-sm font-medium text-gray-500">
            <LockClosedIcon
              className="mr-1.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Secure Payment
          </p>
          <p className="mt-6 flex justify-center text-sm font-medium text-gray-500 text-center">
            Your trial has ended. To continue enjoying Apollo's premium
            features, become a pro member today.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BuyApollo;
