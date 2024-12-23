"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const MENU_ITEMS = ["HOME", "NEWS", "RULES", "TEAM", "FORUM", "WIKI", "DISCORD", "DOWNLOAD"];

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Mudar fundo ao rolar a página
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 px-6 py-6 transition-all duration-300 ${
          isScrolled ? "bg-[#1d1f21]/95 shadow-lg" : "bg-transparent"
        }`}
        aria-label="Main Navigation"
      >
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" aria-label="Ir para a página inicial">
              <Image
                src="/images/Eir.png"
                alt="Logo do site"
                width={64}
                height={64}
                className="rounded-full"
                priority
              />
            </Link>
          </div>

          {/* Menu - Desktop */}
          <ul
            className="hidden md:flex space-x-8 uppercase text-sm font-medium"
            role="menubar"
            aria-label="Menu principal"
          >
            {MENU_ITEMS.map((item) => (
              <li key={item} role="none">
                <Link
                  href={`/${item.toLowerCase()}`}
                  className="hover:text-yellow-500 transition"
                  role="menuitem"
                  aria-label={`Ir para ${item}`}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>

          {/* Botão de menu Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white text-3xl focus:outline-none"
            aria-label="Abrir menu de navegação"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            &#9776;
          </button>
        </div>
      </nav>

      {/* Overlay com desfoque ao fundo, exibido apenas quando o menu está aberto */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-md"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Menu Lateral - Mobile */}
      <div
        id="mobile-menu"
        className={`fixed inset-y-0 left-0 w-64 bg-[#1d1f21] text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
        aria-hidden={!isOpen}
        aria-label="Menu de navegação móvel"
      >
        <button
          onClick={() => setIsOpen(false)}
          className="text-3xl text-white absolute top-4 right-4"
          aria-label="Fechar menu"
        >
          &times;
        </button>
        <ul className="p-6 space-y-6 text-sm uppercase font-medium" role="menubar">
          {MENU_ITEMS.map((item) => (
            <li key={item} role="none">
              <Link
                href={`/${item.toLowerCase()}`}
                className="block hover:text-yellow-500"
                onClick={() => setIsOpen(false)}
                role="menuitem"
                aria-label={`Ir para ${item}`}
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Menu;
