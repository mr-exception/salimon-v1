import React, { useContext } from "react";
import { ModalsContext } from "./ModalsContextProvider";
import Styles from "./styles.module.css";

const sizeClasses = {
  sm: "col-lg-3 col-md-4 col-sm-6",
  md: "col-lg-6 col-md-8 col-sm-10",
  lg: "col-lg-8 col-md-10 col-sm-10",
};

const ModalContainer: React.FC = () => {
  const context = useContext(ModalsContext);
  let sizeClass = sizeClasses[context.size];
  if (!context.show) return null;
  return (
    <div className={Styles.overlay + " col-12"} onClick={context.closeModal}>
      <div
        className={Styles.modalContainer + " " + sizeClass}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {context.children}
      </div>
    </div>
  );
};

export default ModalContainer;
