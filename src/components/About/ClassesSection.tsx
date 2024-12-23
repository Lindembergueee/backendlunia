"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const classes = [
  { name: "Vitalidade (VIT)", key: "VIT" },
  { name: "Inteligência (INT)", key: "INT" },
  { name: "Destreza (DES)", key: "DES" },
];

const characters = [
  { name: "Sieg Helmonte", role: "O Cavaleiro", class: "VIT", image: "/images/Sieg.png", description: "Um cavaleiro resistente com ataques de espada poderosos e contínuos." },
  { name: "Eir Peltrow", role: "A Sacerdotisa", class: "INT", image: "/images/eir.png", description: "Sacerdotisa com habilidades de cura e magias sagradas defensivas." },
  { name: "Dainn Crowley", role: "O Feiticeiro Real", class: "INT", image: "/images/dainn.png", description: "Feiticeiro que domina os elementos e lança feitiços devastadores." },
  { name: "Tia", role: "A Ninja", class: "DES", image: "/images/tia.png", description: "Ninja ágil com shurikens e venenos para derrotar seus oponentes." },
  { name: "Lime", role: "O Lodo", class: "VIT", image: "/images/Lime.png", description: "Monstro pegajoso com habilidades de suporte e transformação." },
  { name: "Dacy Dalstrin", role: "A Invocadora", class: "VIT", image: "/images/dacy.png", description: "Invocadora que usa marionetes para ataques estratégicos." },
  { name: "Krieg", role: "O Templário Vingador", class: "VIT", image: "/images/krieg.png", description: "Templário que combina dano massivo com habilidades de cura." },
  { name: "Arien Carnesir", role: "O Arqueiro Mágico", class: "DES", image: "/images/arien.png", description: "Arqueiro que combina flechas rápidas com magia elemental." },
  { name: "Ryan Hunt", role: "O Caçador de Recompensas", class: "DES", image: "/images/ryan.png", description: "Especialista em armas de fogo e ataques físicos de longa distância." },
  { name: "Kali Eschenbach", role: "A Barda das Trevas", class: "INT", image: "/images/kali.png", description: "Demônio disfarçada que usa notas musicais para dano ou cura." },
  { name: "Asuka", role: "A Espadachim", class: "DES", image: "/images/asuka.png", description: "Espadachim letal com ataques rápidos e precisos." },
  { name: "Ralph Schnell", role: "O Lutador", class: "VIT", image: "/images/ralph.png", description: "Artista marcial com habilidades físicas e mágicas poderosas." },
  { name: "Dark Eir", role: "A Princesa das Trevas", class: "INT", image: "/images/dark_eir.png", description: "Versão sombria da princesa Eir com poderes místicos." },
  { name: "Arta Lorraine", role: "O Engenheiro", class: "INT", image: "/images/arta.png", description: "Gênio infantil que cria armas e engenhocas poderosas." },
  { name: "Gaon", role: "O Lanceiro", class: "VIT", image: "/images/gaon.png", description: "Antigo Deus Dragão em busca de recuperar seus poderes." },
  { name: "Iris Lyndall", role: "A Feiticeira das Chamas", class: "DES", image: "/images/iris.png", description: "Feiticeira que controla as chamas com ataques rápidos e potentes." },
  { name: "Yuki", role: "o mago de gelo", class: "INT", image: "/images/Yuki.png", description: "Feiticeira que controla as chamas com ataques rápidos e potentes." },
];

const ClassesSection = () => {
  const [activeClass, setActiveClass] = useState("VIT");
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);

  const filteredCharacters = characters.filter((char) => char.class === activeClass);

  return (
    <section className="bg-zinc-900 text-white py-16 px-6 ">
      {/* Título */}
      <div className="text-center mb-12 max-w-screen-lg mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-yellow-500 uppercase tracking-wider drop-shadow-lg">
          Classes e Personagens
        </h2>
        <p className="text-gray-400 mt-4 text-base md:text-lg">
          Filtre e descubra os personagens com habilidades únicas de cada classe.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {classes.map((cl, index) => (
          <button
            key={index}
            onClick={() => setActiveClass(cl.key)}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-md focus:outline-none ${
              activeClass === cl.key
                ? "bg-yellow-500 text-gray-900 border border-yellow-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {cl.name}
          </button>
        ))}
      </div>

      {/* Grid de Personagens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
        {filteredCharacters.map((character, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            onClick={() => setSelectedCharacter(character)}
            className="border border-white/5 rounded-lg overflow-hidden shadow-lg cursor-pointer transition duration-300 bg-zinc-800 group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <div className="relative">
              <img
                src={character.image}
                alt={character.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60 group-hover:opacity-70 transition"></div>
            </div>
            <div className="p-4 relative">
              <h3 className="text-xl font-bold text-yellow-400">{character.name}</h3>
              <p className="text-gray-400 text-sm md:text-base">{character.role}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedCharacter && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 text-white rounded-lg shadow-2xl p-8 max-w-md mx-auto relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setSelectedCharacter(null)}
                className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500 transition"
                aria-label="Fechar Modal"
              >
                &times;
              </button>
              <h3 className="text-3xl font-bold text-yellow-500 mb-4">
                {selectedCharacter.name}
              </h3>
              <p className="text-gray-300 text-base leading-relaxed">
                {selectedCharacter.description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ClassesSection;
