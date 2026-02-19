export const SERVICE_ERROR_CODES = {
  CONFIG_MISSING: "CONFIG_MISSING",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  BAD_REQUEST: "BAD_REQUEST",
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
};

export const createServiceError = (code, message, cause) => {
  const error = new Error(message);
  error.code = code;
  if (cause) error.cause = cause;
  return error;
};

export const isConfigMissingError = (error) =>
  error?.code === SERVICE_ERROR_CODES.CONFIG_MISSING;

export const isBadRequestError = (error) =>
  error?.code === SERVICE_ERROR_CODES.BAD_REQUEST;

export const isTooManyRequestsError = (error) =>
  error?.code === SERVICE_ERROR_CODES.TOO_MANY_REQUESTS;
