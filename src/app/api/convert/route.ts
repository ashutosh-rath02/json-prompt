import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const { prompt, requirements } = await req.json();

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Use a simple, reliable schema
    const simpleSchema = z.object({
      title: z.string(),
      description: z.string(),
      keyPoints: z.array(z.string()),
      requirements: z.array(z.string()).optional(),
      outputFormat: z.string(),
    });

    // Generate the structured data
    const result = await generateObject({
      model: google("gemini-1.5-flash"),
      schema: simpleSchema,
      prompt: `Convert this prompt into a structured format: "${prompt}"

${requirements ? `Additional requirements: ${requirements}` : ""}

Create a structured format with:
- title: A clear title
- description: Brief description
- keyPoints: Array of important points
- requirements: Any specific requirements (optional)
- outputFormat: How the output should be formatted`,
    });

    return Response.json({
      originalPrompt: prompt,
      requirements: requirements || "Auto-generated structure",
      structuredPrompt: result.object,
    });
  } catch (error) {
    console.error("Error converting prompt:", error);

    // More specific error handling
    if (error instanceof Error) {
      return Response.json(
        { error: error.message || "Failed to convert prompt" },
        { status: 500 }
      );
    }

    return Response.json(
      { error: "Failed to convert prompt. Please try again." },
      { status: 500 }
    );
  }
}
