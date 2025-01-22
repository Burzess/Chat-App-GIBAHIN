import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { format, isToday, isYesterday } from "date-fns";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const formatDate = (dateObj) => {
    if (!dateObj || !dateObj.seconds) return "Unknown date";

    const date = new Date(dateObj.seconds * 1000);

    if (isToday(date)) {
      return `Today, ${format(date, "p")}`;
    }

    if (isYesterday(date)) {
      return `Yesterday, ${format(date, "p")}`;
    }

    return format(date, "MMM d, yyyy, p");
  };

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
                <span>{message.file.filename}</span>
              </a>
            )}
          </div>
        )}
      </div>
      <span>{formatDate(message.date)}</span>
    </div>
  );
};

export default Message;
