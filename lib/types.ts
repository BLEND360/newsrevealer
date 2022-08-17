export interface GenerateRequest {
  url?: string;
  text?: string;
  topics: string[];
  confidence: number;
  model: string;
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
  bot_dt: { [key: string]: string };
  long_summary_dt: { [key: string]: string };
  metrics_dt: { [key: string]: { [key: string]: string } };
  source_metrics_dt: { [key: string]: string };
  classified_metrics_dt: { [key: string]: { [key: string]: string } };
}

export interface GenerateError {
  errorType?: string;
  errorMessage: string;
}

export interface GrammarCheckRequest {
  text_list: string[];
}

export interface GrammarCheckResult {
  corrected_text_list: string[];
}

export interface AsyncGrammarCheckRequest extends GrammarCheckRequest {
  bucket: string;
  key: string;
}

export type GrammarCheckError = GenerateError;
