import dotenv from "dotenv";
dotenv.config();
import FormData from "form-data";
import fs from "fs";
import axios from "axios";

const IMAGGA_BASE_URL = "https://api.imagga.com/v2";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.GROQ_KEY;

export const analyzeImage = async (req, res) => {
  try {
    console.log(" Request received");

    if (!req.file) return res.status(400).json({ error: "No image uploaded" });
    if (!process.env.IMAGGA_KEY || !process.env.IMAGGA_SECRET)
      return res.status(500).json({ error: "Missing Imagga credentials" });

    // Upload image to Imagga
    const formData = new FormData();
    formData.append("image", fs.createReadStream(req.file.path));

    const uploadRes = await axios.post(`${IMAGGA_BASE_URL}/uploads`, formData, {
      auth: {
        username: process.env.IMAGGA_KEY,
        password: process.env.IMAGGA_SECRET,
      },
      headers: formData.getHeaders(),
    });

    const uploadId = uploadRes.data?.result?.upload_id;
    if (!uploadId) throw new Error("Upload ID not received");

    const auth = {
      username: process.env.IMAGGA_KEY,
      password: process.env.IMAGGA_SECRET,
    };

    // Get tags and colors from Imagga
    const [tagsRes, colorsRes] = await Promise.all([
      axios.get(`${IMAGGA_BASE_URL}/tags`, { params: { image_upload_id: uploadId }, auth }),
      axios.get(`${IMAGGA_BASE_URL}/colors`, { params: { image_upload_id: uploadId }, auth }),
    ]);

    const tags = tagsRes.data?.result?.tags || [];
    const colors = colorsRes.data?.result?.colors || {};

    // Prepare input for Groq AI
    const groqInput = {
      tags: tags.map((t) => t.tag.en),
      dominant_colors: colors.dominant_colors?.map((c) => c.color_name) || [],
      image_colors: colors.image_colors?.map((c) => c.color_name) || [],
    };

    // Call Groq AI (Free model)
    const groqRes = await axios.post(
      GROQ_API_URL,
      {
        model: "llama-3.3-70b-versatile", 
        messages: [
          {
            role: "system",
            content:
              "You are a fashion assistant. Analyze image tags and colors, suggest fashion items, future design trends, and add color emojis for each color. Return JSON with key 'recommendations' (array of strings).",
          },
          { role: "user", content: JSON.stringify(groqInput) },
        ],
        response_format: { type: "json_object" },
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const completionContent = groqRes.data?.choices?.[0]?.message?.content;
    let fashion_recommendations = [];

    try {
      const parsed = JSON.parse(completionContent);
      fashion_recommendations = parsed.recommendations || [];
    } catch (e) {
      console.error("Error parsing Groq response:", e);
    }

    fs.unlink(req.file.path, () => {});

    return res.json({ tags, colors, fashion_recommendations });
  } catch (error) {
    console.error("BACKEND ERROR:", error.message);
    if (error.response) console.error("API Error:", error.response.data);
    if (req.file?.path) fs.unlink(req.file.path, () => {});
    return res.status(500).json({ error: "Image analysis failed", details: error.message });
  }
}; 