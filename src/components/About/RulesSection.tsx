"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaExclamationTriangle, FaShieldAlt, FaBan, FaUserShield } from "react-icons/fa";

const rules = [
  {
    category: "Comportamento",
    icon: <FaShieldAlt className="text-yellow-500 text-3xl" />,
    items: [
      "Não seja rude com os outros. Sem insultos, xingamentos ou assédio.",
      "Respeite religiões, origens étnicas, e opiniões políticas diferentes.",
      "Evite causar desconforto público ou drama no jogo.",
    ],
  },
  {
    category: "Jogo Limpo",
    icon: <FaExclamationTriangle className="text-yellow-500 text-3xl" />,
    items: [
      "Não use mods, macros ou bugs para obter vantagens.",
      "Automatizar ações é permitido apenas se estiver presente (não AFK).",
      "Não jogue com várias contas em estágios simultâneos.",
    ],
  },
  {
    category: "Fraudes e Negociações",
    icon: <FaBan className="text-yellow-500 text-3xl" />,
    items: [
      "Não engane outros jogadores em transações ou loterias.",
      "É proibido qualquer transação envolvendo dinheiro real (RMT).",
      "Não venda ou compartilhe contas.",
    ],
  },
  {
    category: "Segurança",
    icon: <FaUserShield className="text-yellow-500 text-3xl" />,
    items: [
      "Não use contas comprometidas ou hackeadas.",
      "Nunca forneça informações pessoais a outros jogadores.",
      "Mantenha suas informações de login seguras.",
    ],
  },
];

const RulesSection = () => {
  return (
    <section className="relative bg-zinc-900 py-16 px-6 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white">
      {/* Título */}
      <div className="text-center mb-12 max-w-screen-lg mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold uppercase text-yellow-500 tracking-wide drop-shadow-lg">
          Regras do Jogo
        </h2>
        <p className="text-gray-300 mt-4 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Siga estas regras para garantir um ambiente justo, amigável e seguro no <strong>Realm Lunia</strong>.
        </p>
      </div>

      {/* Grid de Regras */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4">
        {rules.map((rule, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            className="border border-white/10 rounded-lg shadow-lg p-6 bg-zinc-800 transition duration-300 relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-center gap-4 mb-4">
              {rule.icon}
              <h3 className="text-2xl md:text-3xl font-bold text-yellow-400">
                {rule.category}
              </h3>
            </div>
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              {rule.items.map((item, i) => (
                <li key={i} className="text-lg md:text-base leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RulesSection;
