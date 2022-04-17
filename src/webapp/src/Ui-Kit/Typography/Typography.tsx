import React, { CSSProperties } from "react";
import Styles from "./styles.module.css";
type VariantType = "title1" | "title2" | "body1" | "body2";
interface IProps {
  children: any;
  variant: VariantType;
  style?: CSSProperties;
}
const Typography: React.FC<IProps> = ({ children, variant, style }: IProps) => {
  return (
    <label className={Styles[variant]} style={style}>
      {children}
    </label>
  );
};

export default Typography;
