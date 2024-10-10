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
  console.log("Entered Generate Single Introduction Draft API");

  try {
    // Extract title and objectives from the request body
    const { title, objectives, questions, introDraft, outline } = await req.json();

    // const sample = {
    //   "title": "The Impact of E-learning on Student Performance During the COVID-19 Pandemic",
    //   "objectives": [
    //     "To evaluate the effectiveness of e-learning platforms during the pandemic.",
    //     "To analyze the correlation between e-learning engagement and academic performance.",
    //     "To assess the challenges faced by students in accessing e-learning resources."
    //   ],
    //   "questions": [
    //     "What is the level of effectiveness of e-learning platforms during the pandemic?",
    //     "How does student engagement in e-learning correlate with academic performance?",
    //     "What challenges do students face in accessing e-learning resources?"
    //   ],
    //   "introDraft": [
    //     "The COVID-19 pandemic has dramatically transformed educational systems across the globe.",
    //     "With lockdowns and social distancing measures in place, e-learning has become the primary mode of education.",
    //     "This shift has raised questions regarding its impact on student performance."
    //   ],
    //   "outline": "1. E-learning during COVID-19. 3 paragraphs"
    // };

    
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: 'user',
          parts: [
            {
              text: `Given the research title "${title}" and the following research objectives:
              \n\n${objectives.join('\n')}\n and the following research questions:
              \n\n${questions.join('\n')}\n. Also here is the Introduction draft: 
              \n\n${introDraft.join('\n')}\n
              Kindly draft just a portion in the introduction section discussing the following outline: "${outline}".
              Remember to put intext citations and get the link/s of your references and include them in your response.
              Respond with this template: introduction_drafts: {description: ["paragraph1","paragraph2"], referenceLinks: ["link.com"]}`,
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage("Draft the Introduction portion");
    const responseText = await result.response.text();

    console.log(responseText)
    // Return the generated research questions as a JSON response
    return NextResponse.json({
      introduction_drafts: JSON.parse(responseText),
    }, { status: 200 });

  } catch (error) {
    console.error('Error drafting introduction:', error);
    return NextResponse.json({ message: 'Error drafting introduction', error }, { status: 500 });
  }
}
