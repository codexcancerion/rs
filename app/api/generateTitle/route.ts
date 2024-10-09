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

// This function handles POST requests.
export async function POST(req: NextRequest) {
  console.log("Entered Title API");

  try {
    const { topicDescription, researchType, context, initialObjectives } = await req.json();

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: 'user',
          parts: [
            {
              text: `Based on the following information:\n\nTopic: ${topicDescription}\nResearch Type: ${researchType}\nContext: ${context}\nObjectives: ${initialObjectives}\nPlease suggest 3 potential research titles that reflect the objectives, research type, and context.`,
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage("Suggest titles");
    const responseText = result.response.text();

    return NextResponse.json({
      suggestions: JSON.parse(responseText),
    }, { status: 200 });
  } catch (error) {
    console.error('Error generating title suggestions:', error);
    return NextResponse.json({ message: 'Error generating title suggestions', error }, { status: 500 });
  }
}

