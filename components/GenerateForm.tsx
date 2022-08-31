import { Formik } from "formik";
import { pick } from "ramda";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import * as yup from "yup";

import { client, getSummaries, getTopics } from "../lib/client/client";
import models from "../lib/models";
import {
  GenerateError,
  GenerateRequest,
  GenerateResponse,
  GenerateResult,
  TopicScanRequest,
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

export interface GenerateFormProps {
  domains: string[];
  status: string;
  onResultsChange: (results: ResultsProps | null) => void;
  onStatusChange: (status: string) => void;
  onMessageChange: (message: string | null) => void;
  onSubmit: () => void;
}

export default function GenerateForm({
  domains,
  status,
  onResultsChange,
  onMessageChange,
  onStatusChange,
  onSubmit,
}: GenerateFormProps) {
  const [copyPaste, setCopyPaste] = useState<boolean | null>(null);
  const [generateResponse, setGenerateResponse] = useState<
    (GenerateResponse & { model: string }) | GenerateResponse | null
  >(null);
  const [isScanned, setIsScanned] = useState(false);
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [topicTextMap, setTopicTextMap] = useState<
    { [topic: string]: string } | undefined
  >(void 0);

  useEffect(() => {
    if (generateResponse) {
      const id = setInterval(async () => {
        try {
          const res = await client<{
            status: "PENDING" | "DONE";
            result?: GenerateResult | GenerateError;
          }>("json")(
            `/api/generate-results?bucket=${generateResponse.bucket}&key=${generateResponse.key}`
          );
          if (res.status === "DONE") {
            if ("errorMessage" in res.result!) {
              onMessageChange(res.result.errorMessage);
              onStatusChange("error");
            } else {
              if ("topic_text" in res.result!) {
                setAvailableTopics(Object.keys(res.result!.topic_text!));
                setTopicTextMap(res.result!.topic_text!);
                onResultsChange({
                  results: res.result!,
                  articleTextOnly: true,
                });
                onStatusChange("success");
              } else {
                onResultsChange({
                  model: (
                    generateResponse as GenerateResponse & {
                      model: string;
                    }
                  ).model,
                  results: res.result!,
                });
                onStatusChange("success");
              }
            }
            setGenerateResponse(null);
          }
        } catch (error) {
          onStatusChange("error");
          console.log(error);
          setGenerateResponse(null);
        }
      }, 2000);
      const timeoutId = setTimeout(() => {
        setGenerateResponse(null);
        onMessageChange("Request timed out.");
        onStatusChange("error");
      }, 180000);
      return () => {
        clearTimeout(timeoutId);
        clearInterval(id);
      };
    }
  }, [onMessageChange, onResultsChange, onStatusChange, generateResponse]);

  useEffect(() => {
    if (availableTopics && availableTopics.length > 0) {
      onStatusChange("");
    }
  }, [availableTopics, onStatusChange]);

  async function handleSubmit(values: GenerateRequest | TopicScanRequest) {
    onSubmit();
    onStatusChange("loading");
    if (availableTopics && availableTopics.length > 0) {
      onMessageChange(null);
      const { model, url } = values as GenerateRequest;
      try {
        const res = await getSummaries({
          model,
          topic_dict: pick((values as any).topics, topicTextMap),
          url,
        });
        setGenerateResponse({
          ...res,
          model: (values as GenerateRequest).model,
        });
      } catch (error) {
        onStatusChange("error");
        console.log(error);
      }
    } else {
      const res = await getTopics({
        ...(values as TopicScanRequest),
        ...{ get_topics: true },
      });
      setGenerateResponse(res);
      setIsScanned(true);
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
        {({ handleSubmit, isValid, resetForm, setFieldValue }) => (
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
                    availableTopics?.map((key) => ({
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
                  className="w-100"
                >
                  {isScanned ? "Generate" : "Scan"}
                </TimerButton>
              </Col>
              <Col xs="auto">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setCopyPaste(null);
                    resetForm();
                    onResultsChange(null);
                    setIsScanned(false);
                    setAvailableTopics([]);
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
