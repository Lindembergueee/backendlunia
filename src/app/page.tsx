import AboutSection from "@/components/About/AboutSection";
import ClassesSection from "@/components/About/ClassesSection";
import Footer from "@/components/About/Footer";
import GameplaySection from "@/components/About/GameplaySection";
import RulesSection from "@/components/About/RulesSection";
import Header from "@/components/Header/Header";
import RankingSection from "@/components/Ranking/RankingSection";
import RebirthRankingSection from "@/components/Ranking/RebirthRankingSection";

export default function Home() {
  return (
    <div className="bg-[#131417]">
      <Header/>
      <AboutSection/>
      <GameplaySection/>
      <ClassesSection/>
      <RulesSection/>
      <RankingSection/>
      <RebirthRankingSection/>
      <Footer/>
    </div>
  );
}
