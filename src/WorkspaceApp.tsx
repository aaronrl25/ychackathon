import { useEffect, useState, type FormEvent } from "react";
import type { User } from "firebase/auth";
import { signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  BrowserRouter,
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Check,
  ChevronRight,
  Code2,
  Edit3,
  Flame,
  LogOut,
  Menu,
  MessageSquareCode,
  Plus,
  Send,
  Settings2,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { auth, db } from "./firebase";
import frontend from "../assets/01_neutral-removebg-preview.png";
import backend from "../assets/03_focused-removebg-preview.png";
import mobile from "../assets/06_thinking-removebg-preview.png";
import fullstack from "../assets/07_explaining-removebg-preview.png";
import devops from "../assets/08_learning-removebg-preview.png";
import "./workspace.css";

type Role = {
  id: string;
  name: string;
  description: string;
  image: string;
  color: string;
};
const roles: Role[] = [
  {
    id: "frontend",
    name: "Frontend",
    description:
      "UI, React, styling, accessibility, and polished interactions.",
    image: frontend,
    color: "#ff6437",
  },
  {
    id: "backend",
    name: "Backend",
    description: "APIs, databases, authentication, and secure server logic.",
    image: backend,
    color: "#a879ff",
  },
  {
    id: "mobile",
    name: "Mobile",
    description: "React Native, iOS, Android, and touch-first experiences.",
    image: mobile,
    color: "#4fa3ff",
  },
  {
    id: "fullstack",
    name: "Full-Stack",
    description: "Complete features across frontend, backend, and data.",
    image: fullstack,
    color: "#ffad32",
  },
  {
    id: "devops",
    name: "DevOps",
    description: "Cloud, deployment, CI/CD, monitoring, and reliability.",
    image: devops,
    color: "#54d4a0",
  },
];
const preferenceGroups = {
  Languages: ["TypeScript", "JavaScript", "Python", "Go", "Rust"],
  Frameworks: ["React", "Next.js", "Vue", "Express", "FastAPI"],
  Architecture: [
    "Feature-based",
    "Clean Architecture",
    "MVC",
    "Serverless",
    "Microservices",
  ],
  "State management": [
    "React Context",
    "Zustand",
    "Redux Toolkit",
    "TanStack Query",
  ],
  Testing: ["Vitest", "Jest", "Playwright", "Cypress"],
  "Response style": [
    "Concise",
    "Explain trade-offs",
    "Diff first",
    "Step by step",
  ],
};

function Layout({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="wa-shell">
      <aside className={open ? "open" : ""}>
        <div className="wa-brand">
          <span>
            <Flame />
          </span>
          <b>Phoenix</b>
          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>
        <nav>
          {[
            ["/choose", Sparkles, "Choose Phoenix"],
            ["/preferences", Settings2, "Preferences"],
            ["/workspace", MessageSquareCode, "Coding Workspace"],
            ["/learned", BrainCircuit, "Learned"],
          ].map(([to, I, label]) => {
            const Icon = I as typeof Sparkles;
            return (
              <NavLink
                to={String(to)}
                key={String(to)}
                onClick={() => setOpen(false)}
              >
                <Icon />
                {String(label)}
              </NavLink>
            );
          })}
        </nav>
        <div className="wa-user">
          <span>
            {(user.displayName || user.email || "U").slice(0, 2).toUpperCase()}
          </span>
          <div>
            <b>{user.displayName || "Developer"}</b>
            <small>{user.email}</small>
          </div>
          <button onClick={() => auth && signOut(auth)}>
            <LogOut />
          </button>
        </div>
      </aside>
      <main>
        <button className="wa-menu" onClick={() => setOpen(true)}>
          <Menu />
        </button>
        <Routes>
          <Route path="/choose" element={<Choose user={user} />} />
          <Route path="/preferences" element={<Preferences user={user} />} />
          <Route path="/workspace" element={<Workspace user={user} />} />
          <Route path="/learned" element={<Learned user={user} />} />
          <Route path="*" element={<Navigate to="/choose" replace />} />
        </Routes>
      </main>
    </div>
  );
}
function Head({
  step,
  title,
  copy,
}: {
  step: string;
  title: string;
  copy: string;
}) {
  return (
    <header className="wa-head">
      <span>{step}</span>
      <h1>{title}</h1>
      <p>{copy}</p>
    </header>
  );
}

function Choose({ user }: { user: User }) {
  const nav = useNavigate();
  const [saved, setSaved] = useState(
    localStorage.getItem("phoenix:role") || "frontend",
  );
  const choose = async (role: Role) => {
    setSaved(role.id);
    localStorage.setItem("phoenix:role", role.id);
    if (db)
      await setDoc(
        doc(db, "users", user.uid),
        { phoenixRole: role.id },
        { merge: true },
      );
  };
  return (
    <div className="wa-page">
      <Head
        step="01 · PHOENIX"
        title="Choose your Phoenix."
        copy="Select the specialist that best matches what you’re building. You can switch anytime."
      />
      <section className="role-grid">
        {roles.map((r) => (
          <button
            key={r.id}
            className={saved === r.id ? "selected" : ""}
            style={{ "--role": r.color } as React.CSSProperties}
            onClick={() => choose(r)}
          >
            <span className="role-check">
              <Check />
            </span>
            <div>
              <i />
              <img src={r.image} alt={`${r.name} Phoenix`} />
            </div>
            <h2>{r.name}</h2>
            <p>{r.description}</p>
          </button>
        ))}
      </section>
      <footer className="wa-actions">
        <button onClick={() => nav("/preferences")}>
          Continue to preferences <ArrowRight />
        </button>
      </footer>
    </div>
  );
}

function Preferences({ user }: { user: User }) {
  const nav = useNavigate();
  const [values, setValues] = useState<Record<string, string[]>>(() => {
    try {
      return JSON.parse(localStorage.getItem("phoenix:preferences") || "{}");
    } catch {
      return {};
    }
  });
  const toggle = (group: string, value: string) =>
    setValues((v) => ({
      ...v,
      [group]: v[group]?.includes(value)
        ? v[group].filter((x) => x !== value)
        : [...(v[group] || []), value],
    }));
  const save = async () => {
    localStorage.setItem("phoenix:preferences", JSON.stringify(values));
    if (db)
      await setDoc(
        doc(db, "users", user.uid),
        { preferences: values },
        { merge: true },
      );
    nav("/workspace");
  };
  return (
    <div className="wa-page narrow">
      <Head
        step="02 · YOUR DEFAULTS"
        title="Set developer preferences."
        copy="Phoenix uses these defaults to generate code that feels like yours from the first message."
      />
      <div className="pref-groups">
        {Object.entries(preferenceGroups).map(([group, options]) => (
          <section key={group}>
            <header>
              <h2>{group}</h2>
              <small>{values[group]?.length || 0} selected</small>
            </header>
            <div>
              {options.map((option) => (
                <button
                  className={values[group]?.includes(option) ? "selected" : ""}
                  onClick={() => toggle(group, option)}
                  key={option}
                >
                  {values[group]?.includes(option) && <Check />}
                  {option}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
      <footer className="wa-actions">
        <button onClick={save}>
          Save and open workspace <ArrowRight />
        </button>
      </footer>
    </div>
  );
}

type ChatMessage = { role: "user" | "ai"; text: string; code?: string };
function Workspace({ user }: { user: User }) {
  const [repo, setRepo] = useState(localStorage.getItem("phoenix:repo") || "");
  const [repoInput, setRepoInput] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      text: "I’m connected to your preferences. Connect a repository or tell me what you want to build.",
    },
  ]);
  const role = roles.find(
    (r) => r.id === (localStorage.getItem("phoenix:role") || "frontend"),
  )!;
  const connect = (e: FormEvent) => {
    e.preventDefault();
    const value = repoInput.trim().replace("https://github.com/", "");
    if (value) {
      setRepo(value);
      localStorage.setItem("phoenix:repo", value);
    }
  };
  const send = async (e: FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q || loading) return;
    const preferenceValues = Object.values(
      JSON.parse(localStorage.getItem("phoenix:preferences") || "{}") as Record<
        string,
        string[]
      >,
    ).flat();
    const nextMessages: ChatMessage[] = [...messages, { role: "user", text: q }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:8787" : "")}/api/phoenix-chat`,
        {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, role: role.id, repository: repo, preferences: preferenceValues }),
        },
      );
      const data = await response.json() as { message?: string; error?: string };
      if (!response.ok) throw new Error(data.error || "Phoenix could not answer.");
      setMessages((m) => [...m, { role: "ai", text: data.message || "I couldn’t produce a response." }]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Phoenix could not answer.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="workspace-page">
      <header>
        <div
          className="workspace-role"
          style={{ "--role": role.color } as React.CSSProperties}
        >
          <img src={role.image} />
          <div>
            <b>{role.name} Phoenix</b>
            <small>{repo ? repo : "No repository connected"}</small>
          </div>
        </div>
        {repo && (
          <button className="repo-pill">
              <Code2 />
            {repo}
            <X
              onClick={() => {
                setRepo("");
                localStorage.removeItem("phoenix:repo");
              }}
            />
          </button>
        )}
      </header>
      {!repo && (
        <form className="connect-card" onSubmit={connect}>
          <span>
          <Code2 />
          </span>
          <div>
            <h2>Connect a GitHub repository</h2>
            <p>
              Give Phoenix project context for more relevant code suggestions.
            </p>
            <label>
              <input
                value={repoInput}
                onChange={(e) => setRepoInput(e.target.value)}
                placeholder="owner/repository"
              />
              <button>Connect</button>
            </label>
          </div>
        </form>
      )}
      <div className="chat-stream">
        {messages.map((m, i) => (
          <article className={m.role} key={i}>
            {m.role === "ai" && (
              <span className="ai-avatar">
                <img src={role.image} />
              </span>
            )}
            <div>
              <b>{m.role === "ai" ? `${role.name} Phoenix` : "You"}</b>
              <p>{m.text}</p>
              {m.code && (
                <pre>
                  <code>{m.code}</code>
                </pre>
              )}
            </div>
          </article>
        ))}
        {loading && <article className="ai phoenix-thinking"><span className="ai-avatar"><img src={mobile}/></span><div><b>{role.name} Phoenix is thinking</b><div className="thinking-card"><img src={fullstack}/><span><i/><i/><i/></span><small>Reading your request and applying your preferences…</small></div></div></article>}
        {error && <div className="chat-error">{error}</div>}
      </div>
      <form className="wa-composer" onSubmit={send}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ${role.name} Phoenix to build or change code…`}
        />
        <footer>
          <span>
            <Code2 /> {repo || "Connect a repository for context"}
          </span>
          <button disabled={loading}>
            <Send />
          </button>
        </footer>
      </form>
    </div>
  );
}

type LearnedItem = {
  id: string;
  title: string;
  detail: string;
  scope: string;
  approved: boolean;
};
const demoLearned: LearnedItem[] = [
  {
    id: "demo-1",
    title: "Prefer early returns",
    detail: "Avoid nested conditionals when a guard clause is clearer.",
    scope: "All projects",
    approved: true,
  },
  {
    id: "demo-2",
    title: "Use explicit prop types",
    detail: "Define named TypeScript types for public component props.",
    scope: "All projects",
    approved: true,
  },
  {
    id: "demo-3",
    title: "Keep explanations compact",
    detail: "Lead with the outcome, then include only essential context.",
    scope: "temper/dashboard",
    approved: false,
  },
];
function Learned({ user }: { user: User }) {
  const [items, setItems] = useState<LearnedItem[]>(demoLearned);
  useEffect(() => {
    if (!db) return;
    return onSnapshot(
      collection(db, "users", user.uid, "learnedPreferences"),
      (snap) => {
        if (!snap.empty)
          setItems(
            snap.docs.map((d) => ({ id: d.id, ...d.data() }) as LearnedItem),
          );
      },
    );
  }, [user.uid]);
  const patch = async (id: string, data: Partial<LearnedItem>) => {
    setItems((v) => v.map((x) => (x.id === id ? { ...x, ...data } : x)));
    if (db && !id.startsWith("demo"))
      await updateDoc(
        doc(db, "users", user.uid, "learnedPreferences", id),
        data,
      );
  };
  const remove = async (id: string) => {
    setItems((v) => v.filter((x) => x.id !== id));
    if (db && !id.startsWith("demo"))
      await deleteDoc(doc(db, "users", user.uid, "learnedPreferences", id));
  };
  const add = async () => {
    const item = {
      title: "New learned preference",
      detail: "Click edit to describe this preference.",
      scope: "All projects",
      approved: false,
    };
    if (db)
      await addDoc(
        collection(db, "users", user.uid, "learnedPreferences"),
        item,
      );
    else setItems((v) => [...v, { id: crypto.randomUUID(), ...item }]);
  };
  return (
    <div className="wa-page narrow">
      <Head
        step="04 · MEMORY"
        title="Learned preferences."
        copy="Phoenix learns from your corrections. Approve what’s useful and control exactly where it applies."
      />
      <div className="learn-toolbar">
        <span>
          <BrainCircuit />
          {items.filter((x) => x.approved).length} approved preferences
        </span>
        <button onClick={add}>
          <Plus /> Add preference
        </button>
      </div>
      <section className="learn-list">
        {items.map((item) => (
          <article key={item.id}>
            <button
              className={`approve ${item.approved ? "on" : ""}`}
              onClick={() => patch(item.id, { approved: !item.approved })}
            >
              <Check />
            </button>
            <div>
              <input
                value={item.title}
                onChange={(e) => patch(item.id, { title: e.target.value })}
              />
              <textarea
                value={item.detail}
                onChange={(e) => patch(item.id, { detail: e.target.value })}
              />
              <label>
                Apply to{" "}
                <select
                  value={item.scope}
                  onChange={(e) => patch(item.id, { scope: e.target.value })}
                >
                  <option>All projects</option>
                  <option>temper/dashboard</option>
                  <option>acme/web-app</option>
                  <option>This session only</option>
                </select>
              </label>
            </div>
            <div className="learn-actions">
              <button title="Edit">
                <Edit3 />
              </button>
              <button title="Delete" onClick={() => remove(item.id)}>
                <Trash2 />
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export function WorkspaceApp({ user }: { user: User }) {
  return (
    <BrowserRouter>
      <Layout user={user} />
    </BrowserRouter>
  );
}
