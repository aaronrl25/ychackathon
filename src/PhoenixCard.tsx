import { Check } from "lucide-react";
import type { Personality } from "./phoenixes";

export function PhoenixCard({ personality, selected, onSelect }: { personality: Personality; selected: boolean; onSelect: () => void }) {
  return <button className={`phoenix-card ${selected ? "selected" : ""}`} style={{"--card-accent":personality.accent} as React.CSSProperties} onClick={onSelect} aria-pressed={selected}>
    <span className="selection-check"><Check/></span>
    <div className="character-well"><span className="character-glow"/><img src={personality.image} alt={`${personality.name} Phoenix`}/></div>
    <div className="card-title"><h2>{personality.name}</h2><span>{personality.tag}</span></div>
    <p>{personality.description}</p>
    <div className="best-for"><strong>BEST FOR</strong>{personality.bestFor}</div>
  </button>;
}
