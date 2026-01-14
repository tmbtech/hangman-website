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
  // Game phase: 'menu', 'setup' (player 1 enters word), 'playing'
  const [gamePhase, setGamePhase] = useState('menu')
  // Game mode: 'single' or 'multi'
  const [gameMode, setGameMode] = useState(null)
  // Custom word input for multiplayer
  const [customWordInput, setCustomWordInput] = useState('')
  const [customWordError, setCustomWordError] = useState('')

  const [word, setWord] = useState('')
  const [guessedLetters, setGuessedLetters] = useState(new Set())
  const [wrongGuesses, setWrongGuesses] = useState(0)

  const getRandomWord = useCallback(() => {
    return WORDS[Math.floor(Math.random() * WORDS.length)]
  }, [])

  const startSinglePlayer = useCallback(() => {
    setGameMode('single')
    setWord(getRandomWord())
    setGuessedLetters(new Set())
    setWrongGuesses(0)
    setGamePhase('playing')
  }, [getRandomWord])

  const startMultiPlayer = useCallback(() => {
    setGameMode('multi')
    setCustomWordInput('')
    setCustomWordError('')
    setGamePhase('setup')
  }, [])

  const handleAutoGenerate = useCallback(() => {
    setWord(getRandomWord())
    setGuessedLetters(new Set())
    setWrongGuesses(0)
    setGamePhase('playing')
  }, [getRandomWord])

  const handleCustomWord = useCallback(() => {
    const cleanedWord = customWordInput.toUpperCase().replace(/[^A-Z]/g, '')

    if (cleanedWord.length < 2) {
      setCustomWordError('Please enter a word with at least 2 letters')
      return
    }

    if (cleanedWord.length > 20) {
      setCustomWordError('Word must be 20 letters or less')
      return
    }

    setWord(cleanedWord)
    setGuessedLetters(new Set())
    setWrongGuesses(0)
    setCustomWordError('')
    setGamePhase('playing')
  }, [customWordInput])

  const goToMenu = useCallback(() => {
    setGamePhase('menu')
    setGameMode(null)
    setWord('')
    setGuessedLetters(new Set())
    setWrongGuesses(0)
    setCustomWordInput('')
    setCustomWordError('')
  }, [])

  const playAgain = useCallback(() => {
    if (gameMode === 'single') {
      setWord(getRandomWord())
      setGuessedLetters(new Set())
      setWrongGuesses(0)
    } else {
      // In multiplayer, go back to setup for player 1
      setCustomWordInput('')
      setCustomWordError('')
      setGamePhase('setup')
    }
  }, [gameMode, getRandomWord])

  const handleGuess = useCallback((letter) => {
    if (guessedLetters.has(letter)) return

    setGuessedLetters(prev => new Set([...prev, letter]))

    if (!word.includes(letter)) {
      setWrongGuesses(prev => prev + 1)
    }
  }, [word, guessedLetters])

  const maskedWord = word
    .split('')
    .map(letter => (guessedLetters.has(letter) ? letter : '_'))
    .join(' ')

  const isWinner = word && word.split('').every(letter => guessedLetters.has(letter))
  const isGameOver = wrongGuesses >= MAX_WRONG_GUESSES

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  // Handle keyboard input during gameplay
  useEffect(() => {
    if (gamePhase !== 'playing') return

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
  }, [handleGuess, isGameOver, isWinner, gamePhase])

  // Menu screen
  if (gamePhase === 'menu') {
    return (
      <div className="hangman">
        <h1>Hangman</h1>
        <div className="menu-container">
          <h2>Select Game Mode</h2>
          <div className="menu-buttons">
            <button className="menu-btn single-player" onClick={startSinglePlayer}>
              <span className="menu-icon">👤</span>
              <span className="menu-text">Single Player</span>
              <span className="menu-desc">Random word challenge</span>
            </button>
            <button className="menu-btn multi-player" onClick={startMultiPlayer}>
              <span className="menu-icon">👥</span>
              <span className="menu-text">2 Players</span>
              <span className="menu-desc">Player 1 sets the word</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Player 1 setup screen (multiplayer)
  if (gamePhase === 'setup') {
    return (
      <div className="hangman">
        <h1>Hangman</h1>
        <div className="setup-container">
          <h2>Player 1: Set the Word</h2>
          <p className="setup-instruction">
            Choose a word for Player 2 to guess. Make sure Player 2 is not looking!
          </p>

          <div className="setup-options">
            <button className="setup-btn auto-generate" onClick={handleAutoGenerate}>
              <span className="setup-icon">🎲</span>
              <span>Auto-Generate Word</span>
            </button>

            <div className="setup-divider">
              <span>or</span>
            </div>

            <div className="custom-word-section">
              <label htmlFor="customWord">Enter your own word:</label>
              <input
                type="password"
                id="customWord"
                className="custom-word-input"
                value={customWordInput}
                onChange={(e) => {
                  setCustomWordInput(e.target.value)
                  setCustomWordError('')
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCustomWord()
                  }
                }}
                placeholder="Type a secret word..."
                maxLength={20}
                autoComplete="off"
              />
              {customWordError && (
                <p className="error-message">{customWordError}</p>
              )}
              <button
                className="setup-btn use-word"
                onClick={handleCustomWord}
                disabled={!customWordInput.trim()}
              >
                Use This Word
              </button>
            </div>
          </div>

          <button className="back-btn" onClick={goToMenu}>
            ← Back to Menu
          </button>
        </div>
      </div>
    )
  }

  // Game screen
  return (
    <div className="hangman">
      <h1>Hangman</h1>

      {gameMode === 'multi' && (
        <div className="player-indicator">
          Player 2's Turn to Guess
        </div>
      )}

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
          {gameMode === 'multi' ? 'Player 2 wins!' : 'Congratulations! You won!'}
        </div>
      )}

      {isGameOver && (
        <div className="message lose">
          {gameMode === 'multi' ? 'Player 1 wins!' : 'Game Over!'} The word was: {word}
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
        <div className="end-game-buttons">
          <button className="new-game-btn" onClick={playAgain}>
            Play Again
          </button>
          <button className="menu-link-btn" onClick={goToMenu}>
            Change Mode
          </button>
        </div>
      )}

      <p className="hint">Type a letter or click the buttons to guess!</p>
    </div>
  )
}

export default Hangman
