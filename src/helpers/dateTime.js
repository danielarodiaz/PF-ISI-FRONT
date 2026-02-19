export const USER_TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const formatInUserTimeZone = (value, options = {}) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat(undefined, {
    timeZone: USER_TIME_ZONE,
    ...options,
  }).format(date);
};
