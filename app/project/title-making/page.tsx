'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Select, List, Card, message, Collapse } from 'antd';
import axios from 'axios';

const { TextArea } = Input;
const { Option } = Select;

interface TitleReqs {
  id: number;
  topicDescription: string;
  researchType: string;
  context: string;
  initialObjectives: string
}

const TitleMakingPage = () => {
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [savedTitle, setSavedTitle] = useState<string>('');  // Added to store the saved title
  const [doneTitle, setDoneTitle] = useState<boolean>(false);
  const [doneSuggestion, setDoneSuggestion] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null); // To store the analysis result
  const [doneAnalysis, setDoneAnalysis] = useState(false);
  const [titleReqs, setTitleReqs] = useState<TitleReqs>({
    id: 0,
    topicDescription: "",
    researchType: "",
    context: "",
    initialObjectives: ""
  });


  // How does zero trust policy work; Successful implementation of zero trust policy; Steps in implementation
  // Work from anywhere platforms
  // Literature Review
  // explore the use of zero trust policy and how to implement it

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
      setTitleSuggestions(response.data.suggestions);
      setDoneSuggestion(true);
    } catch (error) {
      console.error('Error generating title suggestions:', error);
      message.error('Failed to generate title suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const generateTitleAnalysis = async (title: string) => {
    setLoading(true);

    try {
      const response = await axios.post('/api/generateTitleAnalysis', {
        title: title,
      });

      // Assuming the API returns an array of suggested titles
      console.log(response);
      console.log("ANALYSIS: " + response.data.analysis);
      setAnalysis(response.data.analysis);
      setDoneAnalysis(true);
    } catch (error) {
      console.error('Error generating title analysis:', error);
      message.error('Failed to generate title analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  // Handler for accepting a title
  const handleAcceptTitle = (title: string) => {
    setSavedTitle(title);  // Update saved title state
    setDoneTitle(true)
    message.success(`Title "${title}" accepted!`);
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
            defaultValue={savedTitle}
            onChange={e => {
              setSavedTitle(e.target.value);
            }}
            className="border border-gray-300 rounded-lg"
          />
          <Button
            type="primary"
            className="mt-2 bg-green-500 hover:bg-green-600"
            onClick={() => generateTitleAnalysis(savedTitle)}
            loading={loading}>
            Generate Analysis
          </Button>

          {analysis && (
            <>
              <h4 className="text-lg font-semibold">Title Analysis</h4>
              <div className="p-4 bg-gray-100 rounded-lg">
                <h5 className="font-bold">Analysis:</h5>
                {/* <pre>{JSON.stringify(analysis, null, 2)}</pre> Display analysis in a formatted way */}
                <p><pre className='whitespace-pre-line'>{analysis}</pre></p>
              </div>
            </>
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

      {/* Title Suggestions Section */}
      {titleSuggestions.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold">Suggested Titles</h3>
          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={titleSuggestions}
            renderItem={title => (
              <List.Item>
                <Card className="border border-gray-200 rounded-lg shadow-sm">
                  <p>{title}</p>
                  <Button
                    type="primary"
                    className="mt-2 bg-green-500 hover:bg-green-600"
                    onClick={() => handleAcceptTitle(title)}>
                    Accept
                  </Button>
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
                        value={customTitle}
                        onChange={e => setCustomTitle(e.target.value)}
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
