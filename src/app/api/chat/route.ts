import { google } from "@ai-sdk/google";
import { streamText, UIMessage } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

/**
 * Handles the POST request for the chat API.
 * 
 * This function processes incoming chat messages and a system prompt,
 * then streams a response using the specified model.
 * 
 * @param req - The incoming request object containing chat messages and an optional system prompt.
 * @returns A response stream containing the generated chat response.
 * @throws {Response} Returns a 500 Internal Server Error response if an error occurs during processing.
 */
export async function POST(req: Request) {
  try {
    const {
      messages,
      systemPrompt,
    }: { messages: UIMessage[]; systemPrompt?: string } = await req.json();

    const result = streamText({
      model: google("gemini-2.0-flash"),
      system: systemPrompt || "You are a helpful interview assistant.",
      messages: messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in API route:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
