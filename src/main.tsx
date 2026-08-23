import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowRight, BrainCircuit, Check, ChevronDown, Code2, Fingerprint, Flame, Menu, MessageSquareCode, ShieldCheck, Sparkles, X, Zap } from "lucide-react";
import "./styles.css";

const features = [
  [BrainCircuit, "01", "Learns your defaults", "Temper picks up the patterns you approve—your stack, naming style, testing habits, and preferred level of explanation."],
  [MessageSquareCode, "02", "Keeps every prompt lighter", "Skip the repeated setup. Your preferences travel with you, so each new session starts closer to the way you actually work."],
  [Fingerprint, "03", "Stays unmistakably yours", "Choose the voice and working style you want—from measured mentor to pragmatic builder—without losing technical precision."],
] as const;
const steps = [["Work naturally", "Code, review, and ask questions exactly as you do today."], ["Temper notices", "Accepted changes become evidence, not rigid rules."], ["You stay in control", "Review, lock, edit, or delete any remembered preference."]];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };
  return <div className="site-shell">
    <nav className="nav" aria-label="Main navigation">
      <button className="brand" onClick={() => scrollTo("top")} aria-label="Temper home"><span className="brand-mark"><img src="/assets/phoenix.png" alt=""/></span><span>temper<span className="brand-dot">.</span></span></button>
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X/> : <Menu/>}</button>
      <div className={`nav-links ${menuOpen ? "open" : ""}`}><button onClick={() => scrollTo("features")}>Features</button><button onClick={() => scrollTo("how")}>How it works</button><button onClick={() => scrollTo("privacy")}>Privacy</button><button className="nav-cta" onClick={() => scrollTo("cta")}>Join the waitlist <ArrowRight size={15}/></button></div>
    </nav>
    <main id="top">
      <section className="hero"><div className="hero-glow"/><div className="hero-copy-block"><div className="eyebrow"><Sparkles size={13}/> Your AI, finally in tune</div><h1>Stop teaching<br/>your AI<br/><em>the same<br/>things twice.</em></h1><p className="hero-copy">Temper is the memory layer for AI coding tools. It learns how you build, adapts to your preferences, and keeps you in control.</p>
        <div className="hero-actions"><button className="primary-button" onClick={() => scrollTo("cta")}>Get early access <ArrowRight size={18}/></button><button className="text-button" onClick={() => scrollTo("how")}><span className="play"><Zap size={14} fill="currentColor"/></span> See how it works</button></div>
        <div className="trust-line"><span><Check size={13}/> No credit card</span><span><Check size={13}/> Private by design</span><span><Check size={13}/> Works with your stack</span></div></div>
        <div className="phoenix-stage" aria-label="Temper phoenix illustration"><div className="phoenix-orbit"/><div className="memory-callout learned"><span><Fingerprint size={16}/></span><div><b>Learned your style</b><small>24 signals · today</small></div></div><img className="hero-phoenix" src="/assets/phoenix.png" alt="A fiery phoenix, the Temper mascot"/><div className="memory-callout typescript"><span>TS</span><div><b>TypeScript first</b><small>applied automatically</small></div></div></div>
        <div className="integrations"><span>PLUGS INTO</span><b>VS Code</b><b>Cursor</b><b>JetBrains</b><b>Neovim</b><b>Zed</b><b>CLI</b></div>
      </section>
      <section className="statement"><p>AI should adapt to <em>you.</em></p><p className="dim">Not the other way around.</p></section>
      <section className="section" id="features"><div className="section-kicker">WHY TEMPER</div><div className="section-heading"><h2>A better working relationship<br/>with your AI.</h2><p>More than memory. Temper turns your everyday choices into a working style that follows you.</p></div><div className="feature-grid">{features.map(([Icon,n,t,d]) => <article className="feature-card" key={n}><span className="feature-number">{n}</span><div className="feature-icon"><Icon/></div><h3>{t}</h3><p>{d}</p><span className="feature-link">Learn more <ArrowRight size={15}/></span></article>)}</div></section>
      <section className="how-section" id="how"><div className="how-copy"><div className="section-kicker">HOW IT WORKS</div><h2>Your habits become<br/><em>your advantage.</em></h2><p>Temper learns quietly in the background while every important decision stays visible and reversible.</p></div><div className="steps">{steps.map(([title,text],i) => <div className="step" key={title}><span>0{i+1}</span><div><h3>{title}</h3><p>{text}</p></div>{i < 2 && <div className="step-line"/>}</div>)}</div></section>
      <section className="privacy" id="privacy"><div className="privacy-badge"><ShieldCheck/></div><div><div className="section-kicker">PRIVATE BY DESIGN</div><h2>Your style. Your data.<br/>Your decision.</h2></div><div className="privacy-copy"><p>Memory should earn your trust. See why every preference was learned, choose what stays, and wipe everything whenever you want.</p><div className="privacy-points"><span><Check/> Transparent memory</span><span><Check/> Granular controls</span><span><Check/> One-click delete</span></div></div></section>
      <section className="faq-section"><div><div className="section-kicker">QUESTIONS</div><h2>The useful details.</h2></div><div className="faqs">{[["What does Temper remember?","Only the working preferences that help your AI respond better—like language choices, architecture patterns, and communication style."],["Does it replace my coding assistant?","No. Temper is a portable preference layer designed to make the tools you already use feel more personal."],["Can I turn memory off?","Yes. Pause learning at any time, lock individual preferences, or delete your profile completely."]].map(([q,a],i) => <button className={`faq ${openFaq===i?'open':''}`} onClick={() => setOpenFaq(openFaq===i?-1:i)} key={q} aria-expanded={openFaq===i}><span>{q}</span><ChevronDown/>{openFaq===i && <p>{a}</p>}</button>)}</div></section>
      <section className="cta" id="cta"><div className="cta-flame"><Flame/></div><div className="section-kicker">BE FIRST IN LINE</div><h2>Build with an AI that<br/><em>already gets you.</em></h2><p>Join the early access list and help shape the memory layer for modern software teams.</p><form onSubmit={e=>e.preventDefault()}><label className="sr-only" htmlFor="email">Work email</label><input id="email" type="email" placeholder="you@company.com" required/><button>Request access <ArrowRight size={17}/></button></form><small>Thoughtful updates only. No noise.</small></section>
    </main>
    <footer><button className="brand" onClick={() => scrollTo("top")}><span className="brand-mark"><img src="/assets/phoenix.png" alt=""/></span><span>temper<span className="brand-dot">.</span></span></button><p>AI that learns how you work.</p><span>© 2026 Temper Labs</span></footer>
  </div>;
}
createRoot(document.getElementById("root")!).render(<React.StrictMode><App/></React.StrictMode>);
