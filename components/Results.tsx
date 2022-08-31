import { Card, Col, Row } from "react-bootstrap";
import { GenerateResult } from "../lib/types";
import ResultCard from "./ResultCard";

export interface ResultsProps {
  results: GenerateResult;
  model?: string;
  articleTextOnly?: boolean;
}

export default function Results({ results, model, articleTextOnly }: ResultsProps) {
  return (
    <Row>
      <Col xs={12} lg={4}>
        <ResultCard
          height="40rem"
          title="Article Text"
          body={results.article_body}
          metrics={results.source_metrics}
        />
      </Col>
      {!articleTextOnly &&
        <Col xs={12} lg={8}>
        {Object.keys(results.sentences_dt).map(
          (value) =>
            results.sentences_dt[value] && (
              <Row key={value}>
                <Col xs={12} sm={6}>
                  <ResultCard
                    height="40rem"
                    title={`${value.replace(/^./, (x) =>
                      x.toUpperCase()
                    )} Classified Text`}
                    body={results.sentences_dt?.[value]}
                    metrics={results.classified_metrics_dt?.[value]}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <ResultCard
                    height="40rem"
                    title={`${value.replace(/^./, (x) =>
                      x.toUpperCase()
                    )} Summary`}
                    showGrammarCheckButton={true}
                    body={
                      model === "short"
                        ? results.output_dt?.[value]
                        : model === "long"
                        ? results.long_summary_dt?.[value]
                        : model === "bot"
                        ? results.bot_dt?.[value]
                        : ""
                    }
                    headerBody={model === "long" ? results.output_dt?.[value] : null}
                    metrics={results.metrics_dt?.[value]}
                  />
                </Col>
              </Row>
            )
        )}
        </Col>}
    </Row>
  );
}
