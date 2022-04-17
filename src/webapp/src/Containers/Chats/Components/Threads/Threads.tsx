import { ThreadsContext } from "DataContext/ThreadsContextProvider";
import { ModalsContext } from "Modals/ModalsContextProvider";
import { useContext } from "react";
import { FaPlus } from "react-icons/fa";
import Button from "Ui-Kit/Button/Button";
import CreateThreadModal from "./Components/CreateThreadModal/CreateThreadModal";
import ThreadCard from "./Components/ThreadCard/ThreadCard";
import Styles from "./styles.module.css";
const Threads = () => {
  const { showModal, closeModal } = useContext(ModalsContext);
  const { threads, setActiveThread } = useContext(ThreadsContext);
  return (
    <div className={Styles.contactList}>
      <div className="col-xs-12 flex justify-end items-center p-2">
        <Button
          className="w-full flex justify-center items-center"
          size="md"
          onClick={() => {
            showModal(<CreateThreadModal close={closeModal} />, "sm");
          }}
        >
          <FaPlus />
        </Button>
      </div>
      {threads.map((thread) => (
        <ThreadCard
          key={thread.id.toString()}
          thread={thread}
          onSelected={() => {
            setActiveThread(thread);
          }}
        />
      ))}
    </div>
  );
};

export default Threads;
