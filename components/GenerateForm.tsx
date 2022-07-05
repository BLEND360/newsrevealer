import { Formik } from "formik";
import * as yup from "yup";
import { Button, Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
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
import { GenerateRequest } from "../lib/types";
import { ResultsProps } from "./Results";
import { useState } from "react";

export interface GenerateFormProps {
  domains: string[];
  endpoint: string;
  status: string;
  onResultsChange: (results: ResultsProps | null) => void;
  onStatusChange: (status: string) => void;
  onMessageChange: (message: string | null) => void;
}

export default function GenerateForm({
  endpoint,
  domains,
  status,
  onResultsChange,
  onMessageChange,
  onStatusChange,
}: GenerateFormProps) {
  const { data } = useSWR("/api/topics", client<{ key: string }[]>("json"));

  const [copyPaste, setCopyPaste] = useState<boolean | null>(null);

  async function handleSubmit(values: GenerateRequest) {
    onStatusChange("loading");
    onMessageChange(null);
    try {
      onStatusChange("success");
      const res = await getSummaries(values, endpoint);
      if ("errorMessage" in res) {
        onMessageChange(res.errorMessage);
        onStatusChange("error");
      } else {
        onResultsChange({
          model: values.model,
          results: res,
        });
      }
    } catch (error) {
      onStatusChange("error");
      console.log(error);
    }
    await client("POST", 204)("/api/topics", values.topics);
  }

  return (
    <div className="bg-light rounded-3 p-4 mb-4">
      <Formik
        initialValues={{
          topics: [],
          model: "short",
          confidence: 0.6,
          use_dgx: false,
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
            use_dgx: yup.boolean().required(),
          })
        )}
      >
        {({
          handleSubmit,
          isSubmitting,
          isValid,
          resetForm,
          setFieldValue,
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Row>
              <Col xs={12} md={6} lg={8}>
                {copyPaste === null ? (
                  <>
                    <Form.Group controlId="domain" className="mb-3">
                      <Form.Label>Domain</Form.Label>
                      <Select
                        className="w-100"
                        options={domains.map((x) => ({ value: x, label: x }))}
                        onChange={() => {
                          setFieldValue("url", "");
                          setCopyPaste(false);
                        }}
                        value={null}
                        id="domain"
                      />
                    </Form.Group>
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
                    data
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
                  isSubmitting={isSubmitting}
                  isValid={isValid}
                  className="w-100"
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
