import { Col, Row } from "react-bootstrap";
import { GenerateResult, TopicScanResult } from "../lib/types";
import ResultCard from "./ResultCard";

export interface ResultsProps {
  results: Partial<GenerateResult & TopicScanResult>;
  model?: string | null;
  topics: string[];
}

export default function Results({ results, model, topics }: ResultsProps) {
  return (
    <Row>
      <Col xs={12} lg={6}>
        {results.article_body && (
          <ResultCard
            height="40rem"
            title="Article Text"
            body={results.article_body}
            metrics={results.source_metrics}
          />
        )}
      </Col>
      <Col xs={12} lg={6}>
        {topics.map(
          (value) =>
            (model === "short"
              ? results.short_summary_dict?.[value]
              : model === "long"
              ? results.long_summary_dict?.[value]
              : model === "bot"
              ? results.bot_summary_dict?.[value]
              : "") && (
              <ResultCard
                key={value}
                height="40rem"
                title={`${value.replace(/^./, (x) => x.toUpperCase())} Summary`}
                showGrammarCheckButton={true}
                body={
                  (model === "short"
                    ? results.short_summary_dict?.[value]
                    : model === "long"
                    ? results.long_summary_dict?.[value]
                    : model === "bot"
                    ? results.bot_summary_dict?.[value]
                    : "") ?? ""
                }
                headerBody={
                  model === "long" ? results.short_summary_dict?.[value] : null
                }
                metrics={results.summary_metrics_dict?.[value]}
              />
            )
        )}
      </Col>
    </Row>
  );
}
