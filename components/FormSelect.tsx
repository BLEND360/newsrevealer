import Select, { Props, GroupBase } from "react-select";
import CreatableSelect, { CreatableProps } from "react-select/creatable";
import { useFormikContext } from "formik";

export interface FormSelectProps<Option, Value>
  extends Omit<Props<Option, false>, "value"> {
  getFormValue?: (x: Option) => Value;
  getOption?: (x: Value | null) => Option | null;
  getOptionLabel?: (x: Option) => string;
  getOptionValue?: (x: Option) => string;
  options: readonly Option[];
  name: string;
  value: Value | null;
}

export function FormSelect<Option = unknown, Value = unknown>({
  name,
  value,
  getOptionValue = (x) => (x as { value?: unknown }).value as string,
  getFormValue = getOptionValue as unknown as (x: Option) => Value,
  options,
  getOption = (value) =>
    options.find(
      (option) => getOptionValue(option) === (value as unknown as string)
    ) ?? null,
  ...props
}: FormSelectProps<Option, Value>) {
  const formik = useFormikContext();

  function handleChange(item: Option | null) {
    formik.setFieldValue(name, item && getFormValue(item));
  }

  return (
    <Select
      {...props}
      options={options}
      id={name}
      className="w-100"
      getOptionValue={getOptionValue}
      value={getOption(value)}
      onChange={handleChange}
    />
  );
}

export interface FormMultiCreatableSelectProps<Option, Value>
  extends Omit<CreatableProps<Option, true, GroupBase<Option>>, "value"> {
  getFormValue?: (x: Option) => Value;
  getOption?: (x: Value) => Option;
  getOptionLabel?: (x: Option) => string;
  getOptionValue?: (x: Option) => string;
  options: readonly Option[];
  name: string;
  value: Value[];
}

export function FormMultiCreatableSelect<Option = unknown, Value = unknown>({
  name,
  value,
  getOptionValue = (x) => (x as { value?: unknown }).value as string,
  getFormValue = getOptionValue as unknown as (x: Option) => Value,
  options,
  getOption = (value) =>
    options.find(
      (option) => getOptionValue(option) === (value as unknown as string)
    ) as Option,
  ...props
}: FormMultiCreatableSelectProps<Option, Value>) {
  const formik = useFormikContext();

  function handleChange(item: readonly Option[]) {
    formik.setFieldValue(name, item.map(getFormValue));
  }

  return (
    <CreatableSelect
      {...props}
      options={options}
      isMulti
      id={name}
      className="w-100"
      getOptionValue={getOptionValue}
      value={value && value.map(getOption).filter((x) => x !== null)}
      onChange={handleChange}
    />
  );
}
