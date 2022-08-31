import { Formik } from "formik";
import * as yup from "yup";
import {
  Button,
  Col,
  Form,
  OverlayTrigger,
  Popover,
  Row,
} from "react-bootstrap";
import FormGroup from "./FormGroup";
import FormTextArea from "./FormTextArea";
import {
  FormMultiCreatableSelect,
  FormMultiCreatableSelectProps,
  FormSelect,
  FormSelectProps,
} from "./FormSelect";
import models from "../lib/models";
import FormRange from "./FormRange";
import TimerButton from "./TimerButton";
import useSWR from "swr";
import { client, getSummaries } from "../lib/client/client";
import {
  GenerateError,
  GenerateRequest,
  GenerateResponse,
  GenerateResult,
} from "../lib/types";
import { ResultsProps } from "./Results";
import { useEffect, useState } from "react";
import DomainsButton from "./DomainsButton";

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
  const [shouldFetch, setShouldFetch] = useState(false);
  const { data: availableTopics } = useSWR(shouldFetch ? "/api/topics" : null, client<{ key: string }[]>("json"));
  const [copyPaste, setCopyPaste] = useState<boolean | null>(null);
  const [generateResponse, setGenerateResponse] = useState<
    (GenerateResponse & { model: string }) | null
  >(null);
  const [isScanned, setIsScanned] = useState(false);

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
              onResultsChange({ model: generateResponse.model, results: res.result! });
              onStatusChange("success");
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
      onStatusChange('');
    }
  }, [availableTopics, onStatusChange]);

  async function handleSubmit(values: GenerateRequest) {
    onSubmit();
    onStatusChange("loading");
    if (availableTopics && availableTopics.length > 0) {
      onMessageChange(null);
      try {
        const res = await getSummaries(values);
        setGenerateResponse({...res, model: values.model });
      } catch (error) {
        onStatusChange('error');
        console.log(error);
      }
    } else {
      setShouldFetch(true);
      setIsScanned(true);
    }
  }

  return (
    <div className="bg-light rounded-3 p-4 mb-4">
      <Formik
        initialValues={{
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
                    availableTopics
                      ?.filter(({ key }) => key !== "all")
                      ?.map(({ key }) => ({
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
                  {isScanned ? 'Generate' : 'Scan'}
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
