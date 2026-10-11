export interface ApiError {
  code?: string;
  detail?: string;
  id?: string;
  source?: { parameter?: string };
  status?: string;
  title?: string;
}

const describe = (status: number, error?: ApiError) => {
  if (error) {
    return `${error.code ?? status} ${error.title ?? "Error"}${error.detail ? `: ${error.detail}` : ""}`;
  }
  if (status === 401) {
    return "401 with an empty body: the developer token is invalid or expired, or the request lacks an apple.com Origin";
  }
  return `${status} with no error body`;
};

export class AmpError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly title?: string;
  readonly detail?: string;
  readonly parameter?: string;
  readonly correlationId?: string;

  constructor(status: number, error?: ApiError) {
    super(describe(status, error));
    this.name = "AmpError";
    this.status = status;
    this.code = error?.code;
    this.title = error?.title;
    this.detail = error?.detail;
    this.parameter = error?.source?.parameter;
    this.correlationId = error?.id;
  }
}
