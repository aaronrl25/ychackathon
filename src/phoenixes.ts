import terseImage from "../assets/03_focused-removebg-preview.png";
import thinkingImage from "../assets/06_thinking-removebg-preview.png";
import momentumImage from "../assets/09_excited.png";
import reviewerImage from "../assets/04_confident.png";
import explainerImage from "../assets/07_explaining-removebg-preview.png";

export type PersonalityId = "terse" | "thinking" | "momentum" | "reviewer" | "explainer";
export type Personality = {
  id: PersonalityId; name: string; tag: string; description: string; bestFor: string;
  response: string; image: string; accent: string;
};

export const personalities: Personality[] = [
  { id:"terse", name:"Terse", tag:"DIRECT", description:"Diff first. Explanations only when you ask.", bestFor:"Developers who want fast, concise answers.", response:"Updated the auth guard and added the missing redirect.\n\n3 files changed · tests passing.", image:terseImage, accent:"#ff6b32" },
  { id:"thinking", name:"Thinking Aloud", tag:"PAIRED", description:"Explains trade-offs and reasoning before writing code.", bestFor:"Collaborative problem-solving.", response:"I see two good paths here. A context provider is simpler now, while a store scales better if session state grows. Given this app’s size, I’d start with context—and keep the boundary easy to replace.", image:thinkingImage, accent:"#a879ff" },
  { id:"momentum", name:"Momentum", tag:"DRIVER", description:"Keeps building and flags questions at the end.", bestFor:"Rapid prototyping and hackathons.", response:"I wired the full flow: sign-in, protected route, loading state, and logout. Everything builds. One question for later: should expired sessions return to login or preserve the intended route?", image:momentumImage, accent:"#ff9d0a" },
  { id:"reviewer", name:"Reviewer", tag:"CAREFUL", description:"Works in small steps and validates everything with tests.", bestFor:"Production and critical codebases.", response:"Before changing this, I’ll lock the current behavior with a regression test. Then I’ll make the smallest patch, run type checks, and verify the unauthorized state separately.", image:reviewerImage, accent:"#e28b60" },
  { id:"explainer", name:"Explainer", tag:"TEACHER", description:"Teaches concepts while implementing the solution.", bestFor:"Learning unfamiliar technologies.", response:"We’ll use an auth-state observer here. Think of it as a subscription: Firebase calls us whenever the session changes, and React turns that signal into the screen the user should see.", image:explainerImage, accent:"#c58cff" },
];

export function savePersonalitySelection(personality: Personality) {
  localStorage.setItem("md-soul:phoenix-personality", personality.id);
  // Later: persist `personality.id` to the authenticated user's Firebase profile here.
}
