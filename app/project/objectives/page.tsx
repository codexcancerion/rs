'use client';
/* eslint-disable */

import React, { useState } from 'react';
import { Form, Input, Button, List, Card, message, Collapse } from 'antd';
import { Title, TitleReqs, Question, Objective } from '@/app/lib/interfaces';
import { useResearchContext } from '@/app/context/ResearchContext';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

// to save in database
// finalObjectives
// finalQuestions

const { TextArea } = Input;

const ObjectivesPage = () => {
    const { resTitles, setResTitles } = useResearchContext();
    const { resObjectives, setResObjectives } = useResearchContext();
    const { resQuestions, setResQuestions } = useResearchContext();
    // const [savedTitle, setSavedTitle] = useState<Title>();
    const [objectivesDescription, setObjectivesDescription] = useState<string>('');
    const [objectiveSuggestions, setObjectiveSuggestions] = useState<string[]>([]);
    // const [finalObjectives, setFinalObjectives] = useState<string[]>([]);
    const [questionSuggestions, setQuestionSuggestions] = useState<string[]>([]);
    // const [finalQuestions, setFinalQuestions] = useState<Question[]>([]);
    const [loadingObjectives, setLoadingObjectives] = useState<boolean>(false);
    const [loadingQuestions, setLoadingQuestions] = useState<boolean>(false);
    const [savedObjectives, setSavedObjectives] = useState<boolean>();
    const [savedQuestions, setSavedQuestions] = useState<boolean>(false);
    const [analyzingQuestion, setAnalyzingQuestion] = useState<boolean>(false);

    const generateObjectiveSuggestions = async () => {
        setLoadingObjectives(true);

        try {
            const response = await axios.post('/api/generateObjectiveSuggestions', {
                title: resTitles[0]?.title,
                description: objectivesDescription,
            });

            console.log(response)
            console.log(response.data.objectives)
            setObjectiveSuggestions(response.data.objectives.objectives);
            console.log("Objective Suggestions: " + objectiveSuggestions)
            message.success("Successfully generated objective suggestions!")
        } catch (error) {
            message.error("Problem generating objective suggestions, try again!")
            console.log("Error generating objective suggestions: " + error)
        }
        setLoadingObjectives(false);
    };

    const handleSaveObjectives = () => {
        try {
            const newObjects: Objective[] = [];
            objectiveSuggestions.map((item, index) => {
                newObjects.push({
                    id: "" + index,
                    objective: item,
                    analysis: ""
                })
            })
            setResObjectives([...newObjects]);
            message.success('Objectives finalized on context!');
            setSavedObjectives(true);
        } catch (error) {
            message.error('Problem saving objectives to Context!');
        }

    };

    function getFinalObjectivesString() {
        const finalObjectivesString: string[] = [];
        resObjectives.map(item => {
            finalObjectivesString.push(item.objective)
        })

        return finalObjectivesString;
    }

    // Handler to simulate generating objective suggestions
    const generateQuestionSuggestions = async () => {
        setLoadingQuestions(true);

        try {
            const response = await axios.post('/api/generateResearchQuestions', {
                researchTitle: resTitles[0]?.title,
                researchObjectives: getFinalObjectivesString(),
            });

            console.log(response);
            const rawQuestions = response.data.research_questions.research_questions;
            const newQuestions: string[] = [];
            rawQuestions.map((item: string) => {
                newQuestions.push(item)
            })
            setQuestionSuggestions(newQuestions);
            console.log(questionSuggestions)
        } catch (error) {
            console.error('Error generating research questions:', error);
            message.error("Problem generating research question suggestions, try again!")
        }
        setLoadingQuestions(false);
    };

    const generateQuestionAnalysis = async (index: number) => {
        // const response = "call the axios here"
        setAnalyzingQuestion(true)

        try {
            const response = await axios.post("/api/generateQuestionAnalysis", {
                researchTitle: resTitles[0]?.title,
                researchObjectives: getFinalObjectivesString(),
                researchQuestion: resQuestions[index].question
            });
            console.log(response);
            const copyQuestion = resQuestions;
            copyQuestion[index].analysis = response.data.analysis;
            setResQuestions(copyQuestion);
            console.log('Analysis Result:', response.data.analysis);
            message.success('Questions analysis was successful!');

        } catch (error: any) {
            message.error("Problem generating question analysis, try again!")
            console.error('Error fetching question analysis:', error.response ? error.response.data : error.message);
        }
        setAnalyzingQuestion(false)
    }


    // Handler for accepting research questions
    const handleSaveQuestions = () => {
        // setFinalQuestions([...questionSuggestions]);
        const copyQuestions: Question[] = [];
        questionSuggestions.map(item => {
            copyQuestions.push({
                id: "id",
                question: item,
                analysis: ""
            })
        })

        setResQuestions(copyQuestions);

        setSavedQuestions(true);
        message.success('Research questions saved successfully!');
    };

    // const handleUpdateObjectives = () => {
    //     message.success('Objectives updated successfully!');
    // };

    // const handleUpdateQuestions = () => {
    //     setResQuestions(resQuestions);
    //     message.success('Research Questions updated successfully!');
    // };

    const handleRemoveObjectiveSuggestion = (index: number) => {
        const tempObjectives = objectiveSuggestions.filter((_, idx) => idx !== index);
        setObjectiveSuggestions(tempObjectives);

        console.log("REMOVE DRAFT: " + objectiveSuggestions)
    }

    const handleRemoveObjectiveSaved = (index: number) => {
        const tempObjectives = resObjectives.filter((_, idx) => idx !== index);
        setResObjectives(tempObjectives);

        console.log("REMOVE DRAFT: " + resObjectives)
    }

    const removeQuestionSaved = ((index: number) => {
        const temp = resQuestions.filter((_, idx) => idx !== index);
        setResQuestions(temp);

        console.log("REMOVED: " + resQuestions)
    })

    const removeQuestionSuggestion = ((index: number) => {
        const temp = questionSuggestions.filter((_, idx) => idx !== index);
        setQuestionSuggestions(temp);

        console.log("REMOVED: " + questionSuggestions)
    })

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Progress Indicator */}
            <div className="mb-6">
                <div className="w-full bg-gray-300 h-2 rounded-lg">
                    <div className="bg-blue-500 h-2 rounded-lg" style={{ width: '40%' }}></div>
                </div>
                <p className="text-blue-500 text-sm mt-2">Step 2: Objectives and Research Questions</p>
            </div>

            <div className="mb-6 bg-white rounded-lg">
                <h3 className="h1 font-bold text-4xl mt-4">Saved Title</h3>
                <h2 className="rounded-lg p-2 ">{resTitles[0]?.title || "None yet"}</h2>
            </div>

            <h1 className="h1 font-bold text-4xl my-4">Research Objectives</h1>

            {/* Objectives Form */}
            {savedObjectives || resObjectives.length > 0 ? (
                <>
                    <div className="mb-6 px-8 py-4 bg-white rounded-lg">
                        <h3 className="text-xl font-semibold mb-3">Saved Objectives</h3>
                        <List
                            grid={{ gutter: 16, column: 1 }}
                            dataSource={resObjectives}
                            renderItem={(objective, index) => (
                                <List.Item>
                                    {/* <Card className="border border-gray-200 rounded-lg shadow-sm"> */}
                                    <TextArea
                                        value={objective.objective}
                                        onChange={e => {
                                            let updatedObjectives = [...resObjectives];
                                            updatedObjectives[index].objective = e.target.value;
                                            setResObjectives(updatedObjectives);
                                        }}
                                        className="border border-gray-300 rounded-lg"
                                    />
                                    {/* </Card> */}

                                    <Button
                                        type="primary"
                                        onClick={() => handleRemoveObjectiveSaved(index)}
                                        className="mt-2 bg-red-500 hover:bg-red-600 mb-4">
                                        Remove
                                    </Button>
                                </List.Item>
                            )}
                        />
                        {/* <Button
                            type="primary"
                            onClick={handleUpdateObjectives}
                            className="mt-4 bg-green-500 hover:bg-green-600 w-full">
                            Update Objectives
                        </Button> */}
                    </div>

                    <Button
                        type="primary"
                        onClick={() => { setSavedObjectives(false) }}
                        loading={loadingObjectives}
                        className="bg-blue-500 hover:bg-blue-600 w-full">
                        Generate New Objective Suggestions
                    </Button>
                </>
            ) : (
                <Form layout="vertical" className="space-y-6">
                    <Form.Item label="Describe Your Research Objectives" name="objectivesDescription">
                        <TextArea
                            rows={4}
                            placeholder="e.g., Explore how social media usage impacts adolescent mental health in urban areas."
                            value={objectivesDescription}
                            onChange={e => setObjectivesDescription(e.target.value)}
                            className="border border-gray-300 rounded-lg"
                        />
                    </Form.Item>

                    {/* Button to generate objective suggestions */}
                    <Button
                        type="primary"
                        onClick={generateObjectiveSuggestions}
                        loading={loadingObjectives}
                        className="bg-blue-500 hover:bg-blue-600 w-full">
                        Generate Objective Suggestions
                    </Button>
                </Form>
            )}




            {/* Objective Suggestions */}
            {objectiveSuggestions.length > 0 && !savedObjectives && (
                <div className="mt-8">
                    <h3 className="text-xl font-semibold">Suggested Objectives</h3>
                    <List
                        grid={{ gutter: 16, column: 1 }}
                        dataSource={objectiveSuggestions}
                        renderItem={(objective, index) => (
                            <List.Item>
                                <Card className="border border-gray-200 rounded-lg shadow-sm">
                                    <TextArea
                                        value={objective}
                                        onChange={e => {
                                            const updatedObjectives = [...objectiveSuggestions];
                                            updatedObjectives[index] = e.target.value;
                                            setObjectiveSuggestions(updatedObjectives);
                                        }}
                                        className="border border-gray-300 rounded-lg"
                                    />
                                    <Button
                                        type="primary"
                                        onClick={() => handleRemoveObjectiveSuggestion(index)}
                                        className="mt-2 bg-red-500 hover:bg-red-600 mb-4">
                                        Remove
                                    </Button>
                                </Card>
                            </List.Item>
                        )}
                    />
                    <Button
                        type="primary"
                        onClick={handleSaveObjectives}
                        className="mt-4 bg-green-500 hover:bg-green-600 w-full">
                        Finalize and Save Objectives
                    </Button>
                </div>
            )}







            <h1 className="h1 font-bold text-4xl my-4 mt-4">Research Questions</h1>

            {savedQuestions || resQuestions.length > 0 ? (
                <>
                    <div className="mb-6 px-8 py-4 bg-white rounded-lg">
                        <h3 className="text-xl font-semibold mb-3">Saved Research Questions</h3>
                        <List
                            grid={{ gutter: 16, column: 1 }}
                            dataSource={resQuestions}
                            renderItem={(question, index) => (
                                <List.Item>
                                    <TextArea
                                        defaultValue={question.question}
                                        onChange={e => {
                                            const updatedQuestions = [...resQuestions];
                                            updatedQuestions[index].question = e.target.value;
                                            setResQuestions(updatedQuestions);
                                        }}
                                        className="border border-gray-300 rounded-lg mb-2"
                                    />

                                    {question.analysis || question.analysis !== '' ? (
                                        <>
                                            <Collapse items={[{
                                                key: '1',
                                                label: 'Question Analysis',
                                                children: <ReactMarkdown className="prose">{question.analysis}</ReactMarkdown>,
                                            }]}
                                                defaultActiveKey={['0']}
                                            />
                                            {/* <div className="p-4 bg-gray-100 rounded-lg mb-8 mt-2">
                                                <h5 className="font-bold">Question Analysis:</h5>
                                                <pre className='whitespace-pre-line'>{question.analysis}</pre>
                                            </div> */}
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                type="primary"
                                                onClick={() => generateQuestionAnalysis(index)}
                                                className="mt-4 bg-green-500 hover:bg-green-600"
                                                loading={analyzingQuestion}
                                            >
                                                Generate Analysis
                                            </Button>
                                        </>
                                    )}

                                    <Button
                                        type="primary"
                                        onClick={() => removeQuestionSaved(index)}
                                        className="mt-2 mb-4 my-2 bg-red-500 hover:bg-red-600">
                                        Remove
                                    </Button>

                                </List.Item>
                            )}
                        />
                        {/* <Button
                            type="primary"
                            onClick={handleUpdateQuestions}
                            className="mt-4 bg-green-500 hover:bg-green-600 w-full">
                            Update Questions
                        </Button> */}
                    </div>
                </>
            ) : (
                <Button
                    type="primary"
                    onClick={generateQuestionSuggestions}
                    loading={loadingQuestions}
                    className="bg-blue-500 hover:bg-blue-600 w-full"
                    disabled={resObjectives.length === 0 ? true : false}>
                    Generate Research Questions Suggestions
                </Button>
            )
            }




            {/* Research Question Suggestions */}
            {
                !savedQuestions && questionSuggestions.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold">Suggested Research Questions</h3>
                        <List
                            grid={{ gutter: 16, column: 1 }}
                            dataSource={questionSuggestions}
                            renderItem={(question, index) => (
                                <List.Item>
                                    <Card className="border border-gray-200 rounded-lg shadow-sm">
                                        <TextArea
                                            value={question}
                                            onChange={e => {
                                                const updatedQuestions = [...questionSuggestions];
                                                updatedQuestions[index] = e.target.value;
                                                setQuestionSuggestions(updatedQuestions);
                                            }}
                                            className="border border-gray-300 rounded-lg"
                                        />
                                        <Button
                                            type="primary"
                                            onClick={() => removeQuestionSuggestion(index)}
                                            className="mt-2 mb-4 my-2 bg-red-500 hover:bg-red-600">
                                            Remove
                                        </Button>
                                    </Card>
                                </List.Item>
                            )}
                        />
                        <Button
                            type="primary"
                            onClick={handleSaveQuestions}
                            className="mt-4 bg-green-500 hover:bg-green-600 w-full">
                            Finalize and Save Research Questions
                        </Button>
                    </div>
                )
            }
        </div >
    );
};

export default ObjectivesPage;
