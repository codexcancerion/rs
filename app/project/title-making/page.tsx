'use client';
/* eslint-disable */

import React, { useState } from 'react';
import { Form, Input, Button, List, Card, message } from 'antd';
import axios from 'axios';
import { Title, TitleReqs } from '@/app/lib/interfaces';

const { TextArea } = Input;

// to save in database
// savedTitle
// titleSuggestions

const TitleMakingPage = () => {
  const [titleReqs, setTitleReqs] = useState<TitleReqs>({
    id: 0,
    topicDescription: "",
    researchType: "",
    context: "",
    initialObjectives: ""
  });
  const [titleSuggestions, setTitleSuggestions] = useState<Title[]>([]);
  const [customTitle, setCustomTitle] = useState<Title>({
    id: 99,
    title: '',
    analysis: '',
    titleReqs: titleReqs
  });
  const [savedTitle, setSavedTitle] = useState<Title>();  // Added to store the saved title

  const [doneTitle, setDoneTitle] = useState<boolean>(false);
  const [doneSuggestion, setDoneSuggestion] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);


  const generateTitleSuggestions = async () => {
    setLoading(true);

    try {
      const response = await axios.post('/api/generateTitle', {
        topicDescription: titleReqs.topicDescription,
        researchType: titleReqs.researchType,
        context: titleReqs.context,
        initialObjectives: titleReqs.initialObjectives,
      });

      // Assuming the API returns an array of suggested titles
      console.log(response);
      console.log("SUGGESTIONS: " + response.data.suggestions);

      // setTitleSuggestions(response.data.suggestions);
      const suggestions = response.data.suggestions;
      const tempSuggestion: Title[] = [];
      suggestions.map((item: string, idx: number) => {
        tempSuggestion.push({
          id: idx,
          title: item,
          analysis: "",
          titleReqs: titleReqs
        })
      })

      setTitleSuggestions(tempSuggestion);

      setDoneSuggestion(true);
    } catch (error) {
      console.error('Error generating title suggestions:', error);
      message.error('Failed to generate title suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const generateTitleAnalysis = async (title: Title, isSavedTitle: boolean) => {
    setLoading(true);

    try {
      const response = await axios.post('/api/generateTitleAnalysis', {
        title: title.title,
      });

      // Assuming the API returns an array of suggested titles
      console.log(response);
      console.log("ANALYSIS: " + response.data.analysis);

      const titleSuggestionsMutation = titleSuggestions;

      isSavedTitle ? setSavedTitle({
        id: title.id,
        title: title.title,
        analysis: response.data.analysis,
        titleReqs: title.titleReqs,
      })
        :
        titleSuggestionsMutation.map(item => {
          if (item.id === title.id) item.analysis = response.data.analysis;
        })
      setTitleSuggestions(titleSuggestionsMutation);

      // setAnalysis(response.data.analysis);
      // setDoneAnalysis(true);
    } catch (error) {
      console.error('Error generating title analysis:', error);
      message.error('Failed to generate title analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomTitle = (title: string) => {
    const newTitle = {
      id: ++titleSuggestions.length,
      title: title,
      analysis: '',
      titleReqs: titleReqs
    };
    setCustomTitle(newTitle);
    handleAcceptTitle(customTitle || newTitle);
  }

  const handleAcceptTitle = (title: Title) => {
    setSavedTitle(title);
    setDoneTitle(true)
    message.success(`Title "${title.title}" accepted!`);
  };

  return (
    <div className="container mx-auto px-4 py-8">

      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="w-full bg-gray-300 h-2 rounded-lg">
          <div className="bg-blue-500 h-2 rounded-lg" style={{ width: '20%' }}></div>
        </div>
        <p className="text-blue-500 text-sm mt-2">Step 1: Title Making</p>
      </div>

      {savedTitle && (
        <div className="mb-6 px-8 py-4 bg-white rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Saved Title</h3>
          <TextArea
            value={savedTitle.title}
            onChange={e => {
              setSavedTitle({ ...savedTitle, title: e.target.value });
            }}
            className="border border-gray-300 rounded-lg"
          />
          
          {/* DISPLAY ANALYSIS IF IT IS PRESENT */}
          {savedTitle.analysis || savedTitle.analysis !== '' ? (
            <>
              {/* <h4 className="text-lg font-semibold">Title Analysis</h4> */}
              <div className="p-4 bg-gray-100 rounded-lg">
                <h5 className="font-bold">Analysis:</h5>
                <p><pre className='whitespace-pre-line'>{savedTitle.analysis}</pre></p>
              </div>
            </>
          ) : (
            <Button
              type="primary"
              className="mt-2 bg-green-500 hover:bg-green-600"
              onClick={() => generateTitleAnalysis(savedTitle, true)}
              loading={loading}>
              Generate Analysis
            </Button>
          )}
        </div>
      )}

      {/* Title Making Form */}
      {!doneTitle ? (
        <Form layout="vertical" className="space-y-6">
          <Form.Item label="Describe Your Research Topic" name="topic">
            <TextArea
              rows={4}
              placeholder="e.g., Exploring the impact of social media on adolescent mental health in urban areas."
              className="border border-gray-300 rounded-lg"
              onChange={(e) => {
                setTitleReqs({
                  ...titleReqs,
                  topicDescription: e.target.value,
                })
              }}
            />
          </Form.Item>

          <Form.Item label="Research Type" name="researchType">
            <Input
              placeholder="e.g., Review of Related Literature"
              className="border border-gray-300 rounded-lg"
              onChange={(e) => {
                setTitleReqs({
                  ...titleReqs,
                  researchType: e.target.value,
                })
              }}
            />
          </Form.Item>

          <Form.Item label="Context or Localization (Optional)" name="context">
            <Input
              placeholder="e.g., Adolescents in Metro Manila"
              className="border border-gray-300 rounded-lg"
              onChange={(e) => {
                setTitleReqs({
                  ...titleReqs,
                  context: e.target.value,
                })
              }}
            />
          </Form.Item>

          <Form.Item label="Research Objectives" name="objectives">
            <TextArea
              rows={3}
              placeholder="e.g., To identify the frequency of social media use among adolescents."
              className="border border-gray-300 rounded-lg"
              onChange={(e) => {
                setTitleReqs({
                  ...titleReqs,
                  initialObjectives: e.target.value,
                })
              }}
            />
          </Form.Item>

          {/* Button to generate title suggestions */}
          <Button
            type="primary"
            onClick={generateTitleSuggestions}
            loading={loading}
            className="bg-blue-500 hover:bg-blue-600 w-full">
            Generate Title Suggestions
          </Button>
        </Form>
      ) : (

        <Button
          type="primary"
          onClick={() => setDoneTitle(false)}
          loading={loading}
          className="bg-blue-500 hover:bg-blue-600 w-full">
          Generate New Title Suggestions
        </Button>
      )}

      {/* GENERATION OF TITLE SUGGESTIONS*/}
      {titleSuggestions.length > 0 && !doneTitle && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold">Suggested Titles</h3>
          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={titleSuggestions}
            renderItem={title => (
              <List.Item>
                <Card className="border border-gray-200 rounded-lg shadow-sm">
                  <p>{title.title}</p>
                  <Button
                    type="primary"
                    className="mt-2 bg-green-500 hover:bg-green-600"
                    onClick={() => handleAcceptTitle(title)}>
                    Accept
                  </Button>

                  {/* DISPLAY ANALYSIS IF IT IS PRESENT */}
                  {title.analysis || title.analysis !== '' ? (
                    <>
                      {/* <h4 className="text-lg font-semibold">Title Analysis</h4> */}
                      <div className="p-4 bg-gray-100 rounded-lg">
                        <h5 className="font-bold">Analysis:</h5>
                        <p><pre className='whitespace-pre-line'>{title.analysis}</pre></p>
                      </div>
                    </>
                  ) : (
                    <Button
                      type="primary"
                      className="mt-2 bg-green-500 hover:bg-green-600"
                      onClick={() => generateTitleAnalysis(title, false)}
                      loading={loading}>
                      Generate Analysis
                    </Button>
                  )}
                </Card>
              </List.Item>
            )}
          />
        </div>
      )}

      {/* Custom Title Section */}
      {doneSuggestion && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold">Save your own title instead</h3>
          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={['']}
            renderItem={() => (
              <List.Item>
                <Card className="border border-gray-200 rounded-lg shadow-sm">
                  <Form layout="vertical" className="space-y-6">
                    <Form.Item label="Your custom title" name="customTitle">
                      <Input
                        placeholder="Enter your own title"
                        value={customTitle?.title}
                        onChange={e => customTitle.title = e.target.value}
                        className="border border-gray-300 rounded-lg"
                      />
                    </Form.Item>
                    <Button
                      type="primary"
                      className="mt-2 bg-green-500 hover:bg-green-600"
                      onClick={() => handleAcceptTitle(customTitle)}>
                      Save
                    </Button>
                  </Form>
                </Card>
              </List.Item>
            )}
          />
        </div>
      )}

      {/* Save and Continue Button */}
      <Button
        type="primary"
        className="bg-green-500 hover:bg-green-600 w-full mt-10">
        Save and Continue
      </Button>
    </div>
  );
};

export default TitleMakingPage;




// How does zero trust policy work; Successful implementation of zero trust policy; Steps in implementation
// Work from anywhere platforms
// Literature Review
// explore the use of zero trust policy and how to implement it