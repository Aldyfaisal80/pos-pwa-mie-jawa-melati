const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

/** Convert date to start-of-day in WIB (UTC+7), returned as UTC */
export const toWIBStartOfDay = (date: Date): Date => {
  const wib = new Date(date.getTime() + WIB_OFFSET_MS);
  wib.setUTCHours(0, 0, 0, 0);
  return new Date(wib.getTime() - WIB_OFFSET_MS);
};

/** Convert date to end-of-day in WIB (UTC+7), returned as UTC */
export const toWIBEndOfDay = (date: Date): Date => {
  const wib = new Date(date.getTime() + WIB_OFFSET_MS);
  wib.setUTCHours(23, 59, 59, 999);
  return new Date(wib.getTime() - WIB_OFFSET_MS);
};

/** Get start of today WIB as UTC */
export const todayWIBStart = (): Date => toWIBStartOfDay(new Date());
