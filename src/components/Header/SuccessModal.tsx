"use client";

import { FC } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";

type SuccessModalProps = {
  message: string;
  onClose: () => void;
};

const SuccessModal: FC<SuccessModalProps> = ({ message, onClose }) => {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative animate-fadeIn">
          <div className="flex flex-col items-center space-y-4">
            <AiOutlineCheckCircle className="text-green-500 text-6xl animate-bounce" />
            <h3 className="text-2xl font-semibold text-gray-800">{message}</h3>
            <button
              onClick={onClose}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-200"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-in-out;
        }

        .animate-bounce {
          animation: bounce 1s infinite;
        }
      `}</style>
    </>
  );
};

export default SuccessModal;
