"use client";

import { FC, useState, useEffect, ChangeEvent, FormEvent } from "react";
import Image from "next/image";

type LoginRegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LoginRegisterModal: FC<LoginRegisterModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Campos login
  const [loginUsername, setLoginUsername] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  // Campos registro
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // Estados para o desafio matemático
  const [num1, setNum1] = useState<number>(0);
  const [num2, setNum2] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    if (isOpen && activeTab === "register") gerarDesafio();
    if (!isOpen) resetForm();
  }, [isOpen, activeTab]);

  const gerarDesafio = () => {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    setNum1(a);
    setNum2(b);
    setUserAnswer("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setLoginUsername("");
    setLoginPassword("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const isPasswordStrong = (pwd: string) => {
    const strongPasswordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(pwd);
  };

  const handleRegister = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!username || !email || !password || !confirmPassword) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("As senhas não conferem.");
      return;
    }

    if (!isPasswordStrong(password)) {
      setErrorMessage("A senha deve conter pelo menos 8 caracteres, incluindo números, letras e símbolos.");
      return;
    }

    const correctAnswer = num1 + num2;
    if (parseInt(userAnswer, 10) !== correctAnswer) {
      setErrorMessage("Resposta do desafio incorreta. Tente novamente.");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountName: username, password: password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao registrar. Tente novamente.");
      }

      setSuccessMessage("Registro realizado com sucesso!");
      resetForm();
      gerarDesafio();
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const handleLogin = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!loginUsername || !loginPassword) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return;
    }

    // Simulação de envio ao backend
    console.log("Login enviado:", { loginUsername, loginPassword });
    setSuccessMessage("Login realizado com sucesso!");
    resetForm();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    activeTab === "register" ? handleRegister() : handleLogin();
  };

  if (!isOpen) return null;

  const handleChange = (setter: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) =>
    setter(e.target.value);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} aria-hidden="true"></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div className="w-full text-black max-w-md bg-white rounded-lg shadow-lg overflow-hidden relative">
          <button
            className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-black"
            onClick={onClose}
            aria-label="Fechar modal"
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
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2 text-center ${
                activeTab === "login" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-2 text-center ${
                activeTab === "register" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
              }`}
            >
              Registro
            </button>
          </div>

          <div className="p-6">
            {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
            {successMessage && <div className="text-green-600 mb-4">{successMessage}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === "login" ? (
                <>
                  <input
                    type="text"
                    placeholder="Username"
                    value={loginUsername}
                    onChange={handleChange(setLoginUsername)}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Senha"
                    value={loginPassword}
                    onChange={handleChange(setLoginPassword)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={handleChange(setUsername)}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleChange(setEmail)}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={handleChange(setPassword)}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirmar Senha"
                    value={confirmPassword}
                    onChange={handleChange(setConfirmPassword)}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder={`Resolva: ${num1} + ${num2}`}
                    value={userAnswer}
                    onChange={handleChange(setUserAnswer)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </>
              )}
              <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                {activeTab === "login" ? "Entrar" : "Registrar"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginRegisterModal;
