import { IContact } from "Structs/Contact";
import { IRecord } from "Utils/storage";
import Styles from "./styles.module.css";

interface IProps {
  contact: IRecord<IContact>;
  onSelected: () => void;
  isSelected: boolean;
}
const ContactCard: React.FC<IProps> = ({
  contact: { value: contact },
  onSelected,
  isSelected,
}) => {
  return (
    <div className="col-xs-12 flex" onClick={onSelected}>
      <div
        className={`${Styles.container} ${isSelected ? Styles.selected : ""}`}
      >
        <div className="row">
          <div className="col-xs-8 text-xl">{contact.name}</div>
          <div className="col-xs-12 overflow-ellipsis overflow-hidden whitespace-nowrap break-words">
            {contact.address}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
