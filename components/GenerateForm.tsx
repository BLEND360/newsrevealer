import { Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import * as yup from "yup";
import { client, getSummaries, getTopics } from "../lib/client/client";
import models from "../lib/models";
import {
  AsyncResponse,
  GenerateRequest,
  GenerateResult,
  ResponseError,
  TopicScanRequest,
  TopicScanResult,
} from "../lib/types";
import DomainsButton from "./DomainsButton";
import FormGroup from "./FormGroup";
import FormRange from "./FormRange";
import {
  FormMultiCreatableSelect,
  FormMultiCreatableSelectProps,
  FormSelect,
  FormSelectProps,
} from "./FormSelect";
import FormTextArea from "./FormTextArea";
import { ResultsProps } from "./Results";
import TimerButton from "./TimerButton";
import { pick } from "../lib/utils";

export interface GenerateFormProps {
  domains: string[];
  status: string;
  onResultsChange: (results: ResultsProps | null) => void;
  onStatusChange: (status: string) => void;
  onMessageChange: (message: string | null) => void;
  onSubmit: () => void;
  results: ResultsProps | null;
}

export default function GenerateForm({
  domains,
  status,
  results,
  onResultsChange,
  onMessageChange,
  onStatusChange,
  onSubmit,
}: GenerateFormProps) {
  const [copyPaste, setCopyPaste] = useState<boolean | null>(null);
  const [response, setResponse] = useState<AsyncResponse | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const mustGenerate = useRef<{ url?: string; text?: string } | null>(null);

  useEffect(() => {
    if (response) {
      const id = setInterval(async () => {
        try {
          const res = await client<{
            status: "PENDING" | "DONE";
            result?: GenerateResult | TopicScanResult | ResponseError;
          }>("json")(
            `/api/generate-results?bucket=${response.bucket}&key=${response.key}`
          );
          if (res.status === "DONE") {
            if ("errorMessage" in res.result!) {
              onMessageChange(res.result.errorMessage);
              onStatusChange("error");
            } else {
              onResultsChange({
                results: { ...results?.results, ...res.result! },
                model,
                topics,
              });
              if (
                mustGenerate.current &&
                model &&
                "article_body" in res.result!
              ) {
                const r = await getSummaries({
                  model: model,
                  text: mustGenerate.current.text,
                  url: mustGenerate.current.url,
                  topic_dict: { all: res.result!.article_body },
                });
                setResponse(r);
                mustGenerate.current = null;
                return;
              }
              onStatusChange("success");
            }
            setResponse(null);
          }
        } catch (error) {
          onStatusChange("error");
          console.log(error);
          setResponse(null);
        }
      }, 2000);
      const timeoutId = setTimeout(() => {
        setResponse(null);
        onMessageChange("Request timed out.");
        onStatusChange("error");
      }, 180000);
      return () => {
        clearTimeout(timeoutId);
        clearInterval(id);
      };
    }
  }, [
    model,
    onMessageChange,
    onResultsChange,
    onStatusChange,
    response,
    results?.results,
    topics,
  ]);

  async function handleSubmit(
    values: Partial<GenerateRequest & TopicScanRequest> & { topics: string[] }
  ) {
    onStatusChange("loading");
    onMessageChange(null);
    try {
      if (results?.results?.article_body && values.model) {
        const res = await getSummaries({
          model: values.model,
          text: values.text,
          url: values.url,
          topic_dict:
            values.topics.length === 0
              ? { all: results?.results?.article_body! }
              : pick(results.results.topic_text, values.topics),
        });
        setResponse(res);
        setModel(values.model);
        setTopics(values.topics.length === 0 ? ["all"] : values.topics);
      } else {
        mustGenerate.current = { url: values.url, text: values.text };
        const res = await getTopics({ ...values, get_topics: false });
        setResponse(res);
        setModel(values.model ?? null);
        setTopics(["all"]);
      }
    } catch (error) {
      onStatusChange("error");
      console.log(error);
    }
  }

  async function handleScan(
    values: Partial<GenerateRequest & TopicScanRequest>
  ) {
    onSubmit();
    onStatusChange("loading");
    onMessageChange(null);
    try {
      const res = await getTopics({ ...values, get_topics: true });
      setResponse(res);
    } catch (error) {
      onStatusChange("error");
      console.log(error);
    }
  }

  return (
    <div className="bg-light rounded-3 p-4 mb-4">
      <Formik
        initialValues={{
          get_topics: true,
          topics: [],
          model: "short",
          confidence: 0.6,
        }}
        onSubmit={handleSubmit}
        validationSchema={yup.lazy((values) =>
          yup.object({
            url:
              values.url || values.text
                ? yup.string()
                : yup.string().required("This is a required field"),
            text:
              values.url || values.text
                ? yup.string()
                : yup.string().required("This is a required field"),
            topics: yup
              .array()
              .of(yup.string())
              .max(3, "You can only select 3 topics"),
            model: yup.string().required(),
            confidence: yup.number().min(0).max(1).required(),
          })
        )}
      >
        {({ handleSubmit, isValid, resetForm, setFieldValue, values }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Row>
              <Col xs={12} md={6} lg={8}>
                {copyPaste === null ? (
                  <>
                    <Row>
                      <Col>
                        <Button
                          variant="outline-secondary"
                          onClick={() => {
                            setFieldValue("url", "");
                            setCopyPaste(false);
                          }}
                          className="w-100 mb-3"
                        >
                          Enter Article URL
                        </Button>
                      </Col>
                      <Col xs="auto">
                        <DomainsButton domains={domains} />
                      </Col>
                    </Row>
                    <p className="text-center text-muted">or</p>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setFieldValue("text", "");
                        setCopyPaste(true);
                      }}
                      className="w-100"
                    >
                      Copy/Paste Article
                    </Button>
                  </>
                ) : (
                  <FormGroup
                    name={copyPaste ? "text" : "url"}
                    as={FormTextArea}
                    label={copyPaste ? "Copy/Paste Article" : "News URL"}
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
                    results?.results?.topic_text
                      ? Object.keys(results.results.topic_text).map((key) => ({
                          value: key,
                          label: key,
                        }))
                      : []
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
                  options={Object.entries(models).map(([value, { label }]) => ({
                    value,
                    label,
                  }))}
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
            <Row>
              <Col>
                <TimerButton
                  status={status}
                  isSubmitting={status === "loading"}
                  isValid={isValid}
                  onClick={() => handleScan(values)}
                >
                  Scan
                </TimerButton>
              </Col>
              <Col>
                <TimerButton
                  disabled={status === "loading"}
                  status={status}
                  isSubmitting={status === "loading"}
                  isValid={isValid}
                  type="submit"
                >
                  Generate
                </TimerButton>
              </Col>
              <Col xs="auto">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setCopyPaste(null);
                    resetForm();
                    onResultsChange(null);
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
  );
}
