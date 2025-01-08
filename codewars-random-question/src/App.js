import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRandomQuestion();
  }, []);

  const fetchRandomQuestion = async () => {
    try {
      setLoading(true);
      const query = `
        query randomQuestion {
          randomQuestion {
            questionId
            title
            titleSlug
            content
            difficulty
          }
        }
      `;

      const response = await axios.post('https://leetcode.com/graphql', {
        query,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      setQuestion(response.data.data.randomQuestion);
    } catch (error) {
      console.error('Error fetching question:', error);
    } finally {
      setLoading(false);
    }
  };

  // Let's use a simpler approach with a predefined question while developing
  const sampleQuestion = {
    title: "Two Sum",
    content: `<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>
              <p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p>
              <p>You can return the answer in any order.</p>`,
    difficulty: "Easy",
    titleSlug: "two-sum"
  };

  useEffect(() => {
    // Using the sample question instead of API call for now
    setQuestion(sampleQuestion);
    setLoading(false);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>LeetCode Question Quiz</h1>
        <button onClick={() => setQuestion(sampleQuestion)}>Get New Question</button>
        
        {loading ? (
          <p>Loading...</p>
        ) : question ? (
          <div className="question-container">
            <h2>{question.title}</h2>
            <div 
              className="question-content"
              dangerouslySetInnerHTML={{ __html: question.content }}
            />
            <div className="question-info">
              <p>Difficulty: {question.difficulty}</p>
              <a 
                href={`https://leetcode.com/problems/${question.titleSlug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Solve on LeetCode
              </a>
            </div>
          </div>
        ) : (
          <p>Failed to load question. Please try again.</p>
        )}
      </header>
    </div>
  );
}

export default App;
