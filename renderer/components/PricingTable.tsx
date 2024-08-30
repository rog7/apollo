import { shell } from "electron";
import * as utils from "../utils/determineColors";
import { Dispatch, SetStateAction, useContext } from "react";
import { PaymentLinkContext } from "../pages/home";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  price: number;
  setShowPricingTable: Dispatch<SetStateAction<boolean>>;
}
export default function PricingTable({ price, setShowPricingTable }: Props) {
  const { paymentLink } = useContext(PaymentLinkContext);

  const tiers = [
    {
      name: "Basic",
      id: "tier-basic",
      href: "#",
      priceMonthly: "Free",
      description: "For those getting started on the piano.",
      features: [
        "Basic chord detection",
        "Limited practice assessment",
        "Simple customization options",
        "Standard updates",
      ],
      featured: false,
    },
    {
      name: "Premium",
      id: "tier-premium",
      href: "#",
      priceMonthly: `$${price}`,
      description:
        "Perfect for pianists who want to achieve effortless music creation.",
      features: [
        "Advanced chord detection",
        "Comprehensive practice assessment",
        "Enhanced customization settings",
        "Priority updates",
        "Exclusive access to chord library",
        "Unlimited feature requests",
      ],
      featured: true,
    },
  ];

  return (
    <div>
      <div
        className="z-50 absolute top-[30px] right-[30px] cursor-pointer"
        onClick={() => setShowPricingTable(false)}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.5 29.6L20 22.1L27.5 29.6L29.6 27.5L22.1 20L29.6 12.5L27.5 10.4L20 17.9L12.5 10.4L10.4 12.5L17.9 20L10.4 27.5L12.5 29.6ZM20 40C17.2667 40 14.6833 39.475 12.25 38.425C9.81667 37.375 7.69167 35.9417 5.875 34.125C4.05833 32.3083 2.625 30.1833 1.575 27.75C0.525 25.3167 0 22.7333 0 20C0 17.2333 0.525 14.6333 1.575 12.2C2.625 9.76667 4.05833 7.65 5.875 5.85C7.69167 4.05 9.81667 2.625 12.25 1.575C14.6833 0.525 17.2667 0 20 0C22.7667 0 25.3667 0.525 27.8 1.575C30.2333 2.625 32.35 4.05 34.15 5.85C35.95 7.65 37.375 9.76667 38.425 12.2C39.475 14.6333 40 17.2333 40 20C40 22.7333 39.475 25.3167 38.425 27.75C37.375 30.1833 35.95 32.3083 34.15 34.125C32.35 35.9417 30.2333 37.375 27.8 38.425C25.3667 39.475 22.7667 40 20 40ZM20 37C24.7333 37 28.75 35.3417 32.05 32.025C35.35 28.7083 37 24.7 37 20C37 15.2667 35.35 11.25 32.05 7.95C28.75 4.65 24.7333 3 20 3C15.3 3 11.2917 4.65 7.975 7.95C4.65833 11.25 3 15.2667 3 20C3 24.7 4.65833 28.7083 7.975 32.025C11.2917 35.3417 15.3 37 20 37Z"
            fill={utils.determineBackgroundColorForPremiumCard()}
          />
        </svg>
      </div>
      <div
        className="z-40 flex justify-center relative isolate h-screen"
        style={{ backgroundColor: utils.determineBackgroundColor() }}
      >
        <div className="mx-auto grid max-w-lg grid-cols-1 items-center gap-y-6 lg:max-w-4xl lg:grid-cols-2">
          {tiers.map((tier, tierIdx) => (
            <div
              key={tier.id}
              className={classNames(
                tier.featured ? "relative -mx-[10px]" : "border-[2px]",
                tier.featured
                  ? ""
                  : tierIdx === 0
                  ? "rounded-t-3xl sm:rounded-b-none lg:rounded-bl-3xl lg:rounded-tr-none"
                  : "sm:rounded-t-none lg:rounded-bl-none lg:rounded-tr-3xl",
                "rounded-3xl ring-1 ring-gray-900/10 sm:p-10"
              )}
              style={{
                backgroundColor: tier.featured
                  ? utils.determineBackgroundColorForPremiumCard()
                  : utils.determineBackgroundColorForFreeCard(),
                borderColor: tier.featured
                  ? ""
                  : utils.determineBorderColorForFreeCard(),
              }}
            >
              <span
                className="inline-flex items-center rounded-full bg-gray-100 px-[20px] py-[6px]"
                style={{
                  backgroundColor: tier.featured
                    ? utils.determineBackgroundColorForFreeCard()
                    : utils.determineBackgroundColorForPremiumCard(),
                }}
              >
                <h3
                  id={tier.id}
                  className={`text-[16px] font-bold text-center`}
                  style={{
                    color: tier.featured
                      ? utils.determineFontColor()
                      : utils.determineFontColorReverse(),
                  }}
                >
                  {tier.name}
                </h3>
              </span>
              <p className="mt-4 flex items-baseline gap-x-2">
                <span
                  className={`text-[48px] font-bold text-center`}
                  style={{
                    color: tier.featured
                      ? utils.determineFontColorReverse()
                      : utils.determineFontColor(),
                  }}
                >
                  {tier.priceMonthly}
                </span>
              </p>
              <p
                className="text-[16px]"
                style={{
                  color: tier.featured
                    ? utils.determineFontColorReverse()
                    : utils.determineFontColor(),
                }}
              >
                {tier.description}
              </p>
              <ul
                role="list"
                className="mt-8 space-y-3 text-sm leading-6"
                style={{
                  color: tier.featured
                    ? utils.determineFontColorReverse()
                    : utils.determineFontColor(),
                }}
              >
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-x-3 items-center"
                    style={{
                      color: tier.featured
                        ? utils.determineFontColorReverse()
                        : utils.determineFontColor(),
                    }}
                  >
                    <svg
                      width="13"
                      height="15"
                      viewBox="0 0 13 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        className="svg-element"
                        d="M2 9.58621L5.24 13L11 2"
                        stroke={
                          tier.featured
                            ? utils.determineFontColorReverse()
                            : utils.determineFontColor()
                        }
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={tier.href}
                aria-describedby={tier.id}
                className="mt-8 block rounded-md py-2.5 text-center text-sm font-bold focus:outline-none"
                style={{
                  color: tier.featured
                    ? utils.determineFontColor()
                    : utils.determineFontColorReverse(),
                  backgroundColor: tier.featured
                    ? utils.determineBackgroundColorForFreeCard()
                    : utils.determineBackgroundColorForPremiumCard(),
                }}
                onClick={() => {
                  tier.featured
                    ? shell.openExternal(paymentLink)
                    : setShowPricingTable(false);
                }}
              >
                {tier.featured ? "Become a pro member" : "Stay on plan"}
              </a>
              {tier.featured && (
                <p
                  className="mt-[8px] text-[16px] text-center font-bold"
                  style={{
                    color: utils.determineFontColorReverse(),
                  }}
                >
                  Join once. Use forever.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
