import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import Attach from "../img/attach.png";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt="User"
        />
        <span>just now</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>

        {message.file && (
          <div className="fileContent">
            {message.file.mimeType?.startsWith("image/") ? (
              <img
                src={message.file.url}
                alt={message.file.filename}
                className="messageImage"
              />
            ) : (
              <a
                href={message.file.url}
                download={message.file.filename}
                className="filePreview"
              >
                <span>{message.file.filename}</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
