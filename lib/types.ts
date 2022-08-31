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
  topic_text?: { [topic: string]: string };
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

export interface TopicScanRequest {
  url?: string;
  text?: string;
  confidence?: number;
}

export interface TopicScanResponse {
  article_body: string;
  source_metrics: {
    word_count: number;
    sentence_count: 0;
  };
  topic_text: { [topic: string]: string; }
}

export interface AsyncTopicScanRequest extends TopicScanRequest {
  bucket: string;
  key: string;
}

export type TopicScanError = GenerateError;

export interface SummarizerRequest {
  url: string;
  text: string;
  model: string;
  debug: string;
}

export interface SummarizerResponse {
  short_summary: string;
  long_summary: string;
  bot_summary: string;
  parrot_summary: string;
  summary_metrics: {
    word_count: number;
    sentence_count: number;
    repeated_sentences: number;
    similarity_percentage: number;
  };
  source_metrics: {
    word_count: 0;
    sentence_count: 0;
  }
}

export interface AsyncSummarizerRequest extends SummarizerRequest {
  bucket: string;
  key: string;
}

export type SummarizerError = GenerateError;
