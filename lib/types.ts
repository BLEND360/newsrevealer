export interface GenerateRequest {
  url: string;
  topics: string[];
  confidence: number;
  model: string;
}

export interface GenerateResult {
  body: string;
  sentences_dt: { [key: string]: string };
  summary_dt: { [key: string]: string };
  parrot_dt: { [key: string]: string };
  long_summary_dt: { [key: string]: string };
}

export interface GenerateError {
  errorType: string;
  errorMessage: string;
}
