import { Card } from "react-bootstrap";
import styled from "styled-components";
import { ReactNode } from "react";
import CopyButton from "./CopyButton";

const FixedHeightCard = styled(Card)<{ height?: string; minheight?: string }>`
  height: ${(props) => props.height};
  min-height: ${(props) => props.minheight};
`;
const ResultCardBody = styled(Card.Body)`
  overflow: auto;
`;

export interface ResultCardProps {
  height?: string;
  minHeight?: string;
  title: string;
  body: string;
  children?: ReactNode;
  metrics?: { [key: string]: string };
}

export default function ResultCard({
  height,
  minHeight,
  title,
  body,
  children,
  metrics,
}: ResultCardProps) {
  return (
    <FixedHeightCard className="mb-3" height={height} minheight={minHeight}>
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
        <CopyButton text={body} />
      </Card.Header>
      <ResultCardBody>
        {children ?? <Card.Text>{body}</Card.Text>}
      </ResultCardBody>
    </FixedHeightCard>
  );
}
