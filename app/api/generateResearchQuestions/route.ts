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

// This function handles POST requests for generating research questions.
export async function POST(req: NextRequest) {
  console.log("Entered Research Questions API");

  try {
    // Extract title and objectives from the request body
    const { researchTitle, researchObjectives } = await req.json();

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: 'user',
          parts: [
            {
              text: `Given the research title "${researchTitle}" and the following research objectives:\n\n${researchObjectives.join('\n')}\nPlease suggest three to five research questions that align with the given title and all of the research objectives. Respond with this template: {research_questions: []`,
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage("Suggest research questions");
    const responseText = await result.response.text();

    // Return the generated research questions as a JSON response
    return NextResponse.json({
      research_questions: JSON.parse(responseText),
    }, { status: 200 });

  } catch (error) {
    console.error('Error generating research questions:', error);
    return NextResponse.json({ message: 'Error generating research questions', error }, { status: 500 });
  }
}
