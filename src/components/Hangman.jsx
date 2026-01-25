import { useState, useEffect, useCallback } from 'react'
import { getRandomWordByDifficulty } from '../data/wordList'
import './Hangman.css'

const MAX_WRONG_GUESSES = 6

function Hangman() {
  // Game phase: 'menu', 'setup' (player 1 enters word), 'playing'
  const [gamePhase, setGamePhase] = useState('menu')
  // Game mode: 'single' or 'multi'
  const [gameMode, setGameMode] = useState(null)
  // Difficulty level: 'easy', 'medium', or 'hard'
  const [difficulty, setDifficulty] = useState('medium')
  // Keyboard layout: 'abc' or 'qwerty'
  const [keyboardLayout, setKeyboardLayout] = useState('abc')
  // Custom word input for multiplayer
  const [customWordInput, setCustomWordInput] = useState('')
  const [customWordError, setCustomWordError] = useState('')
  const [showWord, setShowWord] = useState(false)
  // Track when a random word has been selected but game not started yet
  const [randomWordSelected, setRandomWordSelected] = useState(false)
  const [showRandomWord, setShowRandomWord] = useState(false)

  const [word, setWord] = useState('')
  const [guessedLetters, setGuessedLetters] = useState(new Set())
  const [wrongGuesses, setWrongGuesses] = useState(0)

  const startSinglePlayer = useCallback(() => {
    setGameMode('single')
    setWord(getRandomWordByDifficulty(difficulty))
    setGuessedLetters(new Set())
    setWrongGuesses(0)
    setGamePhase('playing')
  }, [difficulty])

  const startMultiPlayer = useCallback(() => {
    setGameMode('multi')
    setCustomWordInput('')
    setCustomWordError('')
    setShowWord(false)
    setRandomWordSelected(false)
    setShowRandomWord(false)
    setWord('')
    setGamePhase('setup')
  }, [])

  const handleAutoGenerate = useCallback(() => {
    setWord(getRandomWordByDifficulty(difficulty))
    setRandomWordSelected(true)
    setShowRandomWord(true)
  }, [difficulty])

  const handlePickNewRandomWord = useCallback(() => {
    setWord(getRandomWordByDifficulty(difficulty))
    setShowRandomWord(true)
  }, [difficulty])

  const handleStartWithRandomWord = useCallback(() => {
    setGuessedLetters(new Set())
    setWrongGuesses(0)
    setRandomWordSelected(false)
    setShowRandomWord(false)
    setGamePhase('playing')
  }, [])

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
    setShowWord(false)
    setRandomWordSelected(false)
    setShowRandomWord(false)
  }, [])

  const playAgain = useCallback(() => {
    if (gameMode === 'single') {
      setWord(getRandomWordByDifficulty(difficulty))
      setGuessedLetters(new Set())
      setWrongGuesses(0)
    } else {
      // In multiplayer, go back to setup for player 1
      setCustomWordInput('')
      setCustomWordError('')
      setShowWord(false)
      setRandomWordSelected(false)
      setShowRandomWord(false)
      setWord('')
      setGamePhase('setup')
    }
  }, [gameMode, difficulty])

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

  const alphabetAbc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  const qwertyRows = [
    'QWERTYUIOP'.split(''),
    'ASDFGHJKL'.split(''),
    'ZXCVBNM'.split('')
  ]

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
          <div className="difficulty-selector">
            <h3>Select Difficulty</h3>
            <div className="difficulty-buttons">
              <button
                className={`difficulty-btn ${difficulty === 'easy' ? 'active' : ''}`}
                onClick={() => setDifficulty('easy')}
              >
                <span className="difficulty-emoji">🟢</span>
                <span className="difficulty-label">Easy</span>
                <span className="difficulty-desc">4-6 letters</span>
              </button>
              <button
                className={`difficulty-btn ${difficulty === 'medium' ? 'active' : ''}`}
                onClick={() => setDifficulty('medium')}
              >
                <span className="difficulty-emoji">🟡</span>
                <span className="difficulty-label">Medium</span>
                <span className="difficulty-desc">7-9 letters</span>
              </button>
              <button
                className={`difficulty-btn ${difficulty === 'hard' ? 'active' : ''}`}
                onClick={() => setDifficulty('hard')}
              >
                <span className="difficulty-emoji">🔴</span>
                <span className="difficulty-label">Hard</span>
                <span className="difficulty-desc">10+ letters</span>
              </button>
            </div>
          </div>

          <div className="keyboard-layout-selector">
            <h3>Keyboard Layout</h3>
            <div className="layout-buttons">
              <button
                className={`layout-btn ${keyboardLayout === 'abc' ? 'active' : ''}`}
                onClick={() => setKeyboardLayout('abc')}
              >
                <span className="layout-label">ABC</span>
                <span className="layout-desc">Alphabetical</span>
              </button>
              <button
                className={`layout-btn ${keyboardLayout === 'qwerty' ? 'active' : ''}`}
                onClick={() => setKeyboardLayout('qwerty')}
              >
                <span className="layout-label">QWERTY</span>
                <span className="layout-desc">Standard keyboard</span>
              </button>
            </div>
          </div>

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
    // Show random word preview if one has been selected
    if (randomWordSelected) {
      return (
        <div className="hangman">
          <h1>Hangman</h1>
          <div className="setup-container">
            <h2>Player 1: Review Your Word</h2>
            <p className="setup-instruction">
              Here's your randomly generated word. You can pick another word or start the game.
            </p>

            <div className="random-word-preview">
              <div className="word-preview-display">
                <span className={showRandomWord ? '' : 'secret-text'}>
                  {word}
                </span>
                <button
                  type="button"
                  className="reveal-word-toggle"
                  onClick={() => setShowRandomWord(!showRandomWord)}
                  aria-label={showRandomWord ? "Hide word" : "Reveal word"}
                >
                  {showRandomWord ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                    </svg>
                  )}
                </button>
              </div>

              <div className="random-word-actions">
                <button className="setup-btn pick-another" onClick={handlePickNewRandomWord}>
                  <span className="setup-icon">🔄</span>
                  <span>Pick Another Word</span>
                </button>
                <button className="setup-btn start-game" onClick={handleStartWithRandomWord}>
                  <span className="setup-icon">▶️</span>
                  <span>Start Game</span>
                </button>
              </div>
            </div>

            <button className="back-btn" onClick={() => setRandomWordSelected(false)}>
              ← Back to Options
            </button>
          </div>
        </div>
      )
    }

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

            <form
              className="custom-word-section"
              onSubmit={(e) => {
                e.preventDefault()
                handleCustomWord()
              }}
              autoComplete="off"
              data-lpignore="true"
              data-form-type="other"
            >
              <label htmlFor="customWord">Enter your own word:</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  id="customWord"
                  className={`custom-word-input${showWord ? '' : ' secret-text'}`}
                  value={customWordInput}
                  onChange={(e) => {
                    setCustomWordInput(e.target.value)
                    setCustomWordError('')
                  }}
                  placeholder="Type a secret word..."
                  maxLength={20}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-lpignore="true"
                  data-1p-ignore
                  data-form-type="other"
                />
                <button
                  type="button"
                  className="reveal-word-toggle"
                  onClick={() => setShowWord(!showWord)}
                  aria-label={showWord ? "Hide word" : "Reveal word"}
                  tabIndex="-1"
                >
                  {showWord ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                    </svg>
                  )}
                </button>
              </div>
              {customWordError && (
                <p className="error-message">{customWordError}</p>
              )}
              <button
                type="submit"
                className="setup-btn use-word"
                disabled={!customWordInput.trim()}
              >
                Use This Word
              </button>
            </form>
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

      <div className="game-info">
        <span className="difficulty-badge">
          {difficulty === 'easy' && '🟢'}
          {difficulty === 'medium' && '🟡'}
          {difficulty === 'hard' && '🔴'}
          {' '}
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </span>
        <span className="word-length-badge">{word.length} letters</span>
      </div>

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

      <div className={`keyboard ${keyboardLayout === 'qwerty' ? 'keyboard-qwerty' : ''}`}>
        {keyboardLayout === 'abc' ? (
          alphabetAbc.map(letter => (
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
          ))
        ) : (
          qwertyRows.map((row, rowIndex) => (
            <div key={rowIndex} className="keyboard-row">
              {row.map(letter => (
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
          ))
        )}
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
