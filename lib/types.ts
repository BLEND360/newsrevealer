export interface GenerateRequest {
  model: string;
  topic_dict: { [topic: string]: string };
  url?: string;
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
  source_metrics: { [key: string]: string };
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
  get_topics: boolean;
  confidence?: number;
  text?: string;
  url?: string;
}

export interface TopicScanResponse {
  article_body: string;
  source_metrics: {
    word_count: number;
    sentence_count: 0;
  };
  topic_text: { [topic: string]: string };
}

export type AsyncTopicScanRequest = TopicScanRequest & {
  bucket: string;
  key: string;
};

export type TopicScanError = GenerateError;

export interface SummarizerRequest {
  text_dict: { [topic: string]: string };
  url?: string;
  model: string;
}

export interface SummarizerResponse {
  short_summary_dict: { [topic: string]: string };
  long_summary_dict: { [topic: string]: string };
  bot_summary_dict: { [topic: string]: string };
  parrot_summary_dict: { [topic: string]: string };
  summary_metrics_dict: {
    [topic: string]: {
      word_count: number;
      sentence_count: number;
      repeated_sentences: number;
      similarity_percentage: number;
    };
  };
  source_metrics_dict: {
    [topic: string]: {
      word_count: 0;
      sentence_count: 0;
    };
  };
}

export interface AsyncSummarizerRequest extends SummarizerRequest {
  bucket: string;
  key: string;
}

export type SummarizerError = GenerateError;
