import React, { createContext, useState, ReactNode } from 'react';
import { Title, TitleReqs, Outline, Question, Objective } from '@/app/lib/interfaces';

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
        title: "",
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
    const [resQuestions, setResQuestions] = useState<Question[]>([]);
    const [resObjectives, setResObjectives] = useState<Objective[]>([]);

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
