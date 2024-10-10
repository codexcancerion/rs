import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
};

// POST handler for the objectives suggestion
export async function POST(req: NextRequest) {
  console.log("Entered Objective Suggestions API");

  try {
    const { title, description } = await req.json();

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: 'user',
          parts: [
            {
              text: `Given the research title '${title}' and the following description:\n\n${description}\n\nPlease suggest three to five research objectives that align with the title and description. Respond with this template: {objectives: []}`,
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage("Suggest research objectives");
    const responseText = result.response.text();

    console.log("Response from generateObjectiveSuggestions: " + responseText);

    return NextResponse.json({
      objectives: JSON.parse(responseText),
    }, { status: 200 });
  } catch (error) {
    console.error('Error generating research objectives:', error);
    return NextResponse.json({ message: 'Error generating research objectives', error }, { status: 500 });
  }
}
