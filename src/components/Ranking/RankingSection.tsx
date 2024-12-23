"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCrown } from "react-icons/fa";

type RankingEntry = {
  rank: number;
  characterName: string;
  level: number;
  time: string;
};

const RankingSection = () => {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"tower1" | "tower2">("tower1");

  const getApiUrl = () => {
    return activeTab === "tower1"
      ? "http://localhost:7705/api/tower1Ranking"
      : "http://localhost:7705/api/tower2Ranking";
  };

  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true);
      try {
        const res = await fetch(getApiUrl());
        if (!res.ok) {
          throw new Error("Falha ao buscar dados do ranking");
        }
        const data: RankingEntry[] = await res.json();
        setRanking(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, [activeTab]);

  return (
    <section
      className="relative py-16 px-6 bg-zinc-900 text-white"
      style={{ backgroundSize: "cover", backgroundPosition: "center" }}
    >
      {/* Título */}
      <div className="text-center mb-12 max-w-screen-lg mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-yellow-500 uppercase tracking-wider drop-shadow-md">
          Ranking da Torre
        </h2>
        <p className="text-gray-300 mt-4 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed">
          Veja quem são os jogadores que foram mais longe na Torre. Tempo, nível e glória estão no topo!
        </p>
      </div>

      {/* Tabs de seleção da Torre */}
      <div className="flex justify-center gap-4 mb-10 px-4">
        <button
          onClick={() => setActiveTab("tower1")}
          className={`py-2 px-4 sm:px-6 rounded-full font-bold transition-all duration-300 focus:outline-none flex items-center gap-2 ${
            activeTab === "tower1"
              ? "bg-yellow-500 text-zinc-900 ring-2 ring-yellow-500 ring-offset-2 ring-offset-zinc-900 scale-105"
              : "bg-zinc-800 text-gray-200 hover:bg-yellow-500 hover:text-zinc-900"
          }`}
        >
          Torre 1
        </button>
        <button
          onClick={() => setActiveTab("tower2")}
          className={`py-2 px-4 sm:px-6 rounded-full font-bold transition-all duration-300 focus:outline-none flex items-center gap-2 ${
            activeTab === "tower2"
              ? "bg-yellow-500 text-zinc-900 ring-2 ring-yellow-500 ring-offset-2 ring-offset-zinc-900 scale-105"
              : "bg-zinc-800 text-gray-200 hover:bg-yellow-500 hover:text-zinc-900"
          }`}
        >
          Torre 2
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-300 text-sm sm:text-base">Carregando ranking...</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-white/10 rounded-lg shadow-xl bg-zinc-800/90 backdrop-blur-sm">
            <table className="w-full text-left text-sm sm:text-base">
              <thead>
                <tr>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-yellow-500 uppercase text-xs sm:text-sm font-bold border-b border-white/5">
                    Posição
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-yellow-500 uppercase text-xs sm:text-sm font-bold border-b border-white/5">
                    Personagem
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-yellow-500 uppercase text-xs sm:text-sm font-bold border-b border-white/5">
                    Nível
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-yellow-500 uppercase text-xs sm:text-sm font-bold border-b border-white/5">
                    Tempo
                  </th>
                </tr>
              </thead>
              <AnimatePresence mode="wait">
                <motion.tbody
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {ranking.map((entry, index) => {
                    const isFirst = entry.rank === 1;
                    const isSecond = entry.rank === 2;
                    const isThird = entry.rank === 3;

                    let rowClasses =
                      "border-b border-white/5 transition-colors duration-300 hover:bg-zinc-700/20";
                    if (isFirst) {
                      rowClasses += " ring-1 ring-yellow-500";
                    } else if (isSecond) {
                      rowClasses += " bg-zinc-700/10";
                    } else if (isThird) {
                      rowClasses += " bg-zinc-700/5";
                    }

                    return (
                      <motion.tr
                        key={entry.rank}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3, delay: index * 0.03 }}
                        className={rowClasses}
                      >
                        <td className="px-3 sm:px-4 py-3 sm:py-4 font-bold text-gray-200 flex items-center gap-2">
                          {isFirst && <FaCrown className="text-yellow-400 text-lg drop-shadow" />}
                          {entry.rank}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-gray-200 font-semibold">
                          {entry.characterName}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-gray-300">{entry.level}</td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-gray-300">{entry.time}</td>
                      </motion.tr>
                    );
                  })}
                </motion.tbody>
              </AnimatePresence>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default RankingSection;
