import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
});

export const getEmbedding = async (text) => {
  const response = await openai.embeddings.create({
    model: "nvidia/llama-nemotron-embed-vl-1b-v2:free",
    input: [
      {
        content: [
          { type: "text", text: text }
        ]
      }
    ],
    encoding_format: "float"
  });

  const embedding = response?.data?.[0]?.embedding || response?.embedding;

  if (!embedding) {
    throw new Error("Failed to get embedding from OpenRouter response");
  }

  return embedding;
};