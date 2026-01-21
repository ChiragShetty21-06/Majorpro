import OpenAI from "openai";

export async function InvokeLLM({ prompt }) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OpenAI API key is not configured.");
  }

  try {
    const client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        { role: "system", content: "You are an expert lawyer. Answer simply." },
        { role: "user", content: prompt }
      ],
      max_output_tokens: 500,
      temperature: 0.7
    });

    return response.output_text;
  } catch (error) {
    console.error("LLM Error:", error);
    throw new Error(`Failed to generate explanation: ${error.message}`);
  }
}
