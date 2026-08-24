import { chatError, openAIClient, requirePost, type ApiRequest, type ApiResponse } from "./_shared.js";

const instructions = `You are Phoenix, Temper's Agent Architect. Interview users and help them create an excellent AGENTS.md for a real project.

Ask exactly one focused question per response unless the user requests a summary or final document. Build the brief progressively across project and users, core outcome, responsibilities and non-goals, tools and context, voice, decision rules, escalation boundaries, and examples. Do not generate AGENTS.md until the user explicitly asks or confirms the brief. Then return a polished Markdown document in a fenced Markdown code block.`;

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requirePost(req, res)) return;
  const body = (req.body || {}) as { messages?: unknown };
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const input = messages.slice(-20).flatMap((message) => {
    if (typeof message !== "object" || message === null) return [];
    const item = message as { role?: string; content?: unknown };
    return typeof item.content === "string" && item.content.trim()
      ? [{ role: item.role === "assistant" ? "assistant" as const : "user" as const, content: item.content.trim().slice(0, 8000) }]
      : [];
  });
  if (!input.length) return res.status(400).json({ error: "A message is required." });
  const client = openAIClient(res);
  if (!client) return;
  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5",
      instructions,
      input,
    });
    return res.json({ message: response.output_text || "I could not produce a response. Please try again." });
  } catch (error) {
    return chatError(res, error);
  }
}
