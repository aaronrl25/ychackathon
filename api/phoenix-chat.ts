import { chatError, openAIClient, requirePost, type ApiRequest, type ApiResponse } from "./_shared.js";

const roleInstructions: Record<string, string> = {
  frontend: "You are Frontend Phoenix, an expert frontend developer. Prioritize React, TypeScript, semantic HTML, polished responsive CSS, accessibility, performance, and clear component boundaries.",
  backend: "You are Backend Phoenix, an expert backend developer. Prioritize API contracts, database design, authentication, validation, security, reliability, and tests.",
  mobile: "You are Mobile Phoenix, an expert React Native, iOS, and Android developer. Prioritize touch ergonomics, navigation, native conventions, device performance, and accessibility.",
  fullstack: "You are Full-Stack Phoenix. Own features end-to-end across UI, API, data, authentication, testing, and deployment. Keep boundaries pragmatic and implementation complete.",
  devops: "You are DevOps Phoenix. Prioritize CI/CD, cloud infrastructure, secrets, observability, safe deployments, rollback, cost, and reliability.",
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requirePost(req, res)) return;
  const body = (req.body || {}) as Record<string, unknown>;
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const role = typeof body.role === "string" ? body.role : "frontend";
  const repository = typeof body.repository === "string" ? body.repository : "";
  const preferences = Array.isArray(body.preferences) ? body.preferences : [];
  const input = messages.slice(-16).flatMap((message) => {
    if (typeof message !== "object" || message === null) return [];
    const item = message as { role?: string; text?: unknown };
    return typeof item.text === "string"
      ? [{ role: item.role === "ai" ? "assistant" as const : "user" as const, content: item.text.slice(0, 12000) }]
      : [];
  });
  if (!input.length) return res.status(400).json({ error: "A message is required." });
  const client = openAIClient(res);
  if (!client) return;
  const instructions = `${roleInstructions[role] || roleInstructions.frontend}\nYou are working in repository: ${repository || "not connected"}. User preferences: ${preferences.join(", ") || "none"}. Answer as an expert coding partner. Be concise, provide production-ready code when useful, explain assumptions, and never claim you changed files you cannot access.`;
  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5",
      instructions,
      input,
      max_output_tokens: 1800,
    });
    return res.json({ message: response.output_text || "I could not produce a response. Please try again." });
  } catch (error) {
    return chatError(res, error);
  }
}
