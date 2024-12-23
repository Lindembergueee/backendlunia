"use client";

import { FC, useState } from "react";

type RegisterFormProps = {
  onSubmit: (data: { username: string; password: string }) => void;
};

const RegisterForm: FC<RegisterFormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [userAnswer, setUserAnswer] = useState<string>("");
  const [num1, setNum1] = useState<number>(0);
  const [num2, setNum2] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const gerarDesafio = () => {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    setNum1(a);
    setNum2(b);
    setUserAnswer("");
    setErrorMessage("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("As senhas não conferem.");
      return;
    }

    if (parseInt(userAnswer, 10) !== num1 + num2) {
      setErrorMessage("Resposta do desafio incorreta.");
      return;
    }

    onSubmit({ username, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Confirmar senha"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder={`Resolva: ${num1} + ${num2}`}
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      {errorMessage && <div className="text-red-600">{errorMessage}</div>}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Registrar
      </button>
    </form>
  );
};

export default RegisterForm;
