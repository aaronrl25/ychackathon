import { useState, type ComponentType, type FormEvent } from "react";
import { signOut, type User } from "firebase/auth";
import {
  Archive,
  ArrowUp,
  BrainCircuit,
  Check,
  ChevronRight,
  Code2,
  Flame,
  Globe2,
  Lock,
  LogOut,
  MessageSquareCode,
  MoreHorizontal,
  Palette,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react";
import { auth } from "./firebase";
import "./phoenix.css";
import poseNeutral from "../assets/01_neutral-removebg-preview.png";
import poseFocused from "../assets/03_focused-removebg-preview.png";
import poseThinking from "../assets/06_thinking-removebg-preview.png";
import poseExplaining from "../assets/07_explaining-removebg-preview.png";
import poseLearning from "../assets/08_learning-removebg-preview.png";
import poseResting from "../assets/10_resting-removebg-preview.png";

type Page =
  "overview" | "memory" | "sessions" | "phoenix" | "personalizer" | "chat" | "settings";
type Icon = ComponentType<{ size?: number }>;
type CustomMD = { name: string; tone: string; color: string; pose: number };
type SoulMessage = { role: "user" | "assistant"; content: string };
const apiUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:8787" : "");
const preferences = [
  {
    name: "TypeScript first",
    detail: "Prefer TypeScript for new files and examples",
    scope: "Global",
    confidence: 98,
    evidence: "18 signals",
  },
  {
    name: "Functional components",
    detail: "Use hooks and functional React components",
    scope: "Global",
    confidence: 94,
    evidence: "12 signals",
  },
  {
    name: "Compact explanations",
    detail: "Lead with the result and keep prose concise",
    scope: "Global",
    confidence: 89,
    evidence: "9 signals",
  },
  {
    name: "Tests alongside changes",
    detail: "Add focused tests when behavior changes",
    scope: "Project",
    confidence: 84,
    evidence: "7 signals",
  },
  {
    name: "Early returns",
    detail: "Reduce nesting with guard clauses",
    scope: "Project",
    confidence: 78,
    evidence: "5 signals",
  },
];
const sessions = [
  {
    title: "Refactor authentication flow",
    project: "acme/web-app",
    time: "12 min ago",
    messages: 18,
    status: "Active",
  },
  {
    title: "Add repository search filters",
    project: "temper/dashboard",
    time: "Yesterday",
    messages: 31,
    status: "Complete",
  },
  {
    title: "Review payments webhook",
    project: "acme/api",
    time: "Aug 21",
    messages: 14,
    status: "Complete",
  },
  {
    title: "Design onboarding state",
    project: "temper/dashboard",
    time: "Aug 19",
    messages: 26,
    status: "Archived",
  },
];

function Heading({
  eyebrow,
  title,
  copy,
  action,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="panel-page-heading">
      <div>
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <span>{copy}</span>
      </div>
      {action}
    </header>
  );
}
function Overview({ name, go }: { name: string; go: (p: Page) => void }) {
  return (
    <>
      <Heading
        eyebrow="WORKSPACE"
        title={`Good to see you, ${name.split(" ")[0]}.`}
        copy="Here’s what Temper has learned from your recent work."
        action={
          <button className="panel-primary">
            <Plus /> New session
          </button>
        }
      />
      <section className="panel-stats">
        <article>
          <span>
            <BrainCircuit />
          </span>
          <div>
            <b>6</b>
            <small>Learned preferences</small>
          </div>
        </article>
        <article>
          <span>
            <Check />
          </span>
          <div>
            <b>24</b>
            <small>Accepted patterns</small>
          </div>
        </article>
        <article>
          <span>
            <Code2 />
          </span>
          <div>
            <b>3</b>
            <small>Connected projects</small>
          </div>
        </article>
      </section>
      <section className="panel-grid">
        <article className="panel-card">
          <div className="panel-card-head">
            <div>
              <p>YOUR MEMORY</p>
              <h2>Active preferences</h2>
            </div>
            <button onClick={() => go("memory")}>View all</button>
          </div>
          {preferences.slice(0, 4).map((p) => (
            <div className="panel-pref" key={p.name}>
              <span className="panel-check">
                <Check />
              </span>
              <div>
                <b>{p.name}</b>
                <small>{p.scope}</small>
              </div>
              <div className="confidence">
                <i style={{ width: `${p.confidence}%` }} />
              </div>
              <em>{p.confidence}%</em>
            </div>
          ))}
        </article>
        <article className="panel-card">
          <div className="panel-card-head">
            <div>
              <p>RECENT ACTIVITY</p>
              <h2>Latest signals</h2>
            </div>
          </div>
          {[
            [Check, "Early returns accepted", "acme / web-app · 12 min ago"],
            [
              BrainCircuit,
              "Preference strengthened",
              "TypeScript first · Yesterday",
            ],
            [Code2, "Project connected", "design-system · 3 days ago"],
          ].map(([A, b, c]) => {
            const ActivityIcon = A as Icon;
            return (
              <div className="activity" key={String(b)}>
                <span>
                  <ActivityIcon />
                </span>
                <div>
                  <b>{String(b)}</b>
                  <small>{String(c)}</small>
                </div>
              </div>
            );
          })}
        </article>
      </section>
    </>
  );
}

function MemoryPage() {
  const [q, setQ] = useState("");
  const [enabled, setEnabled] = useState(true);
  const shown = preferences.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <Heading
        eyebrow="MEMORY"
        title="What Temper knows."
        copy="Review learned preferences. You always control what stays."
        action={
          <button className="panel-primary">
            <Plus /> Add preference
          </button>
        }
      />
      <section className="memory-summary">
        <div>
          <BrainCircuit />
          <span>
            <b>{preferences.length} active memories</b>
            <small>Applied automatically in every session</small>
          </span>
        </div>
        <label>
          <span>{enabled ? "Memory on" : "Memory paused"}</span>
          <button
            className={`panel-toggle ${enabled ? "on" : ""}`}
            onClick={() => setEnabled(!enabled)}
          >
            <i />
          </button>
        </label>
      </section>
      <div className="panel-toolbar">
        <label>
          <Search />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search memories…"
          />
        </label>
        <button>
          <SlidersHorizontal /> Filter
        </button>
      </div>
      <section className="memory-list">
        <div className="memory-list-head">
          <span>Preference</span>
          <span>Scope</span>
          <span>Confidence</span>
          <span>Evidence</span>
          <span />
        </div>
        {shown.map((p) => (
          <article key={p.name}>
            <div>
              <span className="memory-icon">
                <Check />
              </span>
              <span>
                <b>{p.name}</b>
                <small>{p.detail}</small>
              </span>
            </div>
            <em className={p.scope === "Project" ? "project" : ""}>
              {p.scope}
            </em>
            <div className="memory-confidence">
              <span>
                <i style={{ width: `${p.confidence}%` }} />
              </span>
              <b>{p.confidence}%</b>
            </div>
            <small>{p.evidence}</small>
            <button>
              <MoreHorizontal />
            </button>
          </article>
        ))}
      </section>
      <aside className="privacy-strip">
        <ShieldCheck />
        <div>
          <b>Your memory is private and reversible.</b>
          <small>Every preference can be edited or removed at any time.</small>
        </div>
        <button>
          Privacy controls <ChevronRight />
        </button>
      </aside>
    </>
  );
}

function SessionsPage() {
  const [filter, setFilter] = useState("All");
  const shown =
    filter === "All" ? sessions : sessions.filter((s) => s.status === filter);
  return (
    <>
      <Heading
        eyebrow="SESSIONS"
        title="Your conversations."
        copy="Resume recent work or revisit earlier decisions."
        action={
          <button className="panel-primary">
            <Plus /> New session
          </button>
        }
      />
      <div className="session-controls">
        <div>
          {["All", "Active", "Complete", "Archived"].map((x) => (
            <button
              key={x}
              className={filter === x ? "active" : ""}
              onClick={() => setFilter(x)}
            >
              {x}
            </button>
          ))}
        </div>
        <label>
          <Search />
          <input placeholder="Search sessions…" />
        </label>
      </div>
      <section className="session-list">
        {shown.map((s, i) => (
          <article key={s.title}>
            <span className="session-icon">
              {i === 0 ? <Sparkles /> : <MessageSquareCode />}
            </span>
            <div>
              <b>{s.title}</b>
              <small>
                <Code2 /> {s.project}
              </small>
            </div>
            <span className={`session-status ${s.status.toLowerCase()}`}>
              {s.status}
            </span>
            <span className="session-meta">
              {s.messages} messages<small>{s.time}</small>
            </span>
            <button>
              <ChevronRight />
            </button>
          </article>
        ))}
      </section>
    </>
  );
}

const poses = [
  ["Neutral", poseNeutral],
  ["Focused", poseFocused],
  ["Thinking", poseThinking],
  ["Explaining", poseExplaining],
  ["Learning", poseLearning],
  ["Resting", poseResting],
] as const;
function PersonalizerPage({ onCreate }: { onCreate: (md: CustomMD) => void }) {
  const [name, setName] = useState("Ember");
  const [pose, setPose] = useState(0);
  const [tone, setTone] = useState("Frontend Developer");
  const [color, setColor] = useState("#ff6b32");
  const create = () =>
    onCreate({ name: name.trim() || "Ember", tone, color, pose });
  return (
    <>
      <Heading
        eyebrow="MD PERSONALIZER"
        title="Create your own MD."
        copy="Shape a coding companion with its own name, voice, color, and expressions."
        action={
          <button className="panel-primary" onClick={create}>
            <Sparkles /> Save MD
          </button>
        }
      />
      <section
        className="personalizer-shell"
        style={{ "--md-color": color } as React.CSSProperties}
      >
        <div className="pose-orbit">
          <div className="orbit-ring one" />
          <div className="orbit-ring two" />
          {poses.map(([label, image], i) => (
            <button
              key={label}
              className={`orbit-pose pose-${i} ${pose === i ? "selected" : ""}`}
              onClick={() => setPose(i)}
              title={label}
            >
              <img src={image} alt={`${label} pose`} />
              <span>{label}</span>
            </button>
          ))}
          <div className="md-stage">
            <span className="stage-glow" />
            <img src={poses[pose][1]} alt={`${name}, ${poses[pose][0]} pose`} />
            <div>
              <i />
              <span>
                <b>{name}</b>
                <small>{poses[pose][0]} mode</small>
              </span>
            </div>
          </div>
        </div>
        <aside className="personalizer-controls">
          <div className="personalizer-kicker">
            <Palette /> CHARACTER STUDIO
          </div>
          <h2>Make it feel like yours.</h2>
          <p>
            These choices shape how your MD looks and communicates during a
            session.
          </p>
          <label>
            MD name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={18}
            />
          </label>
          <label>
            Personality
            <select value={tone} onChange={(e) => setTone(e.target.value)}>
              <option>Frontend Developer</option>
              <option>Backend Developer</option>
              <option>Mobile Developer</option>
              <option>Full-Stack Developer</option>
              <option>DevOps Engineer</option>
            </select>
          </label>
          <label>
            Ember color
            <div className="color-options">
              {["#ff6b32", "#a879ff", "#ffb12b", "#56cfa0", "#5f9cff"].map(
                (c) => (
                  <button
                    type="button"
                    key={c}
                    className={color === c ? "active" : ""}
                    style={{ background: c }}
                    onClick={() => setColor(c)}
                    aria-label={`Choose ${c}`}
                  />
                ),
              )}
            </div>
          </label>
          <div className="voice-preview">
            <span>
              <MessageSquareCode />
            </span>
            <div>
              <b>{name} says</b>
              <p>
                {personalityPreview(tone)}
              </p>
            </div>
          </div>
          <button className="create-md" onClick={create}>
            <Sparkles /> Create {name || "MD"}
          </button>
        </aside>
      </section>
    </>
  );
}

function personalityPreview(tone: string) {
  const previews: Record<string, string> = {
    "Frontend Developer": "I’ll build a polished React interface with responsive styling and accessibility.",
    "Backend Developer": "I’ll design the API, data model, authentication, and server logic.",
    "Mobile Developer": "I’ll shape this for React Native, iOS, and Android devices.",
    "Full-Stack Developer": "I’ll connect the interface, backend, data, and deployment into one flow.",
    "DevOps Engineer": "I’ll focus on cloud infrastructure, CI/CD, deployment, and reliability.",
  };
  return previews[tone] || previews["Frontend Developer"];
}

function mdReply(md: CustomMD, prompt: string) {
  const topic = prompt.length > 75 ? "Thanks for the detailed context" : "I understand the task";
  const replies: Record<string, string> = {
    "Frontend Developer": "I’ll approach it through reusable React components, polished styling, responsive behavior, and accessibility.",
    "Backend Developer": "I’ll define the API contract, database model, validation, authentication, and reliable server behavior.",
    "Mobile Developer": "I’ll account for touch interactions, native navigation, device constraints, and both iOS and Android behavior.",
    "Full-Stack Developer": "I’ll implement the complete flow across the UI, API, database, authentication, and deployment boundary.",
    "DevOps Engineer": "I’ll design the deployment pipeline, cloud configuration, secrets, monitoring, rollback, and reliability checks.",
  };
  return `${topic}. ${replies[md.tone] || replies["Frontend Developer"]}`;
}
function ChatPage({ md, onEdit }: { md: CustomMD; onEdit: () => void }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "md"; text: string }[]
  >([
    {
      role: "md",
      text: `Hi, I’m ${md.name}. I’ll work with you as a ${md.tone.toLowerCase()}. What are we building today?`,
    },
  ]);
  const send = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [
      ...m,
      { role: "user", text },
      { role: "md", text: mdReply(md, text) },
    ]);
    setInput("");
  };
  return (
    <section
      className="md-chat"
      style={{ "--md-color": md.color } as React.CSSProperties}
    >
      <header>
        <div className="chat-md-avatar">
          <img src={poses[md.pose][1]} alt="" />
          <i />
        </div>
        <div>
          <b>{md.name}</b>
          <span>{md.tone} · online</span>
        </div>
        <button onClick={onEdit}>
          <Palette /> Edit personality
        </button>
      </header>
      <div className="md-chat-body">
        <div className="chat-welcome">
          <img src={poses[md.pose][1]} alt={md.name} />
          <h1>Chat with {md.name}</h1>
          <p>Your custom MD will answer in the personality you selected.</p>
        </div>
        {messages.map((m, i) => (
          <div className={`md-message ${m.role}`} key={i}>
            {m.role === "md" && (
              <span>
                <img src={poses[md.pose][1]} alt="" />
              </span>
            )}
            <div>
              <b>{m.role === "md" ? md.name : "You"}</b>
              <p>{m.text}</p>
            </div>
          </div>
        ))}
      </div>
      <form className="md-composer" onSubmit={send}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${md.name}…`}
          rows={2}
        />
        <footer>
          <span>
            <Sparkles /> {md.tone}
          </span>
          <button aria-label="Send message">
            <ArrowUp />
          </button>
        </footer>
      </form>
    </section>
  );
}

function PhoenixPage({ user }: { user: User }) {
  const name = user.displayName || user.email?.split("@")[0] || "Builder";
  const [messages, setMessages] = useState<SoulMessage[]>([{ role: "assistant", content: "I’m Phoenix, your Agent Architect. I’ll help you design an agent, then create its AGENTS.md. First: what project will this agent work on?" }]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const send = async (event: FormEvent) => {
    event.preventDefault();
    const content = prompt.trim();
    if (!content || loading) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next); setPrompt(""); setLoading(true); setError("");
    try {
      const response = await fetch(`${apiUrl}/api/soul-chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next, developerId: user.uid }) });
      const body = await response.json() as { message?: string; error?: string };
      if (!response.ok) throw new Error(body.error || "Phoenix is unavailable.");
      setMessages(current => [...current, { role: "assistant", content: body.message || "Please try again." }]);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Phoenix is unavailable."); }
    finally { setLoading(false); }
  };
  return <><Heading eyebrow="PHOENIX · AGENT ARCHITECT" title="Interview. Refine. Generate AGENTS.md." copy="Phoenix asks focused questions, turns your answers into an agent brief, and writes the final document when you confirm it is ready."/><section className="soul-chat panel-card"><div className="panel-card-head"><div><p>AGENT DESIGN SESSION</p><h2>Build an agent with a point of view.</h2></div><span className="soul-status"><i/> OpenAI connected</span></div><div className="soul-messages" aria-live="polite">{messages.map((message,index)=><article className={`soul-message ${message.role}`} key={`${message.role}-${index}`}><span>{message.role === "assistant" ? <Flame/> : name.slice(0,2).toUpperCase()}</span><p>{message.content}</p></article>)}{loading && <article className="soul-message assistant pending"><span><Flame/></span><p>Phoenix is shaping the next question…</p></article>}</div>{error && <p className="soul-error" role="alert">{error}</p>}<form className="soul-composer" onSubmit={send}><textarea value={prompt} onChange={event=>setPrompt(event.target.value)} placeholder="Answer Phoenix, or describe your project…" rows={3}/><footer><small>When you’re ready, ask Phoenix to generate AGENTS.md.</small><button disabled={loading || !prompt.trim()}>{loading ? "Thinking…" : <>Send to Phoenix <ArrowUp/></>}</button></footer></form></section></>;
}

function SettingsPage({ user }: { user: User }) {
  const [signals, setSignals] = useState(true);
  const [projects, setProjects] = useState(true);
  return (
    <>
      <Heading
        eyebrow="SETTINGS"
        title="Make Temper yours."
        copy="Manage your profile, memory behavior, and connected tools."
      />
      <div className="settings-layout">
        <nav>
          <button className="active">
            <UserRound /> Profile
          </button>
          <button>
            <BrainCircuit /> Memory
          </button>
          <button>
            <Globe2 /> Integrations
          </button>
          <button>
            <Lock /> Privacy
          </button>
        </nav>
        <div className="settings-content">
          <section className="settings-card">
            <header>
              <h2>Profile</h2>
              <p>Your personal details and workspace identity.</p>
            </header>
            <div className="profile-editor">
              <span>
                {(user.displayName || "BU").slice(0, 2).toUpperCase()}
              </span>
              <div>
                <b>{user.displayName || "Builder"}</b>
                <small>{user.email}</small>
              </div>
              <button>Change avatar</button>
            </div>
            <div className="settings-fields">
              <label>
                Display name
                <input defaultValue={user.displayName || "Builder"} />
              </label>
              <label>
                Email address
                <input defaultValue={user.email || ""} disabled />
              </label>
            </div>
            <button className="save-settings">Save changes</button>
          </section>
          <section className="settings-card">
            <header>
              <h2>Memory behavior</h2>
              <p>Choose how Temper learns during your sessions.</p>
            </header>
            {[
              [
                "Learn from accepted suggestions",
                "Strengthen preferences when you approve generated changes.",
                signals,
                () => setSignals(!signals),
              ],
              [
                "Project-specific memory",
                "Keep repository conventions separate from global preferences.",
                projects,
                () => setProjects(!projects),
              ],
            ].map(([a, b, on, toggle]) => (
              <div className="setting-row" key={String(a)}>
                <div>
                  <b>{String(a)}</b>
                  <small>{String(b)}</small>
                </div>
                <button
                  className={`panel-toggle ${on ? "on" : ""}`}
                  onClick={toggle as () => void}
                >
                  <i />
                </button>
              </div>
            ))}
          </section>
          <section className="settings-card danger-card">
            <header>
              <h2>Data controls</h2>
              <p>Export or permanently remove your Temper memory.</p>
            </header>
            <div className="danger-actions">
              <button>
                <Archive /> Export my data
              </button>
              <button>
                <Trash2 /> Delete all memory
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export function Panel({ user }: { user: User }) {
  const name = user.displayName || user.email?.split("@")[0] || "Builder";
  const [page, setPage] = useState<Page>("overview");
  const [customMD, setCustomMD] = useState<CustomMD | null>(() => {
    try {
      const saved = localStorage.getItem("temper:custom-md");
      return saved ? (JSON.parse(saved) as CustomMD) : null;
    } catch {
      return null;
    }
  });
  const items: [Page, string, Icon][] = [
    ["overview", "Overview", Sparkles],
    ["memory", "Memory", BrainCircuit],
    ["sessions", "Sessions", MessageSquareCode],
    ["phoenix", "Phoenix", Flame],
    ["personalizer", "Personalizer", Palette],
    ...(customMD ? ([["chat", customMD.name, MessageSquareCode]] as [Page, string, Icon][]) : []),
    ["settings", "Settings", Settings],
  ];
  const createMD = (md: CustomMD) => {
    setCustomMD(md);
    localStorage.setItem("temper:custom-md", JSON.stringify(md));
    setPage("chat");
  };
  return (
    <div className="panel-shell">
      <aside className="panel-sidebar">
        <div className="panel-brand">
          <span className="brand-mark">
            <Flame size={18} />
          </span>{" "}
          temper<span>.</span>
        </div>
        <nav>
          {items.map(([id, label, NavIcon]) => (
            <button
              key={id}
              className={page === id ? "active" : ""}
              onClick={() => setPage(id)}
            >
              <NavIcon /> {label}
            </button>
          ))}
        </nav>
        <div className="panel-user">
          <span>{name.slice(0, 2).toUpperCase()}</span>
          <div>
            <b>{name}</b>
            <small>{user.email}</small>
          </div>
          <button onClick={() => auth && signOut(auth)}>
            <LogOut />
          </button>
        </div>
      </aside>
      <main className={`panel-main ${page === "chat" ? "chat-main" : ""}`}>
        {page === "phoenix" && <PhoenixPage user={user} />}
        {page === "overview" && <Overview name={name} go={setPage} />}{" "}
        {page === "memory" && <MemoryPage />}{" "}
        {page === "sessions" && <SessionsPage />}{" "}
        {page === "personalizer" && <PersonalizerPage onCreate={createMD} />}{" "}
        {page === "chat" && customMD && (
          <ChatPage md={customMD} onEdit={() => setPage("personalizer")} />
        )}{" "}
        {page === "settings" && <SettingsPage user={user} />}
      </main>
    </div>
  );
}
