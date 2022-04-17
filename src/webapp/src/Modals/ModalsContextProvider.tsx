import { createContext, useState } from "react";

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

export const ModalsContextProvider: React.FC<{ children: any }> = ({ children }) => {
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
  return (
    <ModalsContext.Provider value={{ show, showModal, closeModal, children: modalComponent, size }}>
      {children}
    </ModalsContext.Provider>
  );
};
