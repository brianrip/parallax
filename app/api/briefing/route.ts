import Anthropic from "@anthropic-ai/sdk";
import type { WebSearchTool20250305 } from "@anthropic-ai/sdk/resources/messages/messages";
import { NextResponse } from "next/server";
import { ANTHROPIC_SYSTEM_PROMPT } from "@/lib/anthropic-prompt";

export const maxDuration = 30;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { topic } = body;

  if (!topic || typeof topic !== "string" || topic.trim().length === 0 || topic.length > 200) {
    return NextResponse.json({ error: "Invalid topic" }, { status: 400 });
  }
  const sanitizedTopic = topic.trim();

  let text: string;
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      system: ANTHROPIC_SYSTEM_PROMPT,
      tools: [
        { type: "web_search_20250305", name: "web_search" } satisfies WebSearchTool20250305,
      ],
      messages: [
        {
          role: "user",
          content: sanitizedTopic,
        },
      ],
    });

    // Extract the final text block from the response
    const textBlock = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block as { type: "text"; text: string }).text)
      .join("");

    text = textBlock;
  } catch (err) {
    console.error("Anthropic API error:", err);
    return NextResponse.json({ error: "Briefing API call failed" }, { status: 500 });
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
    console.error("Briefing JSON parse failed. Raw output:", text);
    return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
  }

  return NextResponse.json({
    topic: sanitizedTopic,
    fetchedAt: new Date().toISOString(),
    ...parsed,
  });
}
