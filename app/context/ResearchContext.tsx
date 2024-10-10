import React, { createContext, useState, ReactNode } from 'react';
import { Title, Outline, Question, Objective } from '@/app/lib/interfaces';

interface ResearchContextProps {
    resTitles: Title[];
    resQuestions: Question[];
    resObjectives: Objective[];
    resIntroductionOutlines: Outline[];
    setResTitles: React.Dispatch<React.SetStateAction<Title[]>>;
    setResIntroductionOutlines: React.Dispatch<React.SetStateAction<Outline[]>>;
    setResQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
    setResObjectives: React.Dispatch<React.SetStateAction<Objective[]>>;
}


const ResearchContext = createContext<ResearchContextProps | undefined>(undefined);

export const ResearchProvider = ({ children }: { children: ReactNode }) => {
    const [resTitles, setResTitles] = useState<Title[]>([{
        id: 0,
        title: "The Impact of E-learning on Student Performance During the COVID-19 Pandemic",
        analysis: "",
        titleReqs: {
            id: 0,
            topicDescription: "",
            researchType: "",
            context: "",
            initialObjectives: ""
        }
    }]);
    const [resIntroductionOutlines, setResIntroductionOutlines] = useState<Outline[]>([]);
    const [resQuestions, setResQuestions] = useState<Question[]>([{
        id: "0",
        question: "What is the level of effectiveness of e-learning platforms during the pandemic?",
        analysis: ""

    },{
        id: "0",
        question: "How does student engagement in e-learning correlate with academic performance?",
        analysis: ""

    },{
        id: "0",
        question: "What challenges do students face in accessing e-learning resources?",
        analysis: ""

    },]);
    const [resObjectives, setResObjectives] = useState<Objective[]>([{
        id: "0",
        objective: "To evaluate the effectiveness of e-learning platforms during the pandemic.",
        analysis: ""

    },{
        id: "0",
        objective: "To analyze the correlation between e-learning engagement and academic performance.",
        analysis: ""

    },{
        id: "0",
        objective: "To assess the challenges faced by students in accessing e-learning resources.",
        analysis: ""

    }]);

    return (
        <ResearchContext.Provider value={{ resTitles, resIntroductionOutlines, resQuestions, resObjectives, setResTitles, setResIntroductionOutlines, setResQuestions, setResObjectives }}>
            {children}
        </ResearchContext.Provider>
    );
};

export const useResearchContext = () => {
    const context = React.useContext(ResearchContext);
    if (!context) {
        throw new Error('useResearchContext must be used within a ResearchProvider');
    }
    return context;
};
