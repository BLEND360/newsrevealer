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
  children?: ReactNode;
  metrics?: { [key: string]: string };
}

export default function ResultCard({
  height,
  title,
  body,
  children,
  metrics,
}: ResultCardProps) {
  const [correctedBody, setCorrectedBody] = useState<string | null>(null);
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
        <GrammarCheckButton text={body} onCorrection={t => setCorrectedBody(t)} />
        <CopyButton text={correctedBody ?? body} />
      </Card.Header>
      <ResultCardBody>
        {children ?? <Card.Text>{correctedBody ?? body}</Card.Text>}
      </ResultCardBody>
    </FixedHeightCard>
  );
}
