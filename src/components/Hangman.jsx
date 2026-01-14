import { useState, useEffect, useCallback } from 'react'
import './Hangman.css'

const WORDS = [
  'JAVASCRIPT',
  'REACT',
  'PROGRAMMING',
  'DEVELOPER',
  'COMPUTER',
  'ALGORITHM',
  'DATABASE',
  'FUNCTION',
  'VARIABLE',
  'COMPONENT',
  'WEBSITE',
  'BROWSER',
  'KEYBOARD',
  'SOFTWARE',
  'HANGMAN'
]

const MAX_WRONG_GUESSES = 6

function Hangman() {
  const [word, setWord] = useState('')
  const [guessedLetters, setGuessedLetters] = useState(new Set())
  const [wrongGuesses, setWrongGuesses] = useState(0)

  const startNewGame = useCallback(() => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)]
    setWord(randomWord)
    setGuessedLetters(new Set())
    setWrongGuesses(0)
  }, [])

  useEffect(() => {
    startNewGame()
  }, [startNewGame])

  const handleGuess = useCallback((letter) => {
    if (guessedLetters.has(letter)) return

    setGuessedLetters(prev => new Set([...prev, letter]))

    if (!word.includes(letter)) {
      setWrongGuesses(prev => prev + 1)
    }
  }, [word, guessedLetters])

  useEffect(() => {
    const handleKeyPress = (e) => {
      const letter = e.key.toUpperCase()
      if (letter.length === 1 && letter >= 'A' && letter <= 'Z') {
        if (!isGameOver && !isWinner) {
          handleGuess(letter)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleGuess])

  const maskedWord = word
    .split('')
    .map(letter => (guessedLetters.has(letter) ? letter : '_'))
    .join(' ')

  const isWinner = word && word.split('').every(letter => guessedLetters.has(letter))
  const isGameOver = wrongGuesses >= MAX_WRONG_GUESSES

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  return (
    <div className="hangman">
      <h1>Hangman</h1>

      <div className="hangman-drawing">
        <svg viewBox="0 0 200 250" className="hangman-svg">
          {/* Gallows */}
          <line x1="20" y1="230" x2="100" y2="230" stroke="#333" strokeWidth="4" />
          <line x1="60" y1="230" x2="60" y2="20" stroke="#333" strokeWidth="4" />
          <line x1="60" y1="20" x2="140" y2="20" stroke="#333" strokeWidth="4" />
          <line x1="140" y1="20" x2="140" y2="50" stroke="#333" strokeWidth="4" />

          {/* Head */}
          {wrongGuesses >= 1 && (
            <circle cx="140" cy="70" r="20" stroke="#333" strokeWidth="4" fill="none" />
          )}

          {/* Body */}
          {wrongGuesses >= 2 && (
            <line x1="140" y1="90" x2="140" y2="150" stroke="#333" strokeWidth="4" />
          )}

          {/* Left Arm */}
          {wrongGuesses >= 3 && (
            <line x1="140" y1="110" x2="110" y2="140" stroke="#333" strokeWidth="4" />
          )}

          {/* Right Arm */}
          {wrongGuesses >= 4 && (
            <line x1="140" y1="110" x2="170" y2="140" stroke="#333" strokeWidth="4" />
          )}

          {/* Left Leg */}
          {wrongGuesses >= 5 && (
            <line x1="140" y1="150" x2="110" y2="200" stroke="#333" strokeWidth="4" />
          )}

          {/* Right Leg */}
          {wrongGuesses >= 6 && (
            <line x1="140" y1="150" x2="170" y2="200" stroke="#333" strokeWidth="4" />
          )}
        </svg>
      </div>

      <div className="wrong-guesses">
        Wrong guesses: {wrongGuesses} / {MAX_WRONG_GUESSES}
      </div>

      <div className="word-display">
        {maskedWord}
      </div>

      {isWinner && (
        <div className="message win">
          Congratulations! You won!
        </div>
      )}

      {isGameOver && (
        <div className="message lose">
          Game Over! The word was: {word}
        </div>
      )}

      <div className="keyboard">
        {alphabet.map(letter => (
          <button
            key={letter}
            onClick={() => handleGuess(letter)}
            disabled={guessedLetters.has(letter) || isGameOver || isWinner}
            className={`key ${guessedLetters.has(letter)
              ? (word.includes(letter) ? 'correct' : 'wrong')
              : ''}`}
          >
            {letter}
          </button>
        ))}
      </div>

      {(isGameOver || isWinner) && (
        <button className="new-game-btn" onClick={startNewGame}>
          Play Again
        </button>
      )}

      <p className="hint">Type a letter or click the buttons to guess!</p>
    </div>
  )
}

export default Hangman
