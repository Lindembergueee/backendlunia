"use client";
import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-zinc-900 py-10 px-6  text-gray-300 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sobre Nós */}
        <div>
          <h3 className="text-lg md:text-xl font-bold text-yellow-500 mb-4 drop-shadow-sm">
            Sobre Realm Lunia
          </h3>
          <p className="text-sm md:text-base leading-relaxed text-gray-300">
            Realm Lunia é uma experiência única que combina jogabilidade, aventura e comunidade.
            Nossa missão é criar um ambiente divertido e justo para todos os jogadores.
          </p>
        </div>

        {/* Links Rápidos */}
        <div>
          <h3 className="text-lg md:text-xl font-bold text-yellow-500 mb-4 drop-shadow-sm">
            Links Rápidos
          </h3>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="hover:text-yellow-500 transition duration-300 text-sm md:text-base"
              >
                Página Inicial
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-yellow-500 transition duration-300 text-sm md:text-base"
              >
                Sobre Nós
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-yellow-500 transition duration-300 text-sm md:text-base"
              >
                Classes e Personagens
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-yellow-500 transition duration-300 text-sm md:text-base"
              >
                Regras
              </a>
            </li>
          </ul>
        </div>

        {/* Redes Sociais */}
        <div>
          <h3 className="text-lg md:text-xl font-bold text-yellow-500 mb-4 drop-shadow-sm">
            Conecte-se Conosco
          </h3>
          <p className="text-sm md:text-base leading-relaxed mb-4 text-gray-300">
            Siga-nos em nossas redes sociais para ficar por dentro das novidades e eventos.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-gray-300 hover:text-yellow-500 transition duration-300 text-xl hover:scale-110"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-yellow-500 transition duration-300 text-xl hover:scale-110"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-yellow-500 transition duration-300 text-xl hover:scale-110"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-yellow-500 transition duration-300 text-xl hover:scale-110"
              aria-label="YouTube"
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      {/* Linha de separação e direitos autorais */}
      <div className="border-t border-gray-700 mt-10 pt-6">
        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Realm Lunia. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
