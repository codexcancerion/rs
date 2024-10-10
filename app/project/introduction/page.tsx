"use client";
/* eslint-disable */

import React, { useEffect, useState } from 'react';
import { Form, Input, Button, List, Card, message } from 'antd';
import { Outline } from '@/app/lib/interfaces';
import { useResearchContext } from '@/app/context/ResearchContext';
// import { getResIntroductionOutlinesDescriptions, getResIntroductionOutlinesPrompts, getResObjectivesString, getResQuestionsString } from '@/app/lib/getters';
import axios from 'axios';

const { TextArea } = Input;

// TO SAVE
// introductionDrafts

const IntroductionPage = () => {
    const { resIntroductionOutlines, setResIntroductionOutlines } = useResearchContext();
    const { resTitles, setResTitles } = useResearchContext();
    const { resObjectives, resQuestions } = useResearchContext();

    const [soloOutline, setSoloOutline] = useState<string>('');
    const [newOutlineItem, setNewOutlineItem] = useState<string>('');

    const [loading, setLoading] = useState(false);
    const [doneGeneratingDraft, setDoneGeneratingDraft] = useState(false);


    useEffect(() => {
        console.log(resIntroductionOutlines)
    }, resIntroductionOutlines)


    const addOutlineItem = () => {
        if (newOutlineItem.trim() !== '') {
            const newDraft = {
                id: resIntroductionOutlines.length + 1,
                description: [""],
                prompt: newOutlineItem,
                referenceLinks: [""]
            };

            console.log(newDraft);

            resIntroductionOutlines.push(newDraft);
            setNewOutlineItem('');
            console.log(resIntroductionOutlines)
        } else {
            message.warning("Outline item can't be empty");
        }
    };



    const removeOutlineItem = (index: number) => {
        const updatedItems = resIntroductionOutlines.filter((_, idx) => idx !== index);
        setResIntroductionOutlines(updatedItems);
    };



    const generateIntroductionDrafts = async () => {
        setLoading(true);
        const introductionDraftsMutation = resIntroductionOutlines;

        const data = {
            title: resTitles[0].title,
            objectives: getResObjectivesString(),
            questions: getResQuestionsString(),
            outlines: getResIntroductionOutlinesPrompts(),
        }

        try {
            console.log("data: " + data)
            const response = await axios.post('/api/generateIntroductionDraft', data);

            const newDraft: Outline[] = [];

            // JSON.stringify(response)
            // console.log("generateDraft: " + JSON.stringify(response))
            const rawDraft = response.data.introduction_drafts.introduction_drafts;
            // console.log(`rawDraft: ${JSON.stringify(rawDraft)}`)
            // introduction_drafts: {description: ["outline1"], referenceLinks: ["link.com"]}
            // console.log("mutation: "+JSON.stringify(introductionDraftsMutation))
            console.log("mutation length: " + introductionDraftsMutation.length)
            console.log("rawDraft length: " + rawDraft.length)
            for (let i = 0; i < introductionDraftsMutation.length; i++) {
                const item = rawDraft[i];
                const temp: Outline = {
                    id: introductionDraftsMutation[i].id,
                    prompt: introductionDraftsMutation[i].prompt,
                    description: item.description,
                    referenceLinks: item.referenceLinks
                }
                newDraft.push(temp);
                console.log(JSON.stringify(newDraft))

            }
            // rawDraft.map((item: any, index: number) => {
            //     const temp: Outline = {
            //         id: introductionDraftsMutation[index].id,
            //         prompt: introductionDraftsMutation[index].prompt,
            //         description: item.description,
            //         referenceLinks: item.referenceLinks
            //     }
            //     newDraft.push(temp);
            //     console.log(JSON.stringify(newDraft))
            //     // introductionDraftsMutation[index].description = item.description;
            //     // introductionDraftsMutation[index].referenceLinks = item.referenceLinks;
            // })

            setResIntroductionOutlines(newDraft);
            console.log(resIntroductionOutlines);
            setDoneGeneratingDraft(true);
        } catch (error) {
            console.error('Error generating drafts:', error);
            message.error("Problem generating drafts, try again!")
        }

        setLoading(false);
    };


    // const generateDraft = async (prompt: string) => {  
    // }

    const generateDraftAndInsert = async (prompt: string, index: number) => {
        const data = {
            title: resTitles[0].title,
            objectives: getResObjectivesString(),
            questions: getResQuestionsString(),
            introDraft: getResIntroductionOutlinesDescriptions(),
            outline: prompt,
        }

        try {
            const response = await axios.post('/api/generateSingleIntroductionDraft', data);

            console.log("generateDraftAndInset: " + response.data)
            const rawDraft = response.data.introduction_drafts.introduction_drafts;
            // introduction_drafts: {description: ["outline1"], referenceLinks: ["link.com"]}
            const newDraft: Outline = {
                id: 0,
                description: rawDraft.description,
                prompt: prompt,
                referenceLinks: rawDraft.referenceLinks
            };

            // INSERTION CODE
            const draftUpdate = [
                ...resIntroductionOutlines.slice(0, index + 1),
                newDraft,
                ...resIntroductionOutlines.slice(index + 1),
            ];
            console.log(draftUpdate);
            setResIntroductionOutlines(draftUpdate);

        } catch (error) {
            console.error('Error generating drafts:', error);
            message.error("Problem generating drafts, try again!")
        }
    }

    const generateOneDraft = async (i: number) => {
        setLoading(true);
        await generateDraftAndInsert(soloOutline, i);
        console.log(resIntroductionOutlines);
        setDoneGeneratingDraft(true);
        setLoading(false);
    };

    const handleRemoveDraft = (index: number) => {

        const tempDraft = resIntroductionOutlines.filter((_, idx) => idx !== index);
        setResIntroductionOutlines(tempDraft);

        console.log("REMOVE DRAFT: " + resIntroductionOutlines)
    }

    const getResQuestionsString = () => {
        // const { resQuestions} = useResearchContext();
        const temp: string[] = [];
        resQuestions.map((item) => {
            temp.push(item.question);
        })
        return temp;
    }

    const getResObjectivesString = () => {
        // const { resObjectives } = useResearchContext();
        const temp: string[] = [];
        resObjectives.map((item) => {
            temp.push(item.objective);
        })
        return temp;
    }

    const getResIntroductionOutlinesPrompts = () => {
        // const { resIntroductionOutlines } = useResearchContext();
        const temp: string[] = [];
        resIntroductionOutlines.map((item) => {
            temp.push(item.prompt);
        })
        return temp;
    }

    const getResIntroductionOutlinesDescriptions = () => {
        // const { resIntroductionOutlines } = useResearchContext();
        const temp: string[] = [];
        resIntroductionOutlines.map((item) => {
            temp.push(item.description.join('\n'));
        })
        return temp;
    }



    return (
        <div className="container mx-auto px-4 py-8">
            {/* Progress Indicator */}
            <div className="mb-6">
                <div className="w-full bg-gray-300 h-2 rounded-lg">
                    <div className="bg-blue-500 h-2 rounded-lg" style={{ width: '60%' }}></div>
                </div>
                <p className="text-blue-500 text-sm mt-2">Step 3: Draft Introduction</p>
            </div>

            {/* Input for Research Description */}
            {!doneGeneratingDraft ? (
                <Form layout="vertical" className="space-y-6">
                    <Form.Item label="Research Description">
                        <TextArea
                            rows={4}
                            placeholder="Provide a brief description of your research..."
                            className="border border-gray-300 rounded-lg"
                        />
                    </Form.Item>

                    {/* Outline Section */}
                    <Form.Item label="Research Outline">
                        <Input
                            value={newOutlineItem}
                            placeholder="Add an outline item (e.g., Background of the study)"
                            onChange={(e) => setNewOutlineItem(e.target.value)}
                            className="border border-gray-300 rounded-lg"
                        />
                        <Button onClick={addOutlineItem} type="primary" className="mt-2 bg-blue-500 hover:bg-blue-600">
                            Add Outline Item
                        </Button>
                    </Form.Item>

                    {/* Display the outline items */}
                    {resIntroductionOutlines.length > 0 && (
                        <List
                            className="mt-4"
                            dataSource={resIntroductionOutlines.map((item, index) => ({
                                key: index,
                                content: (
                                    <Card className="border border-gray-300 rounded-lg w-full">
                                        {`Outline ${index + 1}: ${item.prompt}`}
                                    </Card>
                                ),
                                actions: [
                                    <Button
                                        key={index}
                                        type="link"
                                        className="text-red-500"
                                        onClick={() => removeOutlineItem(index)}
                                    >
                                        Remove
                                    </Button>,
                                ]
                            }))}
                            renderItem={(item) => (
                                <List.Item actions={item.actions}>
                                    {item.content}
                                </List.Item>
                            )}
                        />
                    )}

                    {/* Generate Introduction Button */}
                    <Button
                        type="primary"
                        onClick={generateIntroductionDrafts}
                        loading={loading}
                        className="bg-blue-500 hover:bg-blue-600 w-full mt-4"
                    >
                        Generate Introduction Drafts
                    </Button>
                </Form>
            ) : (
                <Button
                    type="primary"
                    onClick={() => {
                        setResIntroductionOutlines([]);
                        setDoneGeneratingDraft(false);
                    }}
                    loading={loading}
                    className="bg-blue-500 hover:bg-blue-600 w-full mt-4"
                >
                    Generate New Introduction Drafts
                </Button>
            )}

            {/* Display Generated Drafts */}
            {resIntroductionOutlines.length > 0 && doneGeneratingDraft && (
                <div className="mt-8">
                    <h3 className="text-xl font-semibold">Generated Introduction Drafts</h3>
                    {resIntroductionOutlines.map((draft, index) => {
                        return (
                            <div key={index} className="flex flex-col w-full">
                                <Card className="border border-gray-300 rounded-lg shadow-sm w-full mb-4">
                                    <p className="font-grey-500">Outline: {draft.prompt}</p>
                                    {draft.description.map((desc, idx) => {
                                        return (
                                            <TextArea
                                                key={idx}
                                                rows={3}
                                                defaultValue={desc}
                                                className="border border-gray-300 rounded-lg mt-2"
                                            />
                                        )
                                    })}

                                    <Button
                                        onClick={() => handleRemoveDraft(index)}
                                        type="primary"
                                        className="mt-2 bg-red-500 hover:bg-red-600"
                                        loading={loading}
                                    >
                                        Remove
                                    </Button>
                                </Card>
                                <Form layout="horizontal" className="space-y-6">
                                    <Form.Item label="Insert here" layout="horizontal">
                                        <Input
                                            placeholder="Add an outline item"
                                            onChange={(e) => {
                                                setSoloOutline(e.target.value);
                                            }}
                                            className="border border-gray-300 rounded-lg"
                                        />
                                        <Button
                                            onClick={() => generateOneDraft(index)}
                                            type="primary"
                                            className="mt-2 bg-blue-500 hover:bg-blue-600"
                                            loading={loading}
                                        >
                                            Add Outline Item
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Save and Continue Button */}
            <Button type="primary" className="bg-green-500 hover:bg-green-600 w-full mt-10">
                Save and Continue
            </Button>
        </div>
    );
};

export default IntroductionPage;
