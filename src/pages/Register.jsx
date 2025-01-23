import React, { useState } from "react";
import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../img/logo.png";
import { fileDrivetoken, getUploadServer } from "../fileDrive";

const Register = () => {
  const [err, setErr] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setPreview(previewURL);
    }
  };

  const uploadFileToServer = async (file) => {
    setImgUploading(true);
    const uploadServer = await getUploadServer();
    try {
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
      setImgUploading(false);
      return responseData.data.original_url;
    } catch (error) {
      setImgUploading(false);
      throw new Error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr(false);

    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      // Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Upload file to server
      let downloadURL = null;
      if (file) {
        downloadURL = await uploadFileToServer(file);
      }

      // Update profile
      await updateProfile(res.user, {
        displayName,
        photoURL: downloadURL,
      });

      // Save user data in Firestore
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName,
        email,
        photoURL: downloadURL,
      });

      // Create empty user chats in Firestore
      await setDoc(doc(db, "userChats", res.user.uid), {});
      navigate("/");
    } catch (err) {
      console.error(err);
      setErr(true);
      setErrMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <img src={Logo} width={"400px"} alt="logo" />
        <span className="title">Daftar</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="Nama" />
          <input required type="email" placeholder="Email" />
          <input required type="password" placeholder="Password" />
          <input
            required
            style={{ display: "none" }}
            type="file"
            id="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <label htmlFor="file">
            <img src={preview || Add} width={"100px"} alt="Avatar preview" />
            <span>{preview ? "Ubah Foto Profil" : "Pilih Foto Profil"}</span>
          </label>
          <button disabled={loading || imgUploading}>
            {loading ? "Processing..." : "Daftar"}
          </button>
          {imgUploading && "Mengunggah gambar, harap tunggu..."}
          {err && <span className="error">{errMessage}</span>}
        </form>
        <p>
          Apakah anda sudah punya akun ? <Link to="/login">Masuk</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
