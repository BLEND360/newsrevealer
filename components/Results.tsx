import { Card, Col, Row } from "react-bootstrap";
import topics from "../lib/topics";
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
        {Object.entries(topics).map(
          ([value, { label }]) =>
            results.sentences_dt[value] && (
              <Row key={value}>
                <Col xs={12} sm={6}>
                  <Card className="mb-3">
                    <Card.Header>
                      <Card.Title>{label} Classified Text</Card.Title>
                    </Card.Header>
                    <Card.Body className={styles.topicText}>
                      <Card.Text>{results.sentences_dt?.[value]}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card className="mb-3">
                    <Card.Header>
                      <Card.Title>{label} Summary</Card.Title>
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
