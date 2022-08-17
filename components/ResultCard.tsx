import { Card } from "react-bootstrap";
import styled from "styled-components";
import { ReactNode, useState } from "react";
import CopyButton from "./CopyButton";
import GrammarCheckButton from "./GrammarCheckButton";

const FixedHeightCard = styled(Card)<{ height?: string }>`
  height: ${(props) => props.height};
`;
const ResultCardBody = styled(Card.Body)`
  overflow: auto;
`;

export interface ResultCardProps {
  height?: string;
  title: string;
  body: string;
  headerBody?: string | null;
  metrics?: { [key: string]: string };
  showGrammarCheckButton?: boolean;
}

export default function ResultCard({
  height,
  title,
  body,
  metrics,
  headerBody,
  showGrammarCheckButton,
}: ResultCardProps) {
  const [correctedHeader, setCorrectedHeader] = useState<string | null>(null);
  const [correctedBody, setCorrectedBody] = useState<string | null>(null);
  const headerBodyPrefix = headerBody ? `${headerBody}\n\n` : "";
  const displayedBody = correctedBody ?? body;
  const displayedBodyAndHeader = `${headerBodyPrefix}${displayedBody}`;

  return (
    <FixedHeightCard className="mb-3" height={height}>
      <Card.Header className="d-flex align-items-center">
        <div className="flex-grow-1">
          <Card.Title>{title}</Card.Title>
          {metrics &&
            Object.entries(metrics).map(([metric, value]) => (
              <Card.Subtitle key={metric} className="mb-1">
                <strong>{metric}: </strong>
                {value}
              </Card.Subtitle>
            ))}
        </div>
        {showGrammarCheckButton && (
          <GrammarCheckButton
            text={headerBody ? [headerBody, body] : [body]}
            onCorrection={([header, body]) => {
              if (body) {
                setCorrectedHeader(header);
                setCorrectedBody(body);
              } else {
                setCorrectedBody(header);
              }
            }}
          />
        )}
        <CopyButton text={displayedBodyAndHeader} />
      </Card.Header>
      <ResultCardBody>
        {(correctedHeader ?? headerBody) && (
          <Card.Text>
            <strong>{correctedHeader ?? headerBody}</strong>
          </Card.Text>
        )}
        <Card.Text>{displayedBody}</Card.Text>
      </ResultCardBody>
    </FixedHeightCard>
  );
}
