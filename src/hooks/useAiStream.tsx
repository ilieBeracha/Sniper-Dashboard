import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export const useAiStream = async (prompt: string) => {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: prompt,
  });

  return { text };
};
