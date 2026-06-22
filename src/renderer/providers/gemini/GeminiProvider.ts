import { GoogleGenerativeAI } from "@google/generative-ai";
import type {
  AIProvider,
  GenerateEmailRequest,
  GeneratedEmail,
} from "../AIProvider";

export class GeminiProvider implements AIProvider {
  id = "gemini";
  name = "Google Gemini";
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateEmail(request: GenerateEmailRequest): Promise<GeneratedEmail> {
    if (!this.apiKey) {
      throw new Error("Gemini API Key is missing. Please set it in Settings.");
    }

    const genAI = new GoogleGenerativeAI(this.apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `You are a helpful AI assistant tasked with generating emails. 
Given a prompt and a desired tone, generate the subject line and the body of the email.
Return the result strictly as a JSON object with two fields: "subject" and "body".
The body should use HTML formatting (e.g., <p>, <br>, <strong>).`;

    const userPrompt = `Tone: ${request.tone}\nPrompt: ${request.prompt}`;

    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: systemPrompt + "\n\n" + userPrompt }] },
      ],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const responseText = result.response.text();
    try {
      const cleanText = responseText.replace(/```json\n?|```/g, "").trim();
      const parsed = JSON.parse(cleanText);
      return {
        subject: parsed.subject || "",
        body: parsed.body || "",
      };
    } catch (e: unknown) {
      console.error("Failed to parse Gemini response", e);
      throw new Error(
        "Failed to generate email content. Invalid response format.",
        { cause: e },
      );
    }
  }
}
