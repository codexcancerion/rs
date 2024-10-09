'use client';

import React, { useState } from 'react';
import { Form, Input, Button, List, Card, message } from 'antd';

const { TextArea } = Input;

const ObjectivesPage = () => {
    const [objectivesDescription, setObjectivesDescription] = useState<string>('');
    const [objectiveSuggestions, setObjectiveSuggestions] = useState<string[]>([]);
    const [finalObjectives, setFinalObjectives] = useState<string[]>([]);
    const [questionSuggestions, setQuestionSuggestions] = useState<string[]>([]);
    const [finalQuestions, setFinalQuestions] = useState<string[]>([]);
    const [loadingObjectives, setLoadingObjectives] = useState<boolean>(false);
    const [loadingQuestions, setLoadingQuestions] = useState<boolean>(false);
    // const [doneObjectives, setDoneObjectives] = useState<boolean>(false);
    const [savedObjectives, setSavedObjectives] = useState<boolean>(false);
    const [savedQuestions, setSavedQuestions] = useState<boolean>(false);

    // Handler to simulate generating objective suggestions
    const generateObjectiveSuggestions = () => {
        setLoadingObjectives(true);
        // Simulate API call or backend logic for suggestions
        setTimeout(() => {
            setObjectiveSuggestions([
                'To analyze the impact of social media usage on adolescent mental health.',
                'To determine the relationship between the frequency of social media usage and anxiety levels among adolescents.',
                'To explore how social media affects the psychological well-being of teenagers in urban areas.'
            ]);
            setLoadingObjectives(false);
        }, 1000);
    };

    // Handler for accepting objectives and generating research questions
    const handleSaveObjectives = () => {
        message.success('Objectives finalized!');
        setFinalObjectives([...objectiveSuggestions]); // Save objectives

        setSavedObjectives(true);
    };

    // Handler to simulate generating objective suggestions
    const generateQuestionSuggestions = () => {
        setLoadingQuestions(true);
        // Simulate API call or backend logic for suggestions
        setTimeout(() => {
            setQuestionSuggestions([
                'How does the frequency of social media usage affect adolescent mental health?',
                'What is the relationship between anxiety levels and time spent on social media?',
                'How does social media contribute to emotional well-being in adolescents?'
            ]);
            setLoadingQuestions(false);
        }, 1000);
    };

    // Handler for accepting research questions
    const handleSaveQuestions = () => {
        setFinalQuestions([...questionSuggestions]);
        setSavedQuestions(true);
        message.success('Research questions saved successfully!');
    };

    const handleUpdateObjectives = () => {
        message.success('Objectives updated successfully!');
    };

    const handleUpdateQuestions = () => {
        message.success('Research Questions updated successfully!');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Progress Indicator */}
            <div className="mb-6">
                <div className="w-full bg-gray-300 h-2 rounded-lg">
                    <div className="bg-blue-500 h-2 rounded-lg" style={{ width: '40%' }}></div>
                </div>
                <p className="text-blue-500 text-sm mt-2">Step 2: Objectives and Research Questions</p>
            </div>


            <h1 className="h1 font-bold text-4xl my-4">Research Objectives</h1>

            {/* Objectives Form */}
            {savedObjectives ? (
                <>
                    <div className="mb-6 px-8 py-4 bg-white rounded-lg">
                        <h3 className="text-xl font-semibold mb-3">Saved Objectives</h3>
                        <List
                            grid={{ gutter: 16, column: 1 }}
                            dataSource={finalObjectives}
                            renderItem={(objective, index) => (
                                <List.Item>
                                    {/* <Card className="border border-gray-200 rounded-lg shadow-sm"> */}
                                    <TextArea
                                        value={objective}
                                        onChange={e => {
                                            const updatedObjectives = [...finalObjectives];
                                            updatedObjectives[index] = e.target.value;
                                            setFinalObjectives(updatedObjectives);
                                        }}
                                        className="border border-gray-300 rounded-lg"
                                    />
                                    {/* </Card> */}
                                </List.Item>
                            )}
                        />
                        <Button
                            type="primary"
                            onClick={handleUpdateObjectives}
                            className="mt-4 bg-green-500 hover:bg-green-600 w-full">
                            Update Objectives
                        </Button>
                    </div>

                    <Button
                        type="primary"
                        onClick={() => { setSavedObjectives(false) }}
                        loading={loadingObjectives}
                        className="bg-blue-500 hover:bg-blue-600 w-full"
                        disabled={!objectivesDescription}>
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
                        className="bg-blue-500 hover:bg-blue-600 w-full"
                        disabled={!objectivesDescription}>
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

            {savedQuestions ? (
                <>
                    <div className="mb-6 px-8 py-4 bg-white rounded-lg">
                        <h3 className="text-xl font-semibold mb-3">Saved Research Questions</h3>
                        <List
                            grid={{ gutter: 16, column: 1 }}
                            dataSource={finalQuestions}
                            renderItem={(question, index) => (
                                <List.Item>
                                    <TextArea
                                        value={question}
                                        onChange={e => {
                                            const updatedQuestions = [...finalQuestions];
                                            updatedQuestions[index] = e.target.value;
                                            setFinalQuestions(updatedQuestions);
                                        }}
                                        className="border border-gray-300 rounded-lg"
                                    />
                                </List.Item>
                            )}
                        />
                        <Button
                            type="primary"
                            onClick={handleUpdateQuestions}
                            className="mt-4 bg-green-500 hover:bg-green-600 w-full">
                            Update Questions
                        </Button>
                    </div>
                </>
            ) : (
                <Button
                    type="primary"
                    onClick={generateQuestionSuggestions}
                    loading={loadingQuestions}
                    className="bg-blue-500 hover:bg-blue-600 w-full"
                    disabled={finalObjectives.length === 0 ? true : false}>
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
