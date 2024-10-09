interface TitleReqs {
    id: number;
    topicDescription: string;
    researchType: string;
    context: string;
    initialObjectives: string
}

interface Title {
    id: number;
    title: string;
    analysis: string;
    titleReqs: TitleReqs;
}

interface Outline {
    id: number;
    description: string[];
    prompt: string;
    referenceLinks: string[];
}

interface Question {
    id: string;
    question: string;
    analysis: string;
}

export type {Title, TitleReqs, Outline, Question};