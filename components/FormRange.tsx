import { FormRangeProps } from "react-bootstrap/FormRange";
import { Form } from "react-bootstrap";

export interface RangeProps extends FormRangeProps {
  formatValue?: (x: string) => string;
  value: string;
}

export default function FormRange({ formatValue, ...props }: RangeProps) {
  return (
    <div className="d-flex">
      <Form.Range {...props} />
      <span className="ms-2">
        {formatValue ? formatValue(props.value) : props.value}
      </span>
    </div>
  );
}
