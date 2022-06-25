import { createContext, useState } from "react";
import Styles from "./styles.module.css";

type ModalSize = "sm" | "md" | "lg";

export interface IModalContext {
  show: boolean;
  showModal: (modal: any, size?: ModalSize) => void;
  closeModal: () => void;

  size: ModalSize;
  children?: any;
}

export const ModalsContext = createContext<IModalContext>({
  show: false,
  showModal: () => {},
  closeModal: () => {},
  size: "md",
});
const sizeClasses = {
  sm: "col-lg-3 col-md-4 col-sm-6",
  md: "col-lg-6 col-md-8 col-sm-10",
  lg: "col-lg-8 col-md-10 col-sm-10",
};

export const ModalsContextProvider: React.FC<{ children: any }> = ({
  children,
}) => {
  const [show, setShow] = useState<boolean>(false);
  const [modalComponent, setModalComponent] = useState<any>(undefined);
  const [size, setSize] = useState<ModalSize>("md");

  function showModal(modal: any, suggestedSize: ModalSize = "md"): void {
    setModalComponent(modal);
    setShow(true);
    setSize(suggestedSize);
  }
  function closeModal(): void {
    setModalComponent(undefined);
    setShow(false);
    setSize("md");
  }

  let sizeClass = sizeClasses[size];

  return (
    <ModalsContext.Provider
      value={{ show, showModal, closeModal, children: modalComponent, size }}
    >
      {children}
      {show && (
        <div className={Styles.overlay + " col-12"} onClick={closeModal}>
          <div
            className={Styles.modalContainer + " " + sizeClass}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            {modalComponent}
          </div>
        </div>
      )}
    </ModalsContext.Provider>
  );
};
