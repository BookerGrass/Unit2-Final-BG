import React, { useState } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import "./Main.css";

function LogIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 6;
  const isFormValid = emailValid && passwordValid;

  return (
    <div>
      <Navbar />
      <main className="flex-item">
        <h1 className="title">Login</h1>
        <p>login page coming soon.</p>
      </main>
      <Footer />
    </div>
  );
}

export default LogIn;
