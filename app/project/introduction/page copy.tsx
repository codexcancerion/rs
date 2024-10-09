"use client";

import React, { useState } from 'react';
import { Form, Input, Button, List, Card, message } from 'antd';

const { TextArea } = Input;

const IntroductionPage = () => {
    const [outlineItems, setOutlineItems] = useState<string[]>([]);
    const [soloOutline, setSoloOutline] = useState<string>('');
    const [newOutlineItem, setNewOutlineItem] = useState<string>('');
    const [introductionDrafts, setIntroductionDrafts] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [doneGeneratingDraft, setDoneGeneratingDraft] = useState(false);

    const addOutlineItem = () => {
        if (newOutlineItem.trim() !== '') {
            setOutlineItems([...outlineItems, newOutlineItem]);
            setNewOutlineItem('');
        } else {
            message.warning("Outline item can't be empty");
        }
    };

    const removeOutlineItem = (index: number) => {
        const updatedItems = outlineItems.filter((_, idx) => idx !== index);
        setOutlineItems(updatedItems);
    };

    const generateIntroductionDrafts = () => {
        setLoading(true);

        // Simulate API request for generating introduction drafts based on title, objectives, and outline.
        setTimeout(() => {
            const drafts = outlineItems.map(
                (item, index) => `Section ${index + 1}: Introduction based on "${item}"`
            );
            setIntroductionDrafts(drafts);
            setDoneGeneratingDraft(true);
            setLoading(false);
        }, 1000);
    };


    const generateOneDraft = (i: number) => {
        setLoading(true);
    
        // Simulate API request for generating introduction drafts based on title, objectives, and outline.
        setTimeout(() => {
            const result = `New Section: Introduction based on "${soloOutline}"`;
    
            // Create new arrays to trigger re-render
            const updatedIntroductionDrafts = [
                ...introductionDrafts.slice(0, i + 1),
                result,
                ...introductionDrafts.slice(i + 1),
            ];
    
            const updatedOutlineItems = [
                ...outlineItems.slice(0, i + 1),
                soloOutline,
                ...outlineItems.slice(i + 1),
            ];
    
            // Set state with new arrays to trigger re-render
            setIntroductionDrafts(updatedIntroductionDrafts);
            setOutlineItems(updatedOutlineItems);
    
            console.log(updatedIntroductionDrafts);
            console.log(updatedOutlineItems);
    
            setDoneGeneratingDraft(true);
            setLoading(false);
        }, 1000);
    };
    

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
            {!doneGeneratingDraft || introductionDrafts.length === 0 ? (

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
                    {outlineItems.length > 0 && (
                        <List
                            className="mt-4"
                            dataSource={outlineItems}
                            renderItem={(item, index) => (
                                <List.Item
                                    actions={[
                                        <Button
                                            type="link"
                                            className="text-red-500"
                                            onClick={() => removeOutlineItem(index)}
                                        >
                                            Remove
                                        </Button>,
                                    ]}
                                >
                                    <Card className="border border-gray-300 rounded-lg w-full">
                                        {`Outline ${index + 1}: ${item}`}
                                    </Card>
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
                        setDoneGeneratingDraft(false);
                    }}
                    loading={loading}
                    className="bg-blue-500 hover:bg-blue-600 w-full mt-4"
                >
                    Generate New Introduction Drafts
                </Button>
            )}





            {/* Display Generated Drafts */}
            {introductionDrafts.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-xl font-semibold">Generated Introduction Drafts</h3>
                    <List
                        className="mt-4"
                        dataSource={introductionDrafts}
                        renderItem={(draft, index) => (
                            <List.Item>
                                <div className="flex flex-col w-full">
                                    <Card className="border border-gray-300 rounded-lg shadow-sm w-full mb-4">
                                        <p className='font-grey-500'>Outline: {outlineItems[index]}</p>
                                        {/* User can edit each section */}
                                        <TextArea
                                            rows={3}
                                            defaultValue={draft}
                                            className="border border-gray-300 rounded-lg mt-2"
                                        />
                                    </Card>

                                    {/* Outline Section */}
                                    <Form layout="horizontal" className="space-y-6">
                                        <Form.Item label="Insert here" layout="horizontal">
                                            <Input
                                                defaultValue={"Something"}
                                                placeholder="Add an outline item"
                                                onChange={(e) => {
                                                    setSoloOutline(e.target.value);
                                                }}
                                                className="border border-gray-300 rounded-lg"
                                            />
                                            <Button onClick={() => generateOneDraft(index)} type="primary" className="mt-2 bg-blue-500 hover:bg-blue-600">
                                                Add Outline Item
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </div>
                            </List.Item>
                        )}
                    />
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
