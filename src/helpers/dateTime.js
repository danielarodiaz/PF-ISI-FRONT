export const USER_TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

const HAS_EXPLICIT_TIMEZONE_REGEX = /(z|[+-]\d{2}:\d{2})$/i;
const ISO_LIKE_WITHOUT_TZ_REGEX = /^\d{4}-\d{2}-\d{2}t\d{2}:\d{2}:\d{2}(\.\d+)?$/i;

const normalizeBackendUtcInput = (value) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return trimmed;

  if (ISO_LIKE_WITHOUT_TZ_REGEX.test(trimmed) && !HAS_EXPLICIT_TIMEZONE_REGEX.test(trimmed)) {
    return `${trimmed}Z`;
  }
  return trimmed;
};

export const parseBackendUtcDate = (value) => {
  if (value === null || value === undefined || value === "") return null;

  const normalized = normalizeBackendUtcInput(value);
  const date = normalized instanceof Date ? normalized : new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatInUserTimeZone = (value, options = {}) => {
  const date = parseBackendUtcDate(value);
  if (!date) return "-";

  return new Intl.DateTimeFormat(undefined, {
    timeZone: USER_TIME_ZONE,
    ...options,
  }).format(date);
};

export const getHourInUserTimeZone = (value) => {
  const date = parseBackendUtcDate(value);
  if (!date) return null;

  const parts = new Intl.DateTimeFormat(undefined, {
    timeZone: USER_TIME_ZONE,
    hour: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const hourPart = parts.find((part) => part.type === "hour")?.value;
  return hourPart ? Number.parseInt(hourPart, 10) : null;
};

export const getDateKeyInUserTimeZone = (value) => {
  const date = parseBackendUtcDate(value);
  if (!date) return null;

  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: USER_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  if (!year || !month || !day) return null;

  return `${year}-${month}-${day}`;
};

export const getMonthKeyInUserTimeZone = (value) => {
  const date = parseBackendUtcDate(value);
  if (!date) return null;

  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: USER_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  if (!year || !month) return null;

  return `${year}-${month}`;
};

export const getYearKeyInUserTimeZone = (value) => {
  const date = parseBackendUtcDate(value);
  if (!date) return null;

  const parts = new Intl.DateTimeFormat(undefined, {
    timeZone: USER_TIME_ZONE,
    year: "numeric",
  }).formatToParts(date);
  return parts.find((part) => part.type === "year")?.value ?? null;
};

export const formatDayLabelInUserTimeZone = (key) => {
  if (!key) return "";
  const date = new Date(`${key}T00:00:00Z`);
  return new Intl.DateTimeFormat(undefined, {
    timeZone: USER_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export const formatMonthLabelInUserTimeZone = (key) => {
  if (!key) return "";
  const [year, month] = key.split("-");
  const date = new Date(`${year}-${month}-01T00:00:00Z`);
  return new Intl.DateTimeFormat(undefined, {
    timeZone: USER_TIME_ZONE,
    month: "short",
    year: "numeric",
  }).format(date);
};

export const diffMinutesBetweenUtcDates = (startValue, endValue) => {
  const start = parseBackendUtcDate(startValue);
  const end = parseBackendUtcDate(endValue);
  if (!start || !end) return null;

  return (end.getTime() - start.getTime()) / 60000;
};
