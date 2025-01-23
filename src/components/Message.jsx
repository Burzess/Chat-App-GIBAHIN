import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { FaClock, FaFile } from "react-icons/fa6";
import { formatBytes, formatDate } from "../lib";

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
      className={`message ${
        message.senderId === currentUser.uid ? "owner" : ""
      }`}
    >
      <div className="messageInfo">
        <div className="userInfo">
          <img
            src={
              message.senderId === currentUser.uid
                ? currentUser.photoURL
                : data.user.photoURL
            }
            alt="User"
          />
        </div>
        <div className="messageContent">
          {message.text && <p>{message.text}</p>}
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
                  <FaFile size={24} />
                  <div className="fileDetails">
                    <span className="fileName">{message.file.filename}</span>
                    <span className="fileSize">
                      {formatBytes(message.file.size)}
                    </span>
                  </div>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="date">
        <FaClock />
        <p>{formatDate(message.date)}</p>
      </div>
    </div>
  );
};

export default Message;
