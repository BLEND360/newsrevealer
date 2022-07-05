import { Button, ButtonProps } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const TransitionedButton = styled(Button)<ButtonProps>`
  transition: background-color 0.25s;
`;

export interface LoadingButtonProps extends ButtonProps {
  status: string;
  isSubmitting: boolean;
  isValid: boolean;
}

export default function LoadingButton({
  children,
  status,
  isSubmitting,
  isValid,
  variant,
  disabled,
  ...props
}: LoadingButtonProps) {
  const firstUpdate = useRef(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
    } else {
      if (!isSubmitting) {
        setHasLoaded(true);
        const id = setTimeout(() => {
          setHasLoaded(false);
        }, 1500);
        return () => clearTimeout(id);
      }
    }
  }, [isSubmitting]);

  return (
    <TransitionedButton
      type="submit"
      disabled={isSubmitting || disabled}
      {...props}
      variant={
        hasLoaded && !isSubmitting
          ? status === "success" && isValid
            ? "success"
            : "danger"
          : variant
      }
    >
      {isSubmitting ? (
        "Loading"
      ) : hasLoaded ? (
        <FontAwesomeIcon
          icon={status === "success" && isValid ? faCheck : faTimes}
        />
      ) : (
        children
      )}
    </TransitionedButton>
  );
}
