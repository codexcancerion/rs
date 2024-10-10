import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Generative AI with the API key
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// Define the model configuration
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// Configuration for the text generation
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// This function handles POST requests for the generateQuestionAnalysis API
export async function POST(req: NextRequest) {
  try {
    // Extracting data from the request body
    const { researchTitle, researchObjectives, researchQuestion } = await req.json();

    // Start a chat session with the model using the generation configuration
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: `Research Title: "${researchTitle}"\n\nResearch Objectives:\n\n${researchObjectives.join("\n")}\n\nResearch Question: "${researchQuestion}"\n\nPlease provide an analysis of this research question, including:\n1. How the question relates to the research title and objectives.\n2. A suggested methodology to answer the research question.\n3. A sample of expected results for this question based on existing research.`
            },
          ],
        },
      ],
    });

    // Send a message to get the response from the model
    const result = await chatSession.sendMessage("Analyze the question");

    // Extracting the response text
    const responseText = await result.response.text();

    // Returning the result as JSON
    return NextResponse.json({ analysis: responseText }, { status: 200 });
  } catch (error) {
    console.error('Error generating question analysis:', error);
    return NextResponse.json({ message: 'Error generating question analysis', error }, { status: 500 });
  }
}
