export const WEBSOCKET_URL =
  process.env.NODE_ENV === "development"
    ? process.env.DEV_WEBSOCKET_URL
    : process.env.PROD_WEBSOCKET_URL;

export const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.DEV_API_BASE_URL
    : process.env.PROD_API_BASE_URL;

export const BILLING_PORTAL_URL =
  process.env.NODE_ENV === "development"
    ? process.env.DEV_BILLING_PORTAL_URL
    : process.env.PROD_BILLING_PORTAL_URL;

export const APOLLO_PAYMENT_LINK =
  process.env.NODE_ENV === "development"
    ? process.env.DEV_APOLLO_PAYMENT_LINK
    : process.env.PROD_APOLLO_PAYMENT_LINK;

export const POSTHOG_API_KEY =
  process.env.NODE_ENV === "development"
    ? process.env.DEV_POSTHOG_API_KEY
    : process.env.PROD_POSTHOG_API_KEY;

export const TIME_ALLOWED_TO_SEND_MIDI_MESSAGE = 1000;
