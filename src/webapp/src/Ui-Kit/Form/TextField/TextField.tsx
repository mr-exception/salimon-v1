import React, { CSSProperties } from "react";
import Styles from "./styles.module.css";
interface ITextFieldProps {
  value?: string;
  onChange: (value: string) => void;
  label: string;
  placeHolder: string;
  onFocus?: () => void;
  onBlur?: () => void;
  max_lines?: number;
  styles?: CSSProperties;
}

const TextField: React.FC<ITextFieldProps> = ({
  label,
  placeHolder,
  value,
  onChange,
  max_lines = 1,
  styles = {},
}: ITextFieldProps) => {
  if (max_lines === 1) {
    return (
      <div className="row" style={styles}>
        <div className="col-md-12 mb-2 capitalize">{label}</div>
        <div className="col-md-12 mb-2">
          <input
            type="text"
            placeholder={placeHolder}
            className={Styles.input}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
            }}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className="row" style={styles}>
        <div className="col-md-12 mb-2 capitalize">{label}</div>
        <div className="col-md-12 mb-2">
          <textarea
            placeholder={placeHolder}
            style={{ minHeight: max_lines * 18 }}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
            }}
          />
        </div>
      </div>
    );
  }
};

export default TextField;
