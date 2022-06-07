import { FormControl, FormControlProps } from "react-bootstrap";

export default function FormTextArea(props: FormControlProps) {
  return <FormControl as="textarea" {...props} />;
}
