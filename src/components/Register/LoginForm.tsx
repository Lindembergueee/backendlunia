"use client";

import { FC, ChangeEvent, FormEvent } from "react";

type LoginFormProps = {
  loginUsername: string;
  loginPassword: string;
  onChangeUsername: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangePassword: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void; // Adicionado corretamente
};

const LoginForm: FC<LoginFormProps> = ({
  loginUsername,
  loginPassword,
  onChangeUsername,
  onChangePassword,
}) => {
  return (
    <>
      <input
        type="text"
        placeholder="Username"
        value={loginUsername}
        onChange={onChangeUsername}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={loginPassword}
        onChange={onChangePassword}
        className="w-full p-2 border rounded"
        required
      />
    </>
  );
};

export default LoginForm;
