import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { FaSearch } from "react-icons/fa";
import { useDebounce } from "use-debounce";
import { FaCircleXmark } from "react-icons/fa6";

const Search = () => {
  const [username, setUsername] = useState("");
  const [debouncedUsername] = useDebounce(username, 500); // Adjust debounce delay as needed
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    if (!debouncedUsername) {
      setUser(null); // Clear user if input is empty
      setErr(false);
      return;
    }

    const q = query(
      collection(db, "users"),
      where("displayName", "==", debouncedUsername)
    );

    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setErr(true);
        setUser(null);
      } else {
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
        });
        setErr(false);
      }
    } catch (err) {
      setErr(true);
    }
  };

  const handleSelect = async () => {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error("Error creating chat:", err);
    }

    setUser(null);
    setUsername("");
  };

  React.useEffect(() => {
    handleSearch();
    // eslint-disable-next-line
  }, [debouncedUsername]);

  return (
    <div className="search">
      <div className="searchForm">
        <FaSearch size={20} className="text-white" />
        <input
          type="text"
          placeholder="Find a user"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        {debouncedUsername && (
          <button onClick={() => setUsername("")}>
            <FaCircleXmark className="text-white/40 hover:text-white/80 transition" />
          </button>
        )}
      </div>
      {err && <span className="error">User not found!</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
