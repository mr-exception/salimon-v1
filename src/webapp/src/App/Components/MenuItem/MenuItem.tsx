import React from "react";
import { IconType } from "react-icons/lib";
import Styles from "./styles.module.css";
interface IProps {
  IconComponent: IconType;
  onClick: () => void;
  caption: string;
  isActive: boolean;
}

const MenuItem: React.FC<IProps> = ({
  IconComponent,
  caption,
  onClick,
  isActive,
}: IProps) => {
  return (
    <div
      className={Styles.container + (isActive ? " " + Styles.active : "")}
      onClick={onClick}
    >
      <div className={Styles.icon}>
        <IconComponent size={45} />
      </div>
      <div className={Styles.caption}>{caption}</div>
    </div>
  );
};

export default MenuItem;
