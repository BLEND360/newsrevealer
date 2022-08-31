import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpellCheck } from "@fortawesome/free-solid-svg-icons";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useEffect, useState } from "react";
import { client } from "../lib/client/client";
import {
  GrammarCheckResult,
  GrammarCheckError,
  GenerateResponse,
  GrammarCheckRequest,
} from "../lib/types";

export interface GrammarCheckButtonProps {
  onCorrection: (text: string[]) => void;
  text: string[];
}

export default function GrammarCheckButton({
  onCorrection,
  text,
}: GrammarCheckButtonProps) {
  const [tooltip, setTooltip] = useState("Check Grammar");
  const [disabled, setDisabled] = useState(false);
  const [response, setResponse] = useState<null | GenerateResponse>(null);

  useEffect(() => {
    setTooltip("Check Grammar");
  }, [text]);

  useEffect(() => {
    if (response) {
      const id = setInterval(async () => {
        try {
          const res = await client<{
            status: "PENDING" | "DONE";
            result?: GrammarCheckResult | GrammarCheckError;
          }>("json")(
            `/api/generate-results?bucket=${response.bucket}&key=${response.key}`
          );
          if (res.status === "DONE") {
            if ("errorMessage" in res.result!) {
              setTooltip("Completed but had an error");
            } else {
              setTooltip("Check Grammar");
              setDisabled(false);
              onCorrection(res.result!.corrected_text_list);
            }
            setResponse(null);
          }
        } catch (e) {
          setTooltip("Errored");
          console.log(e);
          setResponse(null);
        }
      }, 2000);

      const timeoutId = setTimeout(() => {
        setResponse(null);
        setTooltip("Request timed out.");
      }, 60000);
      return () => {
        clearTimeout(timeoutId);
        clearInterval(id);
      };
    }
  }, [response, onCorrection]);

  return (
    <OverlayTrigger overlay={<Tooltip id="copy-tooltip">{tooltip}</Tooltip>}>
      <Button
        className="float-end"
        variant="outline-secondary"
        disabled={disabled}
        onClick={async () => {
          setTooltip("Sent!");
          setDisabled(true);
          try {
            const body: GrammarCheckRequest = { text_list: text };
            const res = await client<GenerateResponse>(
              "json",
              "POST",
              202
            )("/api/grammar-check", body);
            setResponse(res);
          } catch (e) {
            setTooltip("Errored");
            console.log(e);
            setResponse(null);
          }
        }}
      >
        <FontAwesomeIcon icon={faSpellCheck} />
      </Button>
    </OverlayTrigger>
  );
}
