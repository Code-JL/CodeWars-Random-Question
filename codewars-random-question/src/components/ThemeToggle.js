import React from 'react';

const ThemeToggle = ({ theme, toggleTheme }) => (
    <button 
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle theme"
    >
        {theme === 'light' ? '🌙' : '☀️'}
    </button>
);

export default ThemeToggle;
