"use client";

import { FC } from "react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

type FeedbackModalProps = {
  title: string;
  message: string;
  type: "success" | "error"; // Define o tipo de feedback
  onClose: () => void;
};

const FeedbackModal: FC<FeedbackModalProps> = ({ title, message, type, onClose }) => {
  const isSuccess = type === "success";

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        {/* Modal */}
        <div
          className={`relative w-full max-w-sm p-6 rounded-lg shadow-lg transform transition-all duration-300 ${
            isSuccess ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {/* Ícone Dinâmico */}
          <div className="flex justify-center mb-4">
            {isSuccess ? (
              <AiOutlineCheckCircle className="text-green-500 text-6xl animate-bounce" />
            ) : (
              <AiOutlineCloseCircle className="text-red-500 text-6xl animate-bounce" />
            )}
          </div>

          {/* Conteúdo */}
          <div className="text-center">
            <h2 className={`text-2xl font-bold mb-2 ${isSuccess ? "text-green-700" : "text-red-700"}`}>
              {title}
            </h2>
            <p className="text-gray-700 mb-4">{message}</p>
          </div>

          {/* Botão de Fechar */}
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-md text-white font-semibold transition-colors duration-200 ${
                isSuccess ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              OK
            </button>
          </div>
        </div>
      </div>

      {/* Animação CSS */}
      <style jsx>{`
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
      `}</style>
    </>
  );
};

export default FeedbackModal;
