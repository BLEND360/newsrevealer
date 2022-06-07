import { Formik } from "formik";
import * as yup from "yup";
import { Form, Row, Col, Container, Alert } from "react-bootstrap";
import FormGroup from "../components/FormGroup";
import FormTextArea from "../components/FormTextArea";
import {
  FormMultiSelect,
  FormMultiSelectProps,
  FormSelect,
  FormSelectProps,
} from "../components/FormSelect";
import topics from "../lib/topics";
import { useState } from "react";
import LoadingButton from "../components/LoadingButton";
import { getSummaries } from "../lib/client";
import Results, { ResultsProps } from "../components/Results";
import { GenerateRequest } from "../lib/types";
import models from "../lib/models";
import FormRange from "../components/FormRange";

export default function Index() {
  const [status, setStatus] = useState("ready");
  const [message, setMessage] = useState<string | null>(null);
  const [results, setResults] = useState<ResultsProps | null>(null);

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
            confidence: 0,
          }}
          onSubmit={handleSubmit}
          validationSchema={yup.object({
            url: yup.string().required(),
            topics: yup.array().of(yup.string()).max(3),
            model: yup.string().required(),
            confidence: yup.number().min(0).max(1).required(),
          })}
        >
          {({ handleSubmit, isSubmitting, isValid }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Row>
                <Col xs={12} md={6} lg={8}>
                  <FormGroup
                    name="url"
                    as={FormTextArea}
                    label="News URL"
                    {...{ rows: "7" }} // cheating to get around react-bootstrap's bad type definitions
                  />
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
    </Container>
  );
}
