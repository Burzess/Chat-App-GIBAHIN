import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { v4 as uuid } from "uuid";
import { fileDrivetoken, getUploadServer } from "../fileDrive";
import { FaImage, FaPaperclip, FaPaperPlane, FaX } from "react-icons/fa6";

const Input = () => {
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const uploadFiveToServer = async (file) => {
    const uploadServer = await getUploadServer();

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(uploadServer.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${fileDrivetoken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file to the server");
    }

    const responseData = await response.json();

    if (!responseData.success) {
      throw new Error(
        responseData.message || "Unknown error occurred during file upload"
      );
    }

    return {
      id: responseData.data.id,
      filename: responseData.data.filename,
      url: responseData.data.original_url,
      mimeType: responseData.data.mime_type,
      size: responseData.data.size,
      createdAt: responseData.data.created_at,
    };
  };

  const handleSend = async () => {
    setIsUploading(true);
    try {
      let fileData = null;

      if (attachment) {
        fileData = await uploadFiveToServer(attachment);
      }

      const messageData = {
        id: uuid(),
        text,
        senderId: currentUser.uid,
        date: Timestamp.now(),
        ...(fileData && { file: fileData }),
      };

      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion(messageData),
      });

      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });

      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });

      setText("");
      setAttachment(null);
      setPreview(null);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (file) => {
    setAttachment(file);

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    setPreview(null);
  };

  return (
    <>
      <div className="attachment">
        {attachment && (
          <div className="attachmentPreview">
            {preview ? (
              <div className="preview">
                <img src={preview} alt="Preview" className="previewImage" />
                <div className="details">
                  <span>{attachment.name}</span>
                  <span>{(attachment.size / 1024).toFixed(2)} KB</span>
                </div>
              </div>
            ) : (
              <div className="preview">
                <div className="details">
                  <span>{attachment.name}</span>
                  <span>{(attachment.size / 1024).toFixed(2)} KB</span>
                </div>
              </div>
            )}
            <FaX className="removeIcon" onClick={handleRemoveAttachment} />
          </div>
        )}
      </div>
      <div className="input">
        <input
          type="text"
          placeholder="Type something..."
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <div className="send">
          <label htmlFor="file">
            <FaPaperclip
              size={30}
              className="text-white hover:text-zinc-300 transition"
            />
          </label>
          <input
            type="file"
            style={{ display: "none" }}
            id="file"
            onChange={(e) => handleFileChange(e.target.files[0])}
          />
          <label htmlFor="image">
            <FaImage
              size={30}
              className="text-white hover:text-zinc-300 transition"
            />
          </label>
          <input
            disabled={isUploading}
            type="file"
            style={{ display: "none" }}
            id="image"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files[0])}
          />
          <button
            onClick={handleSend}
            disabled={isUploading || (!attachment && text.length === 0)}
          >
            <FaPaperPlane className="text-white" />
            {isUploading ? "Uploading..." : "Send"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Input;
