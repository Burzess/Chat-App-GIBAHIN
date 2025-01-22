import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
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

const Input = () => {
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const uploadToFilebin = async (file) => {
    const uploadServer = await getUploadServer(); // Assuming this retrieves the correct server endpoint

    const formData = new FormData();
    formData.append("file", file); // Use the "file" key as per the API requirements

    const response = await fetch(uploadServer.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${fileDrivetoken}`, // Include the token
      },
      body: formData, // Pass the FormData for the multipart upload
    });

    if (!response.ok) {
      throw new Error("Failed to upload file to the server");
    }

    const responseData = await response.json();

    // Check for a successful response
    if (!responseData.success) {
      throw new Error(
        responseData.message || "Unknown error occurred during file upload"
      );
    }

    // Return relevant file data
    return {
      id: responseData.data.id,
      filename: responseData.data.filename,
      url: responseData.data.original_url, // Use the provided URL for the uploaded file
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
        fileData = await uploadToFilebin(attachment);
      }

      const messageData = {
        id: uuid(),
        text,
        senderId: currentUser.uid,
        date: Timestamp.now(),
        ...(fileData && { file: fileData }),
      };

      // Update chat document
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion(messageData),
      });

      // Update user chats for current user
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });

      // Update user chats for the other user
      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });

      setText("");
      setAttachment(null);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <img src={Attach} alt="Attach file" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setAttachment(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="Upload" />
        </label>
        <button onClick={handleSend} disabled={isUploading}>
          {isUploading ? "Uploading..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Input;
