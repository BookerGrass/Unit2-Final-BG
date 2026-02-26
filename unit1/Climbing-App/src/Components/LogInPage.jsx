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
  </div>
);
}

export default LogIn;
