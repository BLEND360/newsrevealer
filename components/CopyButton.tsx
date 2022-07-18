import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useEffect, useState } from "react";

export interface CopyButtonProps {
  text: string;
}

export default function CopyButton({ text }: CopyButtonProps) {
  const [tooltip, setTooltip] = useState("Copy");

  useEffect(() => {
    setTooltip("Copy");
  }, [text]);

  return (
    <OverlayTrigger overlay={<Tooltip id="copy-tooltip">{tooltip}</Tooltip>}>
      <Button
        className="float-end"
        variant="outline-secondary"
        onClick={async () => {
          await navigator.clipboard.writeText(text);
          setTooltip("Copied!");
        }}
      >
        <FontAwesomeIcon icon={faCopy} />
      </Button>
    </OverlayTrigger>
  );
}
