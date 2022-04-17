import { AuthContext } from "AuthContextProvider";
import { useContext } from "react";
import AddressCard from "./Sections/AddressCard";
import PasswordCard from "./Sections/PasswordCard";
const Setting = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return (
      <div className="col-xs-12">
        <div className="row justify-center">
          <div className="col-xs-6 bg-secondary mt-4 rounded-md">
            <div className="row my-4">
              <div className="col-xs-12">you don't have any local profile registered</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="col-xs-12">
      <AddressCard address={authContext.address} setAddress={authContext.setAddress} />
      <PasswordCard
        updatePassword={(value) => {
          if (value) authContext.setPassword(value);
          else authContext.setPassword("N/A");
        }}
      />
    </div>
  );
};

export default Setting;
