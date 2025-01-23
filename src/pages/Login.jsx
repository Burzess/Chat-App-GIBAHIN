import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import Logo from "../img/logo.png";

const Login = () => {
  const [err, setErr] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const navigate = useNavigate();

  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Handles login form submission. When the form is submitted, the user is
   * authenticated using the provided email and password. If authentication
   * succeeds, the user is redirected to the homepage. If authentication fails,
   * an error message is displayed to the user.
   * @param {Event} e - The form submission event
   */
  /******  40b1d93b-1e21-40a0-8146-aeaf2d372652  *******/
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setErr(true);
      setErrMessage(err.message);
    }
  };
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <img src={Logo} width={"400px"} alt="logo" />
        <span className="title">Masuk</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit">Masuk</button>
          {err && <span className="error">{errMessage}</span>}
        </form>
        <p>
          Tidak punya akun? <Link to="/register">Daftar</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
