"use client";

import { FC, ChangeEvent } from "react";

type RegisterFormProps = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  userAnswer: string;
  num1: number;
  num2: number;
  onChange: {
    username: (e: ChangeEvent<HTMLInputElement>) => void;
    email: (e: ChangeEvent<HTMLInputElement>) => void;
    password: (e: ChangeEvent<HTMLInputElement>) => void;
    confirmPassword: (e: ChangeEvent<HTMLInputElement>) => void;
    userAnswer: (e: ChangeEvent<HTMLInputElement>) => void;
  };
};

const RegisterForm: FC<RegisterFormProps> = ({
  username,
  email,
  password,
  confirmPassword,
  userAnswer,
  num1,
  num2,
  onChange,
}) => {
  return (
    <>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={onChange.username}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={onChange.email}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={onChange.password}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Confirmar Senha"
        value={confirmPassword}
        onChange={onChange.confirmPassword}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder={`Resolva: ${num1} + ${num2}`}
        value={userAnswer}
        onChange={onChange.userAnswer}
        className="w-full p-2 border rounded"
        required
      />
    </>
  );
};

export default RegisterForm;
