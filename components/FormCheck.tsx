import { Form, FormCheckProps } from "react-bootstrap";
import { Field, useFormikContext, getIn } from "formik";

interface FieldCheckProps extends FormCheckProps {
  name: string;
}

export default function FormCheck(props: FieldCheckProps) {
  const { errors } = useFormikContext();

  return (
    <Field
      type="checkbox"
      as={Form.Check}
      className="mb-3"
      isInvalid={!!getIn(errors, props.name)}
      feedback={getIn(errors, props.name)}
      id={props.name}
      {...props}
    />
  );
}
