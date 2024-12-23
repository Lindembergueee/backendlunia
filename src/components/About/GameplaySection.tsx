"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
  {
    title: "Jogabilidade Livre",
    content:
      "Movimente-se pelo jogo usando as teclas, abandonando o tradicional clique do mouse. Lance combos com combinações de teclas de ataque e a barra de espaço para ações rápidas e estratégicas.",
  },
  {
    title: "Modo Multijogador",
    content:
      "Encadeie ataques aéreos e combos precisos com base no tempo e ordem das teclas. Atribua habilidades a atalhos e personalize seu estilo de jogo, tornando cada batalha única.",
  },
  {
    title: "História Interativa",
    content:
      "Explore uma narrativa envolvente dividida em arcos e episódios. Cada fase traz cenários novos, desde planícies e florestas até cavernas e montanhas nevadas. Escolha a dificuldade e conquiste novos desafios!",
  },
  {
    title: "Modos Legend e Myth",
    content:
      "Aventure-se em estágios mais desafiadores com inimigos fortalecidos. Combine itens lendários e míticos para forjar equipamentos poderosos, prontos para suas maiores batalhas.",
  },
  {
    title: "Itens Visuais",
    content:
      "Estilize seu personagem com itens visuais exclusivos. Adicione pergaminhos (scrolls) com atributos especiais e combine estilo com força para se destacar no jogo.",
  },
];

const GameplaySection = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section
      className="relative bg-zinc-900 text-gray-300 py-16 px-6"
      style={{
        backgroundImage: "url('/images/bg_Lunia.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay para escurecer a imagem com um degrade e blur */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/90 backdrop-blur-sm"></div>

      {/* Conteúdo */}
      <div className="relative z-10 max-w-screen-xl mx-auto">
        {/* Título */}
        <div className="text-center mb-12 px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-yellow-500 uppercase tracking-wide drop-shadow-lg">
            Explore a Jogabilidade
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Descubra os modos de jogo, desafios e funcionalidades que tornam <strong>Lunia</strong> uma experiência única e emocionante.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-10 px-4">
          {sections.map((section, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`py-2 px-6 rounded-full font-bold transition-all duration-300 focus:outline-none ${
                activeTab === index
                  ? "bg-yellow-500 text-zinc-900 shadow-md scale-105"
                  : "bg-zinc-800 text-gray-200 hover:bg-yellow-500 hover:text-zinc-900"
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Conteúdo das Tabs */}
        <div className="px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-zinc-800 bg-opacity-90 rounded-xl shadow-lg p-6 md:p-8 max-w-3xl mx-auto"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-4">
                {sections[activeTab].title}
              </h3>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                {sections[activeTab].content}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default GameplaySection;
