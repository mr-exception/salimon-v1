import { AuthContext } from "AuthContextProvider";
import { useGetContact } from "DataContext/ContactsContextProvider";
import React, { useContext } from "react";
import { FaTrash } from "react-icons/fa";
import { IThread } from "Structs/Thread";
import { IRecord } from "Utils/storage";
interface IProps {
  thread: IRecord<IThread>;
  onSelected: () => void;
}
const ThreadCard: React.FC<IProps> = ({ thread, onSelected }) => {
  const { address } = useContext(AuthContext);
  // console.log(thread.value);
  // const contactsAddress = thread.value.members.find(
  //   (record) => record !== address
  // );
  // const contact = useGetContact(contactsAddress);

  // if (!contact) {
  //   return (
  //     <div
  //       className={
  //         "col-xs-12 cursor-pointer rounded-md hover:bg-secondary transition-all"
  //       }
  //       onClick={() => {}}
  //     >
  //       test
  //     </div>
  //   );
  // }
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
              {thread.value.universal_id}
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
