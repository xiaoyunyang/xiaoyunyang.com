import React from "react";
import NumberFormat from "react-number-format";
import { TextField } from "@material-ui/core";
import Input from "@material-ui/core/Input";

interface NumberFormatCustomProps {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  rightAlign: boolean;
}
const NumberFormatCustom = (props: NumberFormatCustomProps) => {
  const {
    inputRef, onChange, rightAlign, ...other
  } = props;
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
      style={rightAlign ? { textAlign: "right" } : {}}
    />
  );
};
const DollarInput = ({
  value, id, className = "", onChange, rightAlign = false, label = undefined
}: {
  value: number; id: string; className: string;
  onChange: () => void;
  rightAlign: boolean;
  label: string | undefined;
}): JSX.Element => (
  <TextField
    id={id}
    label={label}
    className={className}
    value={value}
    onChange={onChange}
    InputProps={{
      inputComponent: NumberFormatCustom as any,
      inputProps: { rightAlign }
    }}
  />
);

export default DollarInput;
