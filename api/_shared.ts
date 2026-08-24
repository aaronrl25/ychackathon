import type { IncomingMessage, ServerResponse } from "node:http";
import OpenAI from "openai";

export type ApiRequest = IncomingMessage & { body?: unknown };
export type ApiResponse = ServerResponse & {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

export function requirePost(req: ApiRequest, res: ApiResponse) {
  if (req.method === "POST") return true;
  res.setHeader("Allow", "POST");
  res.status(405).json({ error: "Method not allowed." });
  return false;
}

export function openAIClient(res: ApiResponse) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.openai_api_key;
  if (apiKey) return new OpenAI({ apiKey });
  res.status(503).json({ error: "OpenAI is not configured on the server." });
  return null;
}

export function chatError(res: ApiResponse, error: unknown) {
  console.error("Phoenix chat failed", error);
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    error.status === 429
  ) {
    return res.status(429).json({
      error: "The OpenAI project has no available API quota.",
    });
  }
  return res.status(502).json({
    error: "Phoenix could not reach OpenAI. Please try again.",
  });
}
