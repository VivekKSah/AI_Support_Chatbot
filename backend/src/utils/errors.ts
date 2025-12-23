export class AppError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string, code: string, statusCode = 500) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

export const ERROR_CODES = {
  INVALID_ARGUMENT: "INVALID_ARGUMENT",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  RESOURCE_EXHAUSTED: "RESOURCE_EXHAUSTED",
  INTERNAL: "INTERNAL",
  UNAVAILABLE: "UNAVAILABLE",
  DEADLINE_EXCEEDED: "DEADLINE_EXCEEDED",
};

