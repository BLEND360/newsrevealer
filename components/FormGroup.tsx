import { Form, FormControlProps } from "react-bootstrap";
import { useField } from "formik";
import { ComponentType, ReactNode } from "react";

export type FormGroupProps<T> = Omit<
  T,
  "isInvalid" | "value" | "name" | "onChange" | "onBlur"
> & {
  label?: string;
  text?: string;
  as?: ComponentType<T>;
  children?: ReactNode;
  name: string;
};

export default function FormGroup<T = FormControlProps>({
  label,
  text,
  as: Component = Form.Control as ComponentType<T>,
  children,
  ...props
}: FormGroupProps<T>) {
  const [field, meta] = useField(props);

  return (
    <Form.Group controlId={field.name} className="mb-3">
      {label && <Form.Label>{label}</Form.Label>}
      <Component
        isInvalid={!!meta.error}
        {...field}
        {...(props as unknown as T)}
      >
        {children}
      </Component>
      {text && <Form.Text muted>{text}</Form.Text>}
      {typeof meta.error == "string" && (
        <Form.Control.Feedback type="invalid" className="d-block">
          {meta.error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
}
