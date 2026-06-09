const DEFAULT_WHITELIST = ["138.255.215.164"];

const envValue = process.env.DEV_WHITELIST_IPS;

export const DEV_WHITELIST: string[] = envValue
  ? envValue
      .split(",")
      .map((ip) => ip.trim())
      .filter(Boolean)
  : DEFAULT_WHITELIST;
