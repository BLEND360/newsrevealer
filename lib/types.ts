export interface GenerateRequest {
  model: string;
  topic_dict: { [topic: string]: string };
  url?: string;
  text?: string;
}

export interface AsyncGenerateRequest extends GenerateRequest {
  bucket: string;
  key: string;
}

export interface AsyncResponse {
  bucket: string;
  key: string;
}

export interface GenerateResult {
  short_summary_dict: { [topic: string]: string };
  long_summary_dict: { [topic: string]: string };
  bot_summary_dict: { [topic: string]: string };
  parrot_summary_dict: { [topic: string]: string };
  summary_metrics_dict: {
    [topic: string]: { [metric: string]: string };
  };
  source_metrics_dict: {
    [topic: string]: { [metric: string]: string };
  };
}

export interface ResponseError {
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

export interface TopicScanRequest {
  get_topics: boolean;
  confidence?: number;
  text?: string;
  url?: string;
}

export interface TopicScanResult {
  article_body: string;
  source_metrics: { [metric: string]: string };
  topic_text: { [topic: string]: string };
}

export type AsyncTopicScanRequest = TopicScanRequest & {
  bucket: string;
  key: string;
};
