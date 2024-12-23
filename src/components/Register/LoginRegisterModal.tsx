"use client";

import { FC, useState, useEffect, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import FeedbackModal from "./FeedbackModal";

type LoginRegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LoginRegisterModal: FC<LoginRegisterModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Estados login
  const [loginUsername, setLoginUsername] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  // Estados registro
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // Desafio matemático
  const [num1, setNum1] = useState<number>(0);
  const [num2, setNum2] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");

  // Estados de Feedback
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [feedbackData, setFeedbackData] = useState<{
    title: string;
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (isOpen && activeTab === "register") gerarDesafio();
    if (!isOpen) resetForm();
  }, [isOpen, activeTab]);

  const gerarDesafio = () => {
    setNum1(Math.floor(Math.random() * 10));
    setNum2(Math.floor(Math.random() * 10));
    setUserAnswer("");
  };

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setLoginUsername("");
    setLoginPassword("");
    setUserAnswer("");
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePasswordStrength = (password: string) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      showFeedback("Erro!", "Por favor, preencha todos os campos.", "error");
      return;
    }

    if (!validateEmail(email)) {
      showFeedback("Erro!", "Por favor, insira um e-mail válido.", "error");
      return;
    }

    if (!validatePasswordStrength(password)) {
      showFeedback(
        "Erro!",
        "A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, números e símbolos.",
        "error"
      );
      return;
    }

    if (password !== confirmPassword) {
      showFeedback("Erro!", "As senhas não conferem.", "error");
      return;
    }

    const correctAnswer = num1 + num2;
    if (parseInt(userAnswer, 10) !== correctAnswer) {
      showFeedback("Erro!", "Resposta do desafio incorreta.", "error");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountName: username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao registrar. Tente novamente.");
      }

      showFeedback("Sucesso!", "Registro realizado com sucesso!", "success");

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      showFeedback("Erro!", error.message || "Erro inesperado ao registrar.", "error");
    }
  };

  const handleLogin = async () => {
    if (!loginUsername || !loginPassword) {
      showFeedback("Erro!", "Por favor, preencha todos os campos.", "error");
      return;
    }

    console.log("Login enviado:", { loginUsername, loginPassword });

    showFeedback("Sucesso!", "Login realizado com sucesso!", "success");
  };

  const showFeedback = (title: string, message: string, type: "success" | "error") => {
    setFeedbackData({ title, message, type });
    setShowFeedbackModal(true);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    activeTab === "register" ? handleRegister() : handleLogin();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} aria-hidden="true"></div>

      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div className="w-full text-black max-w-md bg-white rounded-lg shadow-lg overflow-hidden relative">
          <button
            className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-black"
            onClick={onClose}
          >
            &times;
          </button>

          <div className="relative h-40 w-full">
            <Image src="/images/register_bg.png" alt="Imagem de fundo" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80"></div>
            <h2 className="absolute bottom-4 left-4 text-white text-2xl font-semibold">
              {activeTab === "login" ? "Bem-vindo de volta!" : "Crie sua conta"}
            </h2>
          </div>

          <div className="flex border-b">
            <button
              className={`flex-1 py-2 text-center ${
                activeTab === "login" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
              }`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 text-center ${
                activeTab === "register" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
              }`}
              onClick={() => setActiveTab("register")}
            >
              Registro
            </button>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === "login" ? (
                <LoginForm
                  loginUsername={loginUsername}
                  loginPassword={loginPassword}
                  onChangeUsername={(e) => setLoginUsername(e.target.value)}
                  onChangePassword={(e) => setLoginPassword(e.target.value)}
                  onSubmit={handleLogin}
                />
              ) : (
                <RegisterForm
                  username={username}
                  email={email}
                  password={password}
                  confirmPassword={confirmPassword}
                  userAnswer={userAnswer}
                  num1={num1}
                  num2={num2}
                  onChange={{
                    username: (e) => setUsername(e.target.value),
                    email: (e) => setEmail(e.target.value),
                    password: (e) => setPassword(e.target.value),
                    confirmPassword: (e) => setConfirmPassword(e.target.value),
                    userAnswer: (e) => setUserAnswer(e.target.value),
                  }}
                />
              )}
              <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                {activeTab === "login" ? "Entrar" : "Registrar"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {showFeedbackModal && feedbackData && (
        <FeedbackModal
          title={feedbackData.title}
          message={feedbackData.message}
          type={feedbackData.type}
          onClose={() => setShowFeedbackModal(false)}
        />
      )}
    </>
  );
};

export default LoginRegisterModal;
