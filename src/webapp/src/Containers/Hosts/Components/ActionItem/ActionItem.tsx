import React from "react";
import Styles from "./styles.module.css";
interface IProps {
  onClick: () => void;
  caption: string;
  icon: string;
}

const ActionItem: React.FC<IProps> = ({ onClick, icon, caption }: IProps) => {
  return (
    <div className="row">
      <div className="col-md-12">
        <div className={Styles.container} onClick={onClick}>
          <div className={Styles.icon}>
            <img src={icon} alt="icon" />
          </div>
          <div className={Styles.caption}>{caption}</div>
        </div>
      </div>
    </div>
  );
};

export default ActionItem;
