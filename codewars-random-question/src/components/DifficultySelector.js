import React from 'react';

const difficulties = [
    { kyu: 8, color: '#3498db', label: 'Beginner' },
    { kyu: 7, color: '#2ecc71', label: 'Beginner' },
    { kyu: 6, color: '#f1c40f', label: 'Novice' },
    { kyu: 5, color: '#e67e22', label: 'Novice' },
    { kyu: 4, color: '#e74c3c', label: 'Competent' },
    { kyu: 3, color: '#9b59b6', label: 'Competent' },
    { kyu: 2, color: '#34495e', label: 'Proficient' },
    { kyu: 1, color: '#000000', label: 'Expert' }
];

const DifficultySelector = ({ selectedDifficulties, onChange }) => (
    <div className="difficulty-selector">
        {difficulties.map(({ kyu, color, label }) => (
            <button
                key={kyu}
                className={`difficulty-btn ${selectedDifficulties.includes(kyu) ? 'selected' : ''}`}
                style={{ '--difficulty-color': color }}
                onClick={() => onChange(kyu)}
            >
                {kyu} kyu
            </button>
        ))}
    </div>
);

export default DifficultySelector;
