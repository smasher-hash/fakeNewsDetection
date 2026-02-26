import { GoogleGenerativeAI } from "@google/generative-ai";

export const analyzeWithAI = async (text) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY missing");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", 
    });

    const prompt = `
You are a fake news risk analysis AI.

STRICT RULES:
- Respond ONLY in valid JSON
- No extra text
- No markdown
- No explanations outside JSON

JSON format:
{
  "risk": number (0-100),
  "reason": "short explanation"
}

News to analyze:
"${text}"
`;

    const result = await model.generateContent(prompt);

    const content = result?.response?.text();

    if (!content) {
      throw new Error("Empty AI response");
    }

    
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error("Invalid JSON from Gemini: " + content);
    }
 
    if (
      typeof parsed.risk !== "number" ||
      parsed.risk < 0 ||
      parsed.risk > 100
    ) {
      throw new Error("Gemini returned invalid risk value");
    }

    return parsed;

  } catch (error) {
    console.log("GEMINI ERROR:", error.message);

    
    return {
      risk: 50,
      reason: "AI service temporarily unavailable",
    };
  }
};