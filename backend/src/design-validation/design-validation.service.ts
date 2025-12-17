import {
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { GoogleGenAI } from "@google/genai";

@Injectable()
export class DesignValidationService {
  private ai: GoogleGenAI;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  // 🔁 Retry wrapper (handles transient overloads only)
  private async callGeminiWithRetry(
    prompt: string,
    retries = 1
  ): Promise<any> {
    try {
      return await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });
    } catch (err: any) {
      if (err?.status === 503 && retries > 0) {
        console.warn("⚠️ Gemini overloaded, retrying...");
        await new Promise((res) => setTimeout(res, 1500));
        return this.callGeminiWithRetry(prompt, retries - 1);
      }
      throw err;
    }
  }

  async validateDesign(body: { input?: string; recordId?: string }) {
    try {
      let cableInput = body.input;

      // Simulated DB fetch
      if (body.recordId) {
        cableInput = `
IEC 60502-1 cable,
0.6/1 kV,
Cu Class 2,
10 sqmm,
PVC insulation thickness 1.0 mm
        `;
      }

      if (!cableInput) {
        return { error: "Input text or recordId required" };
      }

      const prompt = `
You are a senior low-voltage cable design engineer.

Your task is to validate a cable design against IEC 60502-1 and IEC 60228
using professional engineering reasoning.

IMPORTANT RULES:
- Do NOT quote IEC tables or clause numbers.
- Do NOT say “according to table X”.
- Do NOT behave like a deterministic rule engine.
- Perform validation using engineering judgment.
- You MUST create a validation entry for EVERY extracted field.
- Even if compliant, include it with status PASS and a brief justification.
- If information is missing or ambiguous, return WARN.
- If information is clearly non-compliant, return FAIL.
- Validation is advisory and for engineering review.

OVERALL ENGINEERING ASSESSMENT (CRITICAL):
After completing per-parameter validation, you must provide an
overall engineering judgment in the "reasoning" field.

In the reasoning, you MUST clearly state ONE of the following:
- that the design is fully correct / fully perfect design,
- OR that the design is borderline and requires review,
- OR that the design is invalid / non-compliant,
- OR that the input is ambiguous and cannot be reliably validated.

This overall assessment must be based on your professional
engineering judgment, not a mechanical rule.

----------------------------------
INPUT:
${cableInput}
----------------------------------

OUTPUT FORMAT (STRICT JSON ONLY):

{
  "fields": {
    "standard": string | null,
    "voltage": string | null,
    "conductor_material": string | null,
    "conductor_class": string | null,
    "csa": number | null,
    "insulation_material": string | null,
    "insulation_thickness": number | null
  },
  "validation": [
    {
      "field": string,
      "provided": string | null,
      "expected": string,
      "status": "PASS" | "WARN" | "FAIL",
      "comment": string
    }
  ],
  "reasoning": string,
  "confidence": {
    "overall": number
  }
}

RETURN ONLY VALID JSON.
      `;

      const result = await this.callGeminiWithRetry(prompt);

      const rawText = result.text;
      if (!rawText) {
        throw new Error("Empty AI response");
      }

      const cleanedText = rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleanedText);

      // 🛡️ Minimal safety checks (NO LOGIC DERIVATION)
      if (!parsed.reasoning || typeof parsed.reasoning !== "string") {
        parsed.reasoning =
          "The design was reviewed, but the overall engineering assessment could not be clearly determined from the provided information.";
      }

      if (
        parsed?.confidence?.overall &&
        typeof parsed.confidence.overall === "number"
      ) {
        parsed.confidence.overall = Math.min(
          parsed.confidence.overall,
          0.95
        );
      }

      return parsed;
    } catch (err: any) {
      console.error("🔥 Design validation failed:", err);

      if (err?.status === 503) {
        throw new InternalServerErrorException(
          "AI service is temporarily overloaded. Please try again."
        );
      }

      throw new InternalServerErrorException(
        "AI-based design validation failed"
      );
    }
  }
}
