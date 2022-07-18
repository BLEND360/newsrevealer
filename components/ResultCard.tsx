import { Card } from "react-bootstrap";
import styled from "styled-components";
import { ReactNode } from "react";
import CopyButton from "./CopyButton";

const ResultCardBody = styled(Card.Body)<{ height: string }>`
  max-height: ${(props) => props.height};
  overflow: auto;
`;

export interface ResultCardProps {
  height: string;
  title: string;
  body: string;
  children?: ReactNode;
}

export default function ResultCard({
  height,
  title,
  body,
  children,
}: ResultCardProps) {
  return (
    <Card className="mb-3">
      <Card.Header className="d-flex align-items-center">
        <Card.Title className="flex-grow-1">{title}</Card.Title>
        <CopyButton text={body} />
      </Card.Header>
      <ResultCardBody height={height}>
        {children ?? <Card.Text>{body}</Card.Text>}
      </ResultCardBody>
    </Card>
  );
}
