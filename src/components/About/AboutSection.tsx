"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const features = [
  { name: "DEVILDOOM", description: "Desafie o mundo sombrio de DevilDoom e conquiste a vitória!" },
  { name: "ACHIEVEMENT SYSTEM", description: "Alcance grandes feitos e desbloqueie recompensas únicas." },
  { name: "STATUS TRANSFER SYSTEM", description: "Transfira seus status de forma simples e eficiente." },
  { name: "UNIFIED FAMILY AND GUILD", description: "Gerencie sua família e guilda com um sistema inovador." },
  { name: "RANKING", description: "Veja quem lidera o ranking dos melhores jogadores do servidor." },
  { name: "DAILY MISSIONS", description: "Complete missões diárias e ganhe prêmios valiosos!" },
  { name: "BUG FIX", description: "Manutenção contínua para uma experiência de jogo impecável." },
  { name: "DOGECOIN", description: "Explore novos recursos econômicos com trocas e benefícios." },
];

const AboutSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState({ name: "", description: "" });

  const openModal = (feature: { name: string; description: string }) => {
    setActiveFeature(feature);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <section className="relative bg-zinc-900 text-white py-20 px-6 ">
      {/* Título */}
      <motion.div
        className="text-center mb-12 max-w-screen-lg mx-auto px-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase mb-4 text-yellow-500 drop-shadow-lg tracking-wider">
          Realm Lunia
        </h2>
        <p className="text-gray-300 italic text-base md:text-lg leading-relaxed">
          Um universo de desafios e conquistas espera por você!
        </p>
      </motion.div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group relative border border-white/5 shadow-xl rounded-xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:shadow-2xl bg-zinc-800"
            onClick={() => openModal(feature)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="absolute inset-0 bg-yellow-500 opacity-0 group-hover:opacity-5 transition"></div>
            <div className="p-6 relative z-10">
              <h3 className="text-2xl font-bold mb-2 text-yellow-400">{feature.name}</h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                Clique para saber mais detalhes sobre essa funcionalidade!
              </p>
            </div>
            {/* Efeito Decorativo */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500 transition-all duration-500 group-hover:h-2"></div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-lg text-center relative"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl font-bold"
                aria-label="Fechar Modal"
              >
                &times;
              </button>
              <h3 className="text-3xl font-bold text-yellow-500 mb-4 mt-2">{activeFeature.name}</h3>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">{activeFeature.description}</p>
              <button
                onClick={closeModal}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-6 rounded transition"
              >
                Fechar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AboutSection;
