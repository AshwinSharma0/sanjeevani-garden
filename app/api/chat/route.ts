import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages are required." },
        { status: 400 }
      );
    }

    const systemPrompt = `
You are Sanjeevani Garden AI, a professional AI assistant for a medicinal plant and herbal healthcare platform.

Your expertise includes:
- Ayurveda
- Medicinal herbs
- Herbal remedies
- Plant care
- Organic farming
- Herbal gardening
- Wellness
- Home remedies

Rules:

1. Always answer politely and professionally.
2. Use proper Markdown formatting.
3. Use headings and bullet points.
4. Explain herbs with:
   - Description
   - Benefits
   - Uses
   - Precautions
5. Never diagnose diseases.
6. For serious symptoms, recommend consulting a qualified healthcare professional.
7. Remember previous messages in the conversation.
8. Keep answers informative but concise.
9. If the user asks unrelated questions, politely explain that you specialize in herbal wellness and gardening.
`;

    const conversation = messages
      .map((msg: any) => {
        return `${msg.sender === "user" ? "User" : "Assistant"}: ${msg.content}`;
      })
      .join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${systemPrompt}

Conversation:

${conversation}

Assistant:`,
    });

    return NextResponse.json({
      reply: response.text,
    });
  } catch (error) {
    console.error("Gemini Error:", error);

    return NextResponse.json(
      {
        reply:
          "Sorry, I couldn't connect to the AI service. Please try again in a moment.",
      },
      { status: 500 }
    );
  }
}