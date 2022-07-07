import { Card, Col, Row } from "react-bootstrap";
import topics from "../lib/topics";
import { GenerateResult } from "../lib/types";
import styled from "styled-components";

const ArticleText = styled(Card.Body)`
  max-height: 36rem;
  overflow: auto;
`;
const TopicText = styled(Card.Body)`
  max-height: 16rem;
  overflow: auto;
`;

export interface ResultsProps {
  results: GenerateResult;
  model: string | null;
}

export default function Results({ results, model }: ResultsProps) {
  return (
    <Row>
      <Col xs={12} md={model ? 4 : 12}>
        <Card className="mb-3">
          <Card.Header>
            <Card.Title>Article Text</Card.Title>
          </Card.Header>
          <ArticleText>
            <Card.Text>{results.article_body}</Card.Text>
          </ArticleText>
        </Card>
      </Col>
      {model && (
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
                      <TopicText>
                        <Card.Text>{results.sentences_dt?.[value]}</Card.Text>
                      </TopicText>
                    </Card>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Card className="mb-3">
                      <Card.Header>
                        <Card.Title>{label} Summary</Card.Title>
                      </Card.Header>
                      <TopicText>
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
                      </TopicText>
                    </Card>
                  </Col>
                </Row>
              )
          )}
        </Col>
      )}
    </Row>
  );
}
