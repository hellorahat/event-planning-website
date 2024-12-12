import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import "../styles/GoogleSignIn.css";
import googleLogo from "../assets/googleLogo.svg";

const GoogleSignIn = () => {
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // You can access the signed-in user's info here
      const user = result.user;
      console.log("User info:", user);
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  return (
    <div>
      <button
        className="google-btn"
        onClick={handleGoogleSignIn}
        style={{ width: "575px" }}
      >
        <img className="google-icon" src={googleLogo} alt="Google logo" />
        <span>Sign in with Google</span>
      </button>
    </div>
  );
};

export default GoogleSignIn;
