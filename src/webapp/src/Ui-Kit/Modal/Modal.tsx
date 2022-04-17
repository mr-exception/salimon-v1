import React from "react";
import Styles from "./styles.module.css";
const Modal: React.FC<IModalProps> = ({
  show,
  close,
  children,
}: IModalProps) => {
  if (!show) return null;
  return (
    <div className={Styles.overlay + " row"} onClick={close}>
      <div
        className={
          Styles.modalContainer + " col-md-6 col-lg-6 col-sm-8 col-md-12"
        }
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
