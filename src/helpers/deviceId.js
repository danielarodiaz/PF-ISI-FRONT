const DEVICE_ID_KEY = "infotrackDeviceId";

const fallbackRandomId = () =>
  `dev-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;

export const getOrCreateDeviceId = () => {
  const existing = localStorage.getItem(DEVICE_ID_KEY);
  if (existing) return existing;

  const generated = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : fallbackRandomId();

  localStorage.setItem(DEVICE_ID_KEY, generated);
  return generated;
};
