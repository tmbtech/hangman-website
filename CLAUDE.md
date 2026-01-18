# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React-based Hangman game built with Vite. The game features both single-player (random words) and 2-player modes (custom word entry), keyboard/mouse input, visual hangman drawing, and win/lose detection.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### Component Structure
- **Entry Point**: `src/main.jsx` - Standard React 18 entry point with StrictMode
- **Root Component**: `src/App.jsx` - Minimal wrapper that renders the Hangman component
- **Main Game**: `src/components/Hangman.jsx` - Single monolithic component containing all game logic

### Game State Management
The Hangman component uses React hooks to manage three distinct phases:
1. **Menu phase** (`gamePhase: 'menu'`): Mode selection screen (single-player vs 2-player)
2. **Setup phase** (`gamePhase: 'setup'`): Only for 2-player mode; Player 1 enters/generates word
3. **Playing phase** (`gamePhase: 'playing'`): Active gameplay with keyboard and guessing logic

Key state variables:
- `gameMode`: `'single'` or `'multi'` determines behavior
- `word`: The target word to guess (uppercase, letters only)
- `guessedLetters`: Set of already-guessed letters
- `wrongGuesses`: Counter (0-6, game over at 6)
- `customWordInput`: For 2-player custom word entry
- `showWord`: Toggle for revealing custom word input (prevents password managers from interfering)

### Word Input Handling
The custom word input in 2-player mode includes extensive attributes to prevent password managers from capturing it:
- `autoComplete="off"`, `data-lpignore="true"`, `data-1p-ignore`, `data-form-type="other"`
- Cleaned to uppercase letters only, validated for 2-20 character length
- Optional "Reveal word" checkbox to show/hide input text

### Input Handling
- Physical keyboard: `keydown` event listener active during `gamePhase === 'playing'`
- On-screen keyboard: Button clicks for each letter A-Z
- Both methods call `handleGuess(letter)` which updates guessed letters and wrong guess count

### SVG Drawing
Hangman figure drawn progressively using inline SVG with conditional rendering:
- Gallows (always visible)
- 6 body parts appear sequentially as `wrongGuesses` increases: head, body, left arm, right arm, left leg, right leg

### Styling
- `src/index.css`: Global styles and reset
- `src/components/Hangman.css`: Component-specific styles

## Word List
The word list is now managed in `src/data/wordList.js` and contains 2200+ words categorized by difficulty:
- **Easy**: 700+ words (4-6 letters)
- **Medium**: 650+ words (7-9 letters)
- **Hard**: 850+ words (10+ letters)

The file exports:
- `getRandomWord()`: Returns a random word from all categories
- `getRandomWordByDifficulty(difficulty)`: Returns a random word from a specific difficulty level ('easy', 'medium', or 'hard')
- `getAllWords()`: Returns all words
- `getWordsByDifficulty(difficulty)`: Returns all words for a specific difficulty

The Hangman component currently uses `getRandomWord()` for all game modes.

## Tech Stack
- React 18 with hooks
- Vite 5 for build tooling
- Vanilla CSS (no preprocessors or CSS-in-JS)
- No state management library (pure React hooks)
- No routing (single-page component)
