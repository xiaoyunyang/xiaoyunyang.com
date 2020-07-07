import React from "react";
import NumberFormat from "react-number-format";
import { TextField } from "@material-ui/core";
import Input from "@material-ui/core/Input";

interface NumberFormatCustomProps {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}
const NumberFormatCustom = (props: NumberFormatCustomProps) => {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        });
      }}
      thousandSeparator
      isNumericString
      prefix="$"
      style={{ textAlign: "right" }}
    />
  );
};
const DollarInput = ({
  value, id, className, onChange
}) => (
  <TextField
    id={id}
    className={className}
    value={value}
    onChange={onChange}
    InputProps={{
      inputComponent: NumberFormatCustom as any
    }}
  />
);

export default DollarInput;
