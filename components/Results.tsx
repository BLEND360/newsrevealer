import { Card, Col, Row } from "react-bootstrap";
import styles from "../styles/Results.module.css";
import { GenerateResult } from "../lib/types";

export interface ResultsProps {
  results: GenerateResult;
  model: string;
}

export default function Results({ results, model }: ResultsProps) {
  return (
    <Row>
      <Col xs={12} md={4}>
        <Card className="mb-3">
          <Card.Header>
            <Card.Title>Article Text</Card.Title>
          </Card.Header>
          <Card.Body className={styles.articleText}>
            <Card.Text>{results.article_body}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={12} md={8}>
        {Object.keys(results.sentences_dt).map(
          (value) =>
            results.sentences_dt[value] && (
              <Row key={value}>
                <Col xs={12} sm={6}>
                  <Card className="mb-3">
                    <Card.Header>
                      <Card.Title>
                        {value.replace(/^./, (x) => x.toUpperCase())} Classified
                        Text
                      </Card.Title>
                    </Card.Header>
                    <Card.Body className={styles.topicText}>
                      <Card.Text>{results.sentences_dt?.[value]}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card className="mb-3">
                    <Card.Header>
                      <Card.Title>
                        {value.replace(/^./, (x) => x.toUpperCase())} Summary
                      </Card.Title>
                    </Card.Header>
                    <Card.Body className={styles.topicText}>
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
                      {model === "parrot" && (
                        <Card.Text>{results.parrot_dt?.[value]}</Card.Text>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )
        )}
      </Col>
    </Row>
  );
}
