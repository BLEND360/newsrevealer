import { Formik } from "formik";
import * as yup from "yup";
import {
  Form,
  Row,
  Col,
  Container,
  Alert,
  Modal,
  Button,
} from "react-bootstrap";
import FormGroup from "../components/FormGroup";
import FormTextArea from "../components/FormTextArea";
import {
  FormMultiCreatableSelect,
  FormMultiCreatableSelectProps,
  FormSelect,
  FormSelectProps,
} from "../components/FormSelect";
import { useEffect, useState } from "react";
import LoadingButton from "../components/LoadingButton";
import { client, getSummaries } from "../lib/client/client";
import Results, { ResultsProps } from "../components/Results";
import { GenerateRequest } from "../lib/types";
import models from "../lib/models";
import FormRange from "../components/FormRange";
import { GetStaticProps } from "next";
import Select from "react-select";
import { getConfig } from "../lib/server/s3";
import useSWR from "swr";
import FormCheck from "../components/FormCheck";

interface IndexProps {
  warning: {
    warningText?: string;
    warningHeading?: string;
  } | null;
  domains: string[];
}

export default function Index({ warning, domains }: IndexProps) {
  const { data } = useSWR("/api/topics", client<{ key: string }[]>("json"));

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
      const res = await getSummaries(values);
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
    await client("POST", 204)("/api/topics", values.topics);
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
            model: "short",
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
          {({ handleSubmit, isSubmitting, isValid, resetForm }) => (
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
                    FormMultiCreatableSelectProps<
                      { value: string; label: string },
                      string
                    >
                  >
                    name="topics"
                    as={FormMultiCreatableSelect}
                    label="Topics"
                    getOption={(x) => ({
                      value: x,
                      label: x,
                    })}
                    getNewOptionData={(x: string) => ({
                      value: x,
                      label: x,
                    })}
                    options={
                      data?.map(({ key }) => ({
                        value: key,
                        label: key,
                      })) ?? []
                    }
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
              <Row>
                <Col>
                  <LoadingButton
                    status={status}
                    isSubmitting={isSubmitting}
                    isValid={isValid}
                    className="w-100"
                  >
                    Generate
                  </LoadingButton>
                </Col>
                <Col xs="auto">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowDomains(true);
                      resetForm();
                      setResults(null);
                    }}
                  >
                    Clear State
                  </Button>
                </Col>
              </Row>
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

  return {
    props: {
      warning: warnings[process.env.NEXT_PUBLIC_STAGE] ?? null,
      domains,
    },
    revalidate: 3600,
  };
};
