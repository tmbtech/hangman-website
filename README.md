# Hangman Game

A simple, interactive Hangman game built with React and Vite.

## Features

- Classic hangman gameplay with visual gallows drawing
- On-screen keyboard and physical keyboard support
- 15 programming-related words to guess
- Win/lose detection with play again functionality
- Responsive design for mobile and desktop
- Smooth animations and modern UI

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd hangman-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## How to Play

1. A random word will be selected when the game starts
2. Guess letters by clicking the on-screen keyboard or typing on your keyboard
3. Correct guesses reveal the letter in the word
4. Wrong guesses add parts to the hangman (6 wrong guesses = game over)
5. Win by guessing all letters before the hangman is complete
6. Click "Play Again" to start a new game

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Tech Stack

- React 18
- Vite 5
- CSS3 with modern features
