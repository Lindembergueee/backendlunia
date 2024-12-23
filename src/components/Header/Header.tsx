"use client";
import React, { useState } from "react";
import Menu from "@/components/Menu/Menu";
import LoginRegisterModal from "@/components/Register/LoginRegisterModal"; // Importe o modal

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header
      className="relative h-screen bg-fixed bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/images/bg_lunia.png')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-80"></div>

      {/* Navbar */}
      <div className="relative z-20">
        <Menu />
      </div>

      {/* Content - Container centralizado e responsivo */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center max-w-screen-xl mx-auto px-4">
        <h2 className="italic text-lg sm:text-xl md:text-2xl mb-4 drop-shadow-lg">
          Bem vindo ao Realm Lunia!
        </h2>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 uppercase drop-shadow-lg">
          Aproveite a Nostalgia :)
        </h1>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded transition duration-200"
            onClick={() => setIsModalOpen(true)}
          >
            LOGIN/REGISTRO
          </button>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded transition duration-200">
            DOWNLOAD
          </button>
        </div>

        {/* Discord Button */}
        <div className="mt-6">
          <a
            href="https://discord.gg/2JcwxeQWXc"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded transition duration-200 inline-block"
          >
            DISCORD
          </a>
        </div>

        {/* Server Time */}
        <div className="mt-10 bg-gray-900 inline-block px-4 py-2 rounded">
          <p className="text-yellow-500 font-bold text-sm mb-1">SERVER TIME</p>
          <p className="text-white text-2xl font-bold">16:35:41</p>
        </div>
      </div>

      {/* Modal de Login/Registro */}
      <LoginRegisterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
};

export default Header;
