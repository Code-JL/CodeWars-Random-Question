import React, { useState } from 'react';
import axios from 'axios';

const RandomKata = () => {
  const [kata, setKata] = useState(null);
  const [loading, setLoading] = useState(false);

  // List of common kata IDs to randomly select from
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

  const getRandomKata = async () => {
    setLoading(true);
    try {
      const randomId = kataIds[Math.floor(Math.random() * kataIds.length)];
      const response = await axios.get(`https://www.codewars.com/api/v1/code-challenges/${randomId}`);
      setKata(response.data);
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
      >
        {loading ? 'Loading...' : 'Get Random Kata'}
      </button>

      {kata && (
        <div className="kata-details">
          <h2>{kata.name}</h2>
          <p><strong>Difficulty:</strong> {kata.rank?.name}</p>
          <p><strong>Category:</strong> {kata.category}</p>
          <p><strong>Description:</strong></p>
          <div dangerouslySetInnerHTML={{ __html: kata.description }} />
          <p><strong>Languages:</strong> {kata.languages.join(', ')}</p>
          <p><strong>Total Completed:</strong> {kata.totalCompleted}</p>
          <a 
            href={kata.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Solve this kata
          </a>
        </div>
      )}
    </div>
  );
};

export default RandomKata;
