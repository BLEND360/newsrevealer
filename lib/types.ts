export interface GenerateRequest {
  url?: string;
  text?: string;
  topics: string[];
  confidence: number;
  model: string | null;
}

export interface AsyncGenerateRequest extends GenerateRequest {
  bucket: string;
  key: string;
}

export interface GenerateResponse {
  bucket: string;
  key: string;
}

export interface GenerateResult {
  article_body: string;
  sentences_dt: { [key: string]: string };
  output_dt: { [key: string]: string };
  parrot_dt: { [key: string]: string };
  long_summary_dt: { [key: string]: string };
}

export interface GenerateError {
  errorType?: string;
  errorMessage: string;
}
