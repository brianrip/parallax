import OpenAI from "openai";
import { NextResponse } from "next/server";
import { GROK_SYSTEM_PROMPT } from "@/lib/grok-prompt";

export const maxDuration = 30;

const grok = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { topic } = body;

  if (
    !topic ||
    typeof topic !== "string" ||
    topic.trim().length === 0 ||
    topic.length > 200
  ) {
    return NextResponse.json({ error: "Invalid topic" }, { status: 400 });
  }
  const sanitizedTopic = topic.trim();

  let text: string;
  try {
    const response = await grok.chat.completions.create({
      model: "grok-3",
      messages: [
        { role: "system", content: GROK_SYSTEM_PROMPT },
        { role: "user", content: sanitizedTopic },
      ],
      max_tokens: 2000,
      // grok-3 has live search enabled by default
      // If signals appear stale, add: search_parameters: { mode: "auto", sources: [{ type: "x" }, { type: "web" }] }
    });

    text = response.choices[0]?.message?.content ?? "";
  } catch (err) {
    console.error("Grok API error:", err);
    return NextResponse.json(
      { error: "Pulse API call failed" },
      { status: 500 },
    );
  }

  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    console.error("Pulse JSON parse failed. Raw output:", text);
    return NextResponse.json(
      { error: "Failed to parse AI response" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    topic: sanitizedTopic,
    fetchedAt: new Date().toISOString(),
    ...parsed,
  });
}
