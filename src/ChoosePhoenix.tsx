import { useMemo, useState } from "react";
import { ArrowRight, Flame } from "lucide-react";
import { PhoenixCard } from "./PhoenixCard";
import { PersonalityPreview } from "./PersonalityPreview";
import { personalities, savePersonalitySelection, type PersonalityId } from "./phoenixes";
import "./onboarding.css";

export function ChoosePhoenix({ onComplete }: { onComplete: () => void }) {
  const stored = localStorage.getItem("md-soul:phoenix-personality") as PersonalityId | null;
  const [selectedId, setSelectedId] = useState<PersonalityId>(personalities.some(p=>p.id===stored) ? stored! : "thinking");
  const selected = useMemo(() => personalities.find(p=>p.id===selectedId)!, [selectedId]);
  const continueToRepo = () => { savePersonalitySelection(selected); onComplete(); };
  const decideLater = () => { localStorage.removeItem("md-soul:phoenix-personality"); onComplete(); };
  return <main className="onboarding-shell"><div className="onboarding-ambient ambient-one"/><div className="onboarding-ambient ambient-two"/>
    <nav className="soul-brand"><span><Flame/></span><b>MD Soul</b><em>ONBOARDING</em></nav>
    <header className="onboarding-heading"><span className="step-count">01 <i/> 03</span><h1>Choose your <em>Phoenix</em></h1><p>Pick how you want your AI coding partner to think, communicate, and collaborate with you. You can change this later.</p></header>
    <section className="phoenix-grid">{personalities.map(p=><PhoenixCard key={p.id} personality={p} selected={selectedId===p.id} onSelect={()=>setSelectedId(p.id)}/>)}</section>
    <PersonalityPreview personality={selected}/>
    <footer className="onboarding-actions"><button className="decide-later" onClick={decideLater}>I’ll decide later</button><button className="continue-button" onClick={continueToRepo}>Continue with {selected.name}<ArrowRight/></button></footer>
  </main>;
}
