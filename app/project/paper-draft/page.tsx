"use client"
/* eslint-disable */
import React from 'react';
import { useResearchContext } from '@/app/context/ResearchContext';

const PaperDraft = () => {
  const { resTitles, resObjectives, resQuestions, resIntroductionOutlines } = useResearchContext();

  return (
    // <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Research Paper Draft</h1>
        
        {/* Display Titles */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Title</h2>
          {resTitles.length > 0 ? (
              <div key={resTitles[0].id} className="mb-6 p-4 border rounded-md bg-gray-50">
                <h3 className="text-xl font-medium text-blue-600">{resTitles[0].title}</h3>
                {/* <p className="text-gray-700 mt-2"><strong>Analysis:</strong> {resTitles[0].analysis}</p> */}
              </div>            
          ) : (
            <p className="text-gray-500">No titles available.</p>
          )}
        </section>

        {/* Display Objectives */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Objectives</h2>
          {resObjectives.length > 0 ? (
            resObjectives.map((objective, index) => (
              <div key={index} className="mb-4 p-4 border rounded-md bg-gray-50">
                <p className="text-gray-700"><strong>{index+1}. </strong> {objective.objective}</p>
                {/* <p className="text-gray-500 mt-2"><strong>Analysis:</strong> {objective.analysis}</p> */}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No objectives available.</p>
          )}
        </section>

        {/* Display Questions */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Research Questions</h2>
          {resQuestions.length > 0 ? (
            resQuestions.map((question, index) => (
              <div key={index} className="mb-4 p-4 border rounded-md bg-gray-50">
                <p className="text-gray-700"><strong>{index+1}. </strong> {question.question}</p>
                {/* <p className="text-gray-500 mt-2"><strong>Analysis:</strong> {question.analysis}</p> */}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No questions available.</p>
          )}
        </section>


        {/* Display Introduction */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Introduction</h2>
          {resIntroductionOutlines.length > 0 ? (
            resIntroductionOutlines.map((outline, index) => (
              <div key={index} className="mb-4 p-4 border rounded-md bg-gray-50">
                <p className="text-gray-700">{outline.description.join("\n")}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No questions available.</p>
          )}
        </section>
      </div>
    // </div>
  );
};

export default PaperDraft;
