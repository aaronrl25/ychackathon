import { Code2, Sparkles } from "lucide-react";
import type { Personality } from "./phoenixes";

export function PersonalityPreview({ personality }: { personality: Personality }) {
  return <aside className="personality-preview" key={personality.id}>
    <div className="preview-label"><Sparkles/> PERSONALITY PREVIEW</div>
    <div className="preview-window"><div className="preview-top"><span><i/> MD Soul</span><span><Code2/> auth.ts</span></div><div className="preview-body"><div className="preview-prompt">How should we handle authentication state?</div><div className="preview-response"><span className="preview-avatar" style={{background:personality.accent}}><img src={personality.image} alt=""/></span><div><b>{personality.name}</b><p>{personality.response}</p></div></div></div></div>
  </aside>;
}
