"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCrown } from "react-icons/fa";

type RebirthEntry = {
  rank: number;
  characterName: string;
  rebirthCount: number;
  // storedLevel: number;   // Removido
  // skillPoint: number;    // Removido
  lastRebirthDate: string;
};

const RebirthRankingSection = () => {
  const [ranking, setRanking] = useState<RebirthEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5); // Mostra inicialmente 5 resultados

  // Função para formatar a data no formato dd/mm/yyyy
  const formatDate = (dateString: string) => {
    const [datePart] = dateString.split(" "); // "2023-12-07"
    const [year, month, day] = datePart.split("-");
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:7705/api/rebirthRanking");
        if (!res.ok) {
          throw new Error("Falha ao buscar dados do ranking de renascimento");
        }
        const data: RebirthEntry[] = await res.json();
        setRanking(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, []);

  // Obtém apenas os itens visíveis no momento
  const visibleEntries = ranking.slice(0, visibleCount);

  // Verifica se ainda há mais resultados para mostrar
  const canShowMore = visibleCount < ranking.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <section
      className="relative py-16 px-6 bg-zinc-900 text-white"
      style={{ backgroundSize: "cover", backgroundPosition: "center" }}
    >
      {/* Título */}
      <div className="text-center mb-12 max-w-screen-lg mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-yellow-500 uppercase tracking-wider drop-shadow-md">
          Ranking de Renascimento
        </h2>
        <p className="text-gray-300 mt-4 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed">
          Confira os jogadores que alcançaram maiores números de renascimentos e suas últimas datas de renascimento!
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-300 text-sm sm:text-base">Carregando ranking...</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-white/10 rounded-lg shadow-xl bg-zinc-800/90 backdrop-blur-sm">
            <table className="w-full text-left text-xs sm:text-sm md:text-base">
              <thead>
                <tr>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-yellow-500 uppercase font-bold border-b border-white/5 whitespace-nowrap">
                    Posição
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-yellow-500 uppercase font-bold border-b border-white/5 whitespace-nowrap">
                    Personagem
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-yellow-500 uppercase font-bold border-b border-white/5 whitespace-nowrap">
                    Renascimentos
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-yellow-500 uppercase font-bold border-b border-white/5 whitespace-nowrap">
                    Últ. Renascimento
                  </th>
                </tr>
              </thead>
              <AnimatePresence mode="wait">
                <motion.tbody
                  key="rebirthRanking"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {visibleEntries.map((entry, index) => {
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
                        <td className="px-3 sm:px-4 py-3 sm:py-4 font-bold text-gray-200 flex items-center gap-2 whitespace-nowrap">
                          {isFirst && <FaCrown className="text-yellow-400 text-lg drop-shadow" />}
                          {entry.rank}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-gray-200 font-semibold whitespace-nowrap">
                          {entry.characterName}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-gray-300 whitespace-nowrap">
                          {entry.rebirthCount}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-gray-300 whitespace-nowrap">
                          {formatDate(entry.lastRebirthDate)}
                        </td>
                      </motion.tr>
                    );
                  })}
                </motion.tbody>
              </AnimatePresence>
            </table>
          </div>
        )}

        {/* Botão "Mostrar mais" */}
        {!loading && canShowMore && (
          <div className="text-center mt-6">
            <button
              onClick={handleShowMore}
              className="bg-yellow-500 hover:bg-yellow-600 text-zinc-900 font-bold py-2 px-6 rounded transition duration-300 text-sm sm:text-base"
            >
              Mostrar mais
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default RebirthRankingSection;
