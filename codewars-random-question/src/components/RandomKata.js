import React, { useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { marked } from 'marked';


const RandomKata = () => {
    const [kata, setKata] = useState(null);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);

  const kataIds = [
    'valid-braces',
    'multiples-of-3-and-5',
    'sum-of-digits',
    'who-likes-it',
    'create-phone-number',
    'find-the-odd-int',
    'square-every-digit',
    'highest-and-lowest'
  ];

  const formatDescription = (description) => {
    const cleanHtml = DOMPurify.sanitize(marked(description));
    return cleanHtml;
  };


  const getRandomKata = async () => {
    setLoading(true);
    try {
      const randomId = kataIds[Math.floor(Math.random() * kataIds.length)];
      const response = await axios.get(`https://www.codewars.com/api/v1/code-challenges/${randomId}`);
      setKata({
        ...response.data,
        description: formatDescription(response.data.description)
      });
    } catch (error) {
      console.error('Error fetching kata:', error);
    }
    setLoading(false);
  };
  

  return (
    <div className="kata-container">
      <h1>Random Codewars Kata</h1>
      <button 
        onClick={getRandomKata}
        disabled={loading}
        className="fetch-button"
      >
        {loading ? 'Loading...' : 'Get Random Kata'}
      </button>

      {kata && (
        <div className="kata-details">
          <div className="kata-grid">
            <div className="kata-info">
              <h2>{kata.name}</h2>
              <p><strong>Difficulty:</strong> {kata.rank?.name}</p>
              <p><strong>Category:</strong> {kata.category}</p>
              <p><strong>Languages:</strong> {kata.languages.join(', ')}</p>
              <p><strong>Total Completed:</strong> {kata.totalCompleted}</p>
            </div>
            
            <div className="kata-description-container">
              <p><strong>Description:</strong></p>
              <div 
                className={`kata-description ${expanded ? 'expanded' : ''}`}
                dangerouslySetInnerHTML={{ __html: kata.description }} 
              />
              <button 
                className="read-more-btn"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? 'Show Less' : 'Read More...'}
              </button>
            </div>
          </div>
          
          <a 
            href={kata.url}
            target="_blank"
            rel="noopener noreferrer"
            className="solve-button"
          >
            Solve this kata
          </a>
        </div>
      )}
    </div>
  );
};

export default RandomKata;