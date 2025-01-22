import { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { PiSignOutBold } from "react-icons/pi";
import { AuthContext } from "../context/AuthContext";

const Footer = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="footer">
      <div className="user">
        <div className="profile">
          <img src={currentUser.photoURL} alt="" />
          <span>{currentUser.displayName}</span>
        </div>
        <button onClick={() => signOut(auth)}>
          <PiSignOutBold className="text-white" size={20} />
        </button>
      </div>
    </div>
  );
};

export default Footer;
