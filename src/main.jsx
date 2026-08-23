import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Brain, ChevronDown, CircleUserRound, Code2, Files, GitBranch, History, MessageSquareText, PanelLeftClose, Play, Plus, Search, Send, Settings2, Sparkles, TerminalSquare, X, Zap } from 'lucide-react'
import './styles.css'

const preferences = [
  ['TypeScript first', 'Always'],
  ['Functional style', 'Strong'],
  ['Compact answers', 'Preferred'],
  ['Tests with changes', 'Usually'],
]

const code = [
  [1, <><b className="pink">import</b> {'{ useState, useEffect }'} <b className="pink">from</b> <i>'react'</i>;</>],
  [2, ''],
  [3, <><b className="violet">type</b> <span className="cyan">User</span> = {'{'}</>],
  [4, <>  id: <span className="cyan">string</span>;</>],
  [5, <>  name: <span className="cyan">string</span>;</>],
  [6, <>  role: <span className="cyan">string</span>;</>],
  [7, '};'],
  [8, ''],
  [9, <><b className="pink">export default function</b> <span className="blue">UserList</span>() {'{'}</>],
  [10, <>  <b className="violet">const</b> [users, setUsers] = <span className="blue">useState</span>&lt;<span className="cyan">User</span>[]&gt;([]);</>],
  [11, <>  <b className="violet">const</b> [loading, setLoading] = <span className="blue">useState</span>(<b className="pink">true</b>);</>],
  [12, ''],
  [13, <>  <span className="blue">useEffect</span>(() =&gt; {'{'}</>],
  [14, <>    <span className="blue">fetch</span>(<i>'/api/users'</i>)</>],
  [15, <>      .<span className="blue">then</span>((res) =&gt; res.<span className="blue">json</span>())</>],
  [16, <>      .<span className="blue">then</span>((data) =&gt; {'{'}</>],
  [17, <>        <span className="blue">setUsers</span>(data);</>],
  [18, <>        <span className="blue">setLoading</span>(<b className="pink">false</b>);</>],
  [19, '      });'],
  [20, '  }, []);'],
  [21, ''],
  [22, <>  <b className="violet">if</b> (loading) <b className="violet">return</b> &lt;<span className="blue">Spinner</span> /&gt;;</>],
  [23, ''],
  [24, <>  <b className="violet">return</b> (</>],
  [25, <>    &lt;<span className="blue">div</span> className=<i>"user-list"</i>&gt;</>],
  [26, <>      {'{users.map((user) => ('}</>],
  [27, <>        &lt;<span className="blue">UserCard</span> key={'{user.id}'} user={'{user}'} /&gt;</>],
  [28, <>      {'))}'}</>],
  [29, <>    &lt;/<span className="blue">div</span>&gt;</>],
  [30, '  );'],
  [31, '}'],
]

function App() {
  const [tab, setTab] = useState('chat')
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState([])
  const [memory, setMemory] = useState(true)
  const send = () => {
    if (!prompt.trim()) return
    setMessages(m => [...m, prompt.trim()])
    setPrompt('')
  }
  return <main className="app-shell">
    <header>
      <div className="brand"><div className="brandmark"><Code2 size={17}/></div><span>temper</span><em>/</em><small>workspace</small></div>
      <div className="project"><span className="status-dot"/>acme/dashboard <ChevronDown size={14}/></div>
      <div className="header-actions"><button className="icon-btn"><Search size={17}/></button><button className="branch"><GitBranch size={15}/> main <ChevronDown size={13}/></button><div className="avatar">AR</div></div>
    </header>
    <section className="workspace">
      <aside className="rail">
        <button className="active"><Files size={20}/></button><button><Search size={20}/></button><button><GitBranch size={20}/></button><button><Brain size={20}/></button>
        <div className="rail-bottom"><button><Settings2 size={20}/></button><button><CircleUserRound size={20}/></button></div>
      </aside>
      <aside className="memory-panel">
        <div className="panel-heading"><span>YOUR WORKSPACE</span><PanelLeftClose size={15}/></div>
        <div className="profile-card">
          <div className="profile-top"><div className="brain-icon"><Brain size={18}/></div><div><h3>Developer fingerprint</h3><p>Continuously learning</p></div><button className={'toggle '+(memory?'on':'')} onClick={()=>setMemory(!memory)}><span/></button></div>
          <div className="learned"><Sparkles size={13}/> 24 preferences learned</div>
        </div>
        <div className="section-title"><span>BUILD PREFERENCES</span><button>View all</button></div>
        <div className="preferences">{preferences.map(([name,value])=><div className="pref" key={name}><span>{name}</span><em>{value}</em></div>)}</div>
        <div className="section-title"><span>RECENTLY LEARNED</span></div>
        <div className="learn-item"><div className="learn-icon"><Zap size={14}/></div><div><p>You prefer early returns over nested conditionals.</p><small>2 min ago · This workspace</small></div></div>
        <div className="learn-item"><div className="learn-icon purple"><Code2 size={14}/></div><div><p>Use named exports for shared utilities.</p><small>Yesterday · api-service</small></div></div>
        <div className="memory-footer"><History size={14}/> Memory log <span>→</span></div>
      </aside>
      <section className="editor-area">
        <div className="tabs"><div className="file-tab active"><span className="react-icon">⚛</span> UserList.tsx <X size={13}/></div><div className="file-tab"><span className="ts-icon">TS</span> api.ts <span className="dirty"/></div><button><Plus size={15}/></button><div className="editor-actions"><Play size={15}/><span>Run</span><ChevronDown size={13}/></div></div>
        <div className="breadcrumbs"><span>src</span><b>›</b><span>components</span><b>›</b><span className="react-icon">⚛</span><span>UserList.tsx</span><b>›</b><span>□ UserList</span></div>
        <div className="code-wrap"><div className="code-lines">{code.map(([n,line])=><div className="code-row" key={n}><span className="line-no">{n}</span><code>{line}</code></div>)}</div><div className="minimap"/></div>
        <div className="statusbar"><div><GitBranch size={12}/> main*</div><div><X size={12}/> 0 <span className="warn">△</span> 1</div><div className="status-right"><span>Ln 14, Col 18</span><span>Spaces: 2</span><span>UTF-8</span><span>{'{ }'} TypeScript React</span></div></div>
      </section>
      <aside className="assistant-panel">
        <div className="assistant-tabs"><button className={tab==='chat'?'active':''} onClick={()=>setTab('chat')}><MessageSquareText size={15}/> Assistant</button><button className={tab==='context'?'active':''} onClick={()=>setTab('context')}>Context <span>4</span></button><button className="more">•••</button></div>
        <div className="assistant-body">
          <div className="ai-heading"><div className="ai-logo"><Sparkles size={17}/></div><div><h3>Temper</h3><p><span/> Your preferences are active</p></div></div>
          <div className="retrieval"><div className="retrieval-title"><Brain size={14}/><b>Retrieved your build style</b><span>4 signals</span></div><div className="chips"><span>TypeScript</span><span>Functional</span><span>Concise</span><span>+1</span></div><p>I'll apply these preferences to every response in this workspace.</p></div>
          <div className="user-message">Can you refactor this component to handle errors and add a retry?</div>
          <div className="assistant-message"><div className="mini-ai"><Sparkles size={12}/></div><div><p>I'll add typed error state and a retry handler, keeping the component functional and avoiding unnecessary abstraction.</p><div className="change-card"><div><span className="react-icon">⚛</span><b>UserList.tsx</b><em>+18 −4</em></div><p><span>+</span> Typed error state</p><p><span>+</span> Retry with the same fetch function</p><p><span>+</span> Early return for error UI</p><button>Apply changes <kbd>⌘ ↵</kbd></button></div></div></div>
          {messages.map((m,i)=><div className="new-message" key={i}>{m}</div>)}
        </div>
        <div className="composer"><div className="composer-box"><textarea value={prompt} onChange={e=>setPrompt(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}} placeholder="Ask Temper anything…"/><div className="composer-tools"><div><button><Plus size={16}/></button><button><span className="at">@</span></button><span className="model">Claude 3.7 Sonnet <ChevronDown size={12}/></span></div><button className="send" onClick={send}><Send size={14}/></button></div></div><p><Sparkles size={11}/> Preferences retrieved before every response</p></div>
      </aside>
    </section>
  </main>
}

createRoot(document.getElementById('root')).render(<App />)
