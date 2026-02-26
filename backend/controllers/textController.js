 import { analyzeWithAI } from "../services/aiService.js";
import Result from "../models/Result.js";

export const analyzeText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Text is required" });
    }

    const aiResponse = await analyzeWithAI(text);

    let fakeProbability = 50;
    let explanation = "";

    if (typeof aiResponse === "string") {
      explanation = aiResponse;
      const match = aiResponse.match(/Probability:\s*(\d+)%/i);
      if (match) fakeProbability = Number(match[1]);
    } else {
      fakeProbability = Number(aiResponse?.fakeProbability ?? 50);
      explanation =
        aiResponse?.explanation ?? "No explanation provided by AI.";
    }

    fakeProbability = Math.min(100, Math.max(0, fakeProbability));

    

    const signals = [];

    const lowerText = text.toLowerCase();

    if (lowerText.match(/shocking|unbelievable|must see|breaking/i)) {
      signals.push("Sensational or clickbait-style language");
    }

    if (lowerText.match(/forward this|share this|send to everyone/i)) {
      signals.push("Viral forwarding trigger phrases detected");
    }

    if (lowerText.length < 80) {
      signals.push("Very short claim — insufficient context");
    }

    if (!lowerText.match(/source|according to|reported by/i)) {
      signals.push("No clear source or attribution detected");
    }

    if (signals.length === 0) {
      signals.push("No obvious risk patterns detected");
    }

   

    const savedResult = await Result.create({
      type: "text",
      inputData: text,
      fakeProbability,
      explanation,
    });

    res.json({
      fakeProbability,
      explanation,
      signals, 
    });

  } catch (error) {
    res.status(500).json({ message: "AI analysis failed" });
  }
};