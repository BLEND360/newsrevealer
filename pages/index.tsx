import { Container, Alert, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import Results, { ResultsProps } from "../components/Results";
import { GetStaticProps } from "next";
import { getConfig } from "../lib/server/s3";
import GenerateForm from "../components/GenerateForm";

interface IndexProps {
  warning: {
    warningText?: string;
    warningHeading?: string;
  } | null;
  domains: string[];
}

export default function Index({ warning, domains }: IndexProps) {
  const [status, setStatus] = useState("ready");
  const [message, setMessage] = useState<string | null>(null);
  const [results, setResults] = useState<ResultsProps | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setShowAlert(process.env.NEXT_PUBLIC_STAGE !== "stable");
  }, []);

  return (
    <Container>
      <Alert
        variant="danger"
        show={status === "error"}
        dismissible
        onClose={() => setStatus("ready")}
      >
        {message ?? "An unknown error occurred"}
      </Alert>
      <GenerateForm
        domains={domains}
        status={status}
        onMessageChange={setMessage}
        onResultsChange={setResults}
        onStatusChange={setStatus}
      />
      {results && <Results {...results} />}
      <Modal show={showAlert} onHide={() => setShowAlert(false)}>
        <Alert
          variant="danger"
          className="mb-0"
          dismissible
          onClose={() => setShowAlert(false)}
        >
          <Alert.Heading>{warning?.warningHeading}</Alert.Heading>
          {warning?.warningText?.split("\n")?.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </Alert>
      </Modal>
    </Container>
  );
}

export const getStaticProps: GetStaticProps<IndexProps> = async () => {
  const warnings = await getConfig("warnings.json");
  const domains = await getConfig("domains.json");

  return {
    props: {
      warning: warnings[process.env.NEXT_PUBLIC_STAGE] ?? null,
      domains,
    },
    revalidate: 300,
  };
};
