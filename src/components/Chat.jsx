import React, { useContext } from "react";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="chat">
      {data?.chatId !== "null" ? (
        <>
          <div className="chatInfo">
            <img src={data.user?.photoURL} alt="" />
            <span>{data.user?.displayName}</span>
          </div>
          <Messages />
          <Input />
        </>
      ) : (
        <div>
          <p>Select a chat to start a conversation</p>
        </div>
      )}
    </div>
  );
};

export default Chat;
