import { GoogleGenerativeAI } from "@google/generative-ai";
import Result from "../models/Result.js";
import fs from "fs";

export const analyzeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imagePath = req.file.path;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const imageBytes = fs.readFileSync(imagePath);

    const aiResponse = await model.generateContent([
      `
You are an AI image authenticity analyzer.

Assume an uploaded image is claiming something viral or controversial.

Analyze possible signs of:
- Deepfake
- Photoshop manipulation
- Lighting inconsistencies
- Unreal shadows
- Text editing

Return ONLY in this exact format:

Probability: <number>%
Reason: <short explanation>
`,
      {
        inlineData: {
          data: imageBytes.toString("base64"),
          mimeType: "image/jpeg",
        },
      },
    ]);

    const aiText = aiResponse.response.text();

   

    let fakeProbability = 50; 

    const match = aiText.match(/Probability:\s*(\d+)%/i);

    if (match) {
      fakeProbability = Math.min(100, Math.max(0, parseInt(match[1])));
    }

    /* -------------------------------------------------------------- */

    const savedResult = await Result.create({
      type: "image",
      inputData: imagePath,
      fakeProbability,
      explanation: aiText,
    });

    res.status(200).json({
      fakeProbability,
      explanation: aiText,
    });

  } catch (error) {
    console.log("GEMINI IMAGE ERROR:", error.message);
    res.status(500).json({ error: "Image analysis failed" });
  }
};