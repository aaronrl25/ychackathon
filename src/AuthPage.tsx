import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Flame, LockKeyhole, Mail, UserRound } from "lucide-react";
import { auth, isFirebaseConfigured } from "./firebase";

type Props = {
  initialMode: "login" | "signup";
  onBack: () => void;
  onRegistered?: () => void;
};

function friendlyError(code?: string) {
  if (code?.includes("invalid-credential")) return "That email or password doesn’t look right.";
  if (code?.includes("email-already-in-use")) return "An account already exists for this email.";
  if (code?.includes("weak-password")) return "Use at least 6 characters for your password.";
  if (code?.includes("invalid-email")) return "Enter a valid email address.";
  if (code?.includes("too-many-requests")) return "Too many attempts. Please wait a moment and try again.";
  return "Something went wrong. Please try again.";
}

export function AuthPage({ initialMode, onBack, onRegistered }: Props) {
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!auth) { setError("Firebase isn’t configured yet. Add the VITE_FIREBASE_* values to .env."); return; }
    setLoading(true); setError("");
    try {
      if (mode === "signup") {
        const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(result.user, { displayName: name.trim() });
        onRegistered?.();
      } else await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e) { setError(friendlyError((e as { code?: string }).code)); setLoading(false); }
  };

  const switchMode = () => { setMode(mode === "login" ? "signup" : "login"); setError(""); };
  return <main className="auth-layout">
    <section className="auth-story"><button className="auth-back" onClick={onBack}><ArrowLeft size={16}/> Back to home</button><div className="auth-story-inner"><span className="brand-mark auth-logo"><Flame/></span><p className="auth-quote">“Temper remembers the little decisions, so I can stay focused on the big ones.”</p><div className="auth-person"><span>MK</span><div><b>Maya Kim</b><small>Staff engineer</small></div></div></div><div className="auth-grid"/></section>
    <section className="auth-form-wrap"><div className="auth-form-card"><div className="mobile-auth-brand"><span className="brand-mark"><Flame size={18}/></span> temper<span>.</span></div><div className="auth-kicker"><LockKeyhole size={14}/> SECURE ACCESS</div><h1>{mode === "login" ? "Welcome back." : "Create your profile."}</h1><p>{mode === "login" ? "Sign in to continue to your Temper workspace." : "Start building with an AI that learns how you work."}</p>
      {!isFirebaseConfigured && <div className="config-note">Firebase configuration is required before sign-in can work.</div>}
      <form className="auth-form" onSubmit={submit}>
        {mode === "signup" && <label>Full name<div className="input-shell"><UserRound/><input value={name} onChange={e=>setName(e.target.value)} placeholder="Alex Morgan" required autoComplete="name"/></div></label>}
        <label>Email address<div className="input-shell"><Mail/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" required autoComplete="email"/></div></label>
        <label>Password<div className="input-shell"><LockKeyhole/><input type={showPassword ? "text" : "password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 6 characters" minLength={6} required autoComplete={mode === "login" ? "current-password" : "new-password"}/><button type="button" onClick={()=>setShowPassword(!showPassword)} aria-label="Show password">{showPassword?<EyeOff/>:<Eye/>}</button></div></label>
        {error && <div className="auth-error" role="alert">{error}</div>}
        <button className="auth-submit" disabled={loading}>{loading ? "Please wait…" : mode === "login" ? "Continue to panel" : "Create account"}<ArrowRight size={17}/></button>
      </form>
      <div className="auth-switch">{mode === "login" ? "New to Temper?" : "Already have an account?"}<button onClick={switchMode}>{mode === "login" ? "Create an account" : "Sign in"}</button></div>
      <small className="auth-legal">By continuing, you agree to Temper’s Terms and Privacy Policy.</small>
    </div></section>
  </main>;
}
