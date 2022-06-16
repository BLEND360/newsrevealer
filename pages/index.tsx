import { Formik } from "formik";
import * as yup from "yup";
import { Form, Row, Col, Container, Alert, Modal } from "react-bootstrap";
import FormGroup from "../components/FormGroup";
import FormTextArea from "../components/FormTextArea";
import {
  FormMultiSelect,
  FormMultiSelectProps,
  FormSelect,
  FormSelectProps,
} from "../components/FormSelect";
import topics from "../lib/topics";
import { useEffect, useState } from "react";
import LoadingButton from "../components/LoadingButton";
import { getSummaries } from "../lib/client";
import Results, { ResultsProps } from "../components/Results";
import { GenerateRequest } from "../lib/types";
import models from "../lib/models";
import FormRange from "../components/FormRange";
import { GetStaticProps } from "next";
import Select from "react-select";
import { getConfig } from "../lib/s3";
import FormCheck from "../components/FormCheck";

interface IndexProps {
  warning: {
    warningText?: string;
    warningHeading?: string;
  } | null;
  domains: string[];
  endpoint: string;
}

export default function Index({ warning, domains, endpoint }: IndexProps) {
  const [status, setStatus] = useState("ready");
  const [message, setMessage] = useState<string | null>(null);
  const [results, setResults] = useState<ResultsProps | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showDomains, setShowDomains] = useState(true);

  useEffect(() => {
    setShowAlert(process.env.NEXT_PUBLIC_STAGE !== "stable");
  }, []);

  async function handleSubmit(values: GenerateRequest) {
    setStatus("loading");
    setMessage(null);
    try {
      setStatus("success");
      const res = await getSummaries(values, endpoint);
      if ("errorMessage" in res) {
        setMessage(res.errorMessage);
        setStatus("error");
      } else {
        setResults({
          model: values.model,
          results: res,
        });
      }
    } catch (error) {
      setStatus("error");
      console.log(error);
    }
  }

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
      <div className="bg-light rounded-3 p-4 mb-4">
        <Formik
          initialValues={{
            url: "",
            topics: [],
            model: "parrot",
            confidence: 0.6,
            use_dgx: true,
          }}
          onSubmit={handleSubmit}
          validationSchema={yup.object({
            url: yup.string().required(),
            topics: yup.array().of(yup.string()).max(3),
            model: yup.string().required(),
            confidence: yup.number().min(0).max(1).required(),
            use_dgx: yup.boolean().required(),
          })}
        >
          {({ handleSubmit, isSubmitting, isValid }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Row>
                <Col xs={12} md={6} lg={8}>
                  {showDomains ? (
                    <Form.Group controlId="domain" className="mb-3">
                      <Form.Label>Domain</Form.Label>
                      <Select
                        className="w-100"
                        options={domains.map((x) => ({ value: x, label: x }))}
                        onChange={() => setShowDomains(false)}
                        value={null}
                        id="domain"
                      />
                    </Form.Group>
                  ) : (
                    <FormGroup
                      name="url"
                      as={FormTextArea}
                      label="News URL"
                      {...{ rows: "7" }} // cheating to get around react-bootstrap's bad type definitions
                    />
                  )}
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <FormGroup<
                    FormMultiSelectProps<
                      { value: string; label: string },
                      string
                    >
                  >
                    name="topics"
                    as={FormMultiSelect}
                    label="Topics"
                    getOption={(x) => ({
                      value: x,
                      label: topics[x].label,
                    })}
                    options={Object.entries(topics).map(
                      ([value, { label }]) => ({
                        value,
                        label,
                      })
                    )}
                  />
                  <FormGroup<
                    FormSelectProps<{ value: string; label: string }, string>
                  >
                    name="model"
                    as={FormSelect}
                    label="Model"
                    getOption={(x) =>
                      x
                        ? {
                            value: x,
                            label: models[x].label,
                          }
                        : null
                    }
                    options={Object.entries(models).map(
                      ([value, { label }]) => ({
                        value,
                        label,
                      })
                    )}
                  />
                  <FormGroup
                    label="Confidence Threshold"
                    name="confidence"
                    as={FormRange}
                    formatValue={(x: string) =>
                      Math.round(parseFloat(x) * 100) + "%"
                    }
                    min="0"
                    max="1"
                    step="0.01"
                  />
                  <FormCheck name="use_dgx" label="Use DGX" />
                </Col>
              </Row>
              <LoadingButton
                status={status}
                isSubmitting={isSubmitting}
                isValid={isValid}
                className="w-100"
              >
                Generate
              </LoadingButton>
            </Form>
          )}
        </Formik>
      </div>
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
  const endpoints = await getConfig("endpoints.json");

  return {
    props: {
      warning: warnings[process.env.NEXT_PUBLIC_STAGE] ?? null,
      domains,
      endpoint: endpoints[process.env.NEXT_PUBLIC_STAGE],
    },
    revalidate: 3600,
  };
};
