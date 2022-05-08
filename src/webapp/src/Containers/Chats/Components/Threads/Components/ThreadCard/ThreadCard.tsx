import React from "react";
import { FaTrash } from "react-icons/fa";
import { IThread } from "datamodels/thread";
import { IRecord } from "Utils/storage";
interface IProps {
  thread: IRecord<IThread>;
  onSelected: () => void;
}
const ThreadCard: React.FC<IProps> = ({ thread, onSelected }) => {
  return (
    <div
      className={
        "col-xs-12 cursor-pointer rounded-md hover:bg-secondary transition-all"
      }
      onClick={onSelected}
    >
      <div className="row">
        <div className="col-xs-10">
          <div className="row">
            <div className="overflow-hidden text-lg font-bold col-xs-12 overflow-ellipsis whitespace-nowrap">
              {thread.value.name}
            </div>
            <div className="col-xs-12">Hey! how you doin?</div>
          </div>
        </div>
        <div className="col-xs-2">
          <div className="row">
            <div className="flex justify-center mt-2 col-xs-12">
              <FaTrash
                className="cursor-pointer text-warning"
                onClick={() => {
                  // showModal(<RemoveContactModal id={id} close={closeModal} />, "sm");
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-1 my-2 bg-secondary opacity-30" />
    </div>
  );
};

export default ThreadCard;
