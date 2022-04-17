import React, { CSSProperties } from "react";
import Typography from "Ui-Kit/Typography/Typography";
interface IProps {
  style?: CSSProperties;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  type?: string;
  label?: string;
  error?: string;
}
const TextInput: React.FC<IProps> = ({
  style = {},
  value = "",
  onChange = (inputValue: string) => {
    console.debug(inputValue);
  },
  placeholder,
  label,
  error,
  type = "text",
}: IProps) => {
  return (
    <div className="row" style={style}>
      {label && (
        <div className="col-xs-12">
          <Typography variant="body1">{label}</Typography>
        </div>
      )}
      <div className="col-xs-12">
        <input
          className="rounded-sm my-2 w-full bg-base text-black p-1"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => {
            onChange(event.target.value as string);
          }}
        />
      </div>
    </div>
  );
};

export default TextInput;
