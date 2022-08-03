import { Card, Col, Row } from "react-bootstrap";
import { GenerateResult } from "../lib/types";
import ResultCard from "./ResultCard";

export interface ResultsProps {
  results: GenerateResult;
  model: string;
}

export default function Results({ results, model }: ResultsProps) {
  return (
    <Row>
      <Col xs={12} md={4}>
        <ResultCard
          height="36rem"
          title="Article Text"
          body={results.article_body}
        />
      </Col>
      <Col xs={12} md={8}>
        {Object.keys(results.sentences_dt).map(
          (value) =>
            results.sentences_dt[value] && (
              <Row key={value}>
                <Col xs={12} sm={6}>
                  <ResultCard
                    height="16rem"
                    title={`${value.replace(/^./, (x) =>
                      x.toUpperCase()
                    )} Classified Text`}
                    body={results.sentences_dt?.[value]}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <ResultCard
                    height="16rem"
                    title={`${value.replace(/^./, (x) =>
                      x.toUpperCase()
                    )} Summary`}
                    body={
                      model === "short"
                        ? results.output_dt?.[value]
                        : model === "long"
                        ? results.output_dt?.[value] +
                          "\n\n" +
                          results.long_summary_dt?.[value]
                        : model === "bot"
                        ? results.bot_dt?.[value]
                        : ""
                    }
                    metrics={results.metrics_dt?.[value]}
                  >
                    {model === "short" && (
                      <Card.Text>{results.output_dt?.[value]}</Card.Text>
                    )}
                    {model === "long" && (
                      <>
                        <Card.Text>
                          <strong>{results.output_dt?.[value]}</strong>
                        </Card.Text>
                        <Card.Text>
                          {results.long_summary_dt?.[value]}
                        </Card.Text>
                      </>
                    )}
                    {model === "bot" && (
                      <Card.Text>{results.bot_dt?.[value]}</Card.Text>
                    )}
                  </ResultCard>
                </Col>
              </Row>
            )
        )}
      </Col>
    </Row>
  );
}
