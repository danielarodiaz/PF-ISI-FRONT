export const SERVICE_ERROR_CODES = {
  CONFIG_MISSING: "CONFIG_MISSING",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
};

export const createServiceError = (code, message, cause) => {
  const error = new Error(message);
  error.code = code;
  if (cause) error.cause = cause;
  return error;
};

export const isConfigMissingError = (error) =>
  error?.code === SERVICE_ERROR_CODES.CONFIG_MISSING;
