import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import Select from 'react-select';
import LoadingSpinner from './LoadingSpinner';
import ThemeToggle from './ThemeToggle';
import DifficultySelector from './DifficultySelector';

const RandomKata = () => {
    const [kata, setKata] = useState(null);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [kataPool, setKataPool] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [theme, setTheme] = useState('light');
    const [selectedDifficulties, setSelectedDifficulties] = useState([]);

    const languageOptions = [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'python', label: 'Python' },
        { value: 'ruby', label: 'Ruby' },
        { value: 'java', label: 'Java' },
        { value: 'cpp', label: 'C++' },
        { value: 'csharp', label: 'C#' },
        { value: 'typescript', label: 'TypeScript' },
        { value: 'php', label: 'PHP' },
        { value: 'swift', label: 'Swift' },
        { value: 'go', label: 'Go' },
    ];

    useEffect(() => {
        const fetchKataPool = async () => {
            try {
                const response = await axios.get('https://www.codewars.com/api/v1/users/jhoffner/code-challenges/completed');
                setKataPool(response.data.data);
            } catch (error) {
                console.error('Error fetching kata pool:', error);
            }
        };
        fetchKataPool();
    }, []);

    useEffect(() => {
        document.body.className = `theme-${theme}`;
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const handleDifficultyChange = (kyu) => {
        setSelectedDifficulties(prev => 
            prev.includes(kyu) 
                ? prev.filter(k => k !== kyu)
                : [...prev, kyu]
        );
    };

    const formatDescription = (description) => {
        const cleanHtml = DOMPurify.sanitize(marked(description));
        return cleanHtml;
    };

    const getRandomKata = async () => {
      if (kataPool.length === 0) return;
      
      setLoading(true);
      try {
          let filteredPool = kataPool;
          
          // Detailed logging of the first kata in the pool
          const sampleKata = filteredPool[0];
          console.log('Full kata object:', sampleKata);
          console.log('Rank property:', sampleKata.rank);
          console.log('Selected difficulties:', selectedDifficulties);
  
          // Filter by languages
          if (selectedLanguages.length > 0) {
              filteredPool = filteredPool.filter(kata => 
                  kata.completedLanguages.some(lang => 
                      selectedLanguages.map(sl => sl.value).includes(lang)
                  )
              );
          }
  
          // Filter by difficulties with logging
          if (selectedDifficulties.length > 0) {
              filteredPool = filteredPool.filter(kata => {
                  console.log('Kata rank structure:', kata.rank);
                  return selectedDifficulties.includes(kata.rank);
              });
          }
  
          console.log('Filtered pool size:', filteredPool.length);
  
          if (filteredPool.length === 0) {
              alert('No katas found for selected filters. Try different options.');
              setLoading(false);
              return;
          }
  
          const randomKata = filteredPool[Math.floor(Math.random() * filteredPool.length)];
          const response = await axios.get(`https://www.codewars.com/api/v1/code-challenges/${randomKata.id}`);
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
        <>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <header className="header">
                <h1>Codewars Challenge Generator</h1>
                <p>Level up your coding skills with random challenges</p>
            </header>
            
            <div className="kata-container">
                <div className="filters-container">
                    <div className="language-filter">
                        <Select
                            isMulti
                            options={languageOptions}
                            value={selectedLanguages}
                            onChange={setSelectedLanguages}
                            placeholder="Select languages..."
                            className="language-select"
                        />
                    </div>
                    <DifficultySelector 
                        selectedDifficulties={selectedDifficulties}
                        onChange={handleDifficultyChange}
                    />
                </div>

                <button 
                    onClick={getRandomKata}
                    disabled={loading}
                    className="fetch-button"
                >
                    {loading ? <LoadingSpinner /> : 'Get Random Kata'}
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
        </>
    );
};

export default RandomKata;