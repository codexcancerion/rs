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
  responseMimeType: 'text/plain',
};

// This function handles POST requests.
export async function POST(req: NextRequest) {
  console.log("Entered Title Analysis API");

  try {
    const { title, researchType, context, initialObjectives } = await req.json();

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: 'user',
          parts: [
            {
              text: `Based on the following information:\n\n**Title:** ${title}\n\n**Research Type:** ${researchType}\n\n**Context:** ${context}\n\n**Objectives:** ${initialObjectives}\n\nPlease analyze the title by providing:\n- **Pros**: Advantages of this title for research.\n- **Cons**: Potential challenges or drawbacks.\n- **Possible Research Objectives**: Additional objectives that can be pursued.\n- **Possible Methodologies**: Suggested methods to collect and analyze data.\n- **Suggestions**: Recommendations for refining the research.\n- **Analysis of Doability**: Considerations regarding feasibility based on time, data availability, and resources.`
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage("Title Analysis");
    const responseText = result.response.text();

    return NextResponse.json({
      analysis: responseText,
    }, { status: 200 });
  } catch (error) {
    console.error('Error generating title analysis:', error);
    return NextResponse.json({ message: 'Error generating title analysis', error }, { status: 500 });
  }
}
