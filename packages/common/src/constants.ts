
export const DEFAULT_API_PORT = 8080;
export const DEFAULT_HUB_PORT = 3001;
export const DEFAULT_FRONTEND_PORT = 3000;

export const TICK_INTERVAL_MS = 60 * 1000; // 1 minute
export const MAX_LATENCY_TIMEOUT_MS = 30 * 1000; // 30 seconds
export const VALIDATOR_HEARTBEAT_INTERVAL_MS = 30 * 1000; // 30 seconds

export const API_ROUTES = {
  CREATE_WEBSITE: "/api/v1/website",
  GET_WEBSITES: "/api/v1/websites",
  GET_WEBSITE_STATUS: "/api/v1/websites/status",
  DELETE_WEBSITE: "/api/v1/website",

  VALIDATOR_SIGNUP: "/api/v1/validator/signup",
  VALIDATOR_VALIDATE: "/api/v1/validator/validate",

  HEALTH: "/health",
} as const;

export const SIGNING_PREFIX = "web3-uptime-validate:";
