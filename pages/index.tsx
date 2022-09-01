import { Container, Alert } from "react-bootstrap";
import { useState } from "react";
import Results, { ResultsProps } from "../components/Results";
import { GetStaticProps } from "next";
import { getConfig } from "../lib/server/s3";
import GenerateForm from "../components/GenerateForm";

interface IndexProps {
  domains: string[];
}

export default function Index({ domains }: IndexProps) {
  const [status, setStatus] = useState("ready");
  const [message, setMessage] = useState<string | null>(null);
  const [results, setResults] = useState<ResultsProps | null>(null);

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
        results={results}
        status={status}
        onMessageChange={setMessage}
        onResultsChange={setResults}
        onStatusChange={setStatus}
        onSubmit={() => setResults(null)}
      />
      {results && <Results {...results} />}
    </Container>
  );
}

export const getStaticProps: GetStaticProps<IndexProps> = async () => {
  const domains = await getConfig("domains.json");

  return {
    props: {
      domains,
    },
    revalidate: 300,
  };
};
