import { useState, useRef } from "react";
import { clsx } from "clsx";
import "./App.css";
import { languages } from "../languages";
import { getFarewellText, getRandomWord } from "../utils";
import Confetti from "react-confetti";

function App() {
  const [currentWord, setCurrentWord] = useState(() => getRandomWord().split(""));
  const [guessedLetters, setGuessedLetters] = useState([]);
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

  //Derived values...
  //count the wrong number of guesses
  let wrongGuessCount = 0;
  for (let i = 0; i < guessedLetters.length; i++) {
    if (!currentWord.includes(guessedLetters[i])) {
      wrongGuessCount++;
    }
  }

  /**
   * Game over if  the game is won or guessed incorrectly within 8 times.
   *  Make it more dynamic if more languages are added.
   * Tries should be n-1. Or if the game is won
   */
  const isGameOver = wrongGuessCount == languages.length - 1 ? true : false;

  let isGameWon = currentWord.every((letter) =>
    guessedLetters.includes(letter)
  );

  /*
    A new array in state to hold user's guessed letters.When the user choose a letter,
  letter to this state array. 
  */

  function addGuessedLetter(letters) {
    setGuessedLetters((prev) => {
      // Duplicate letters are discarded. Set can also be used to discard duplicates
      return prev.includes(letters) ? [...prev] : [...prev, letters];
    });
  }

  //Map over the correct guessed letters. If the game is lost, display the entire word
  const displayCurrentWord = currentWord.map((word, index) => {
    return (
      <div className="letters" key={index}>
        {isGameOver
          ? word.toLocaleUpperCase()
          : guessedLetters.includes(word)
          ? word.toLocaleUpperCase()
          : ""}
      </div>
    );
  });

  //Keyboard
  const keyboard = alphabet.map((letter) => {
    const isGuessed = guessedLetters.includes(letter);
    const isCorrect = isGuessed && currentWord.includes(letter);
    const isWrong = isGuessed && !currentWord.includes(letter);
    const className = clsx("keyboard-letters", {
      correctLetter: isCorrect,
      inCorrectLetter: isWrong,
    });
    return (
      <button
        className={className}
        key={letter}
        disabled={isGameOver || isGameWon || isGuessed? true : false}
        onClick={() => addGuessedLetter(letter)}
      >
        {letter.toLocaleUpperCase()}
      </button>
    );
  });

  //Map over the languages objs
  const languageElements = languages.map((language, index) => {
    const isLanguageLost = index < wrongGuessCount;
    return (
      <div
        className={isLanguageLost ? "language lost" : "language"}
        key={language.name}
        style={{
          backgroundColor: language.backgroundColor,
          color: language.color,
        }}
      >
        {language.name}
      </div>
    );
  });
  //Render a new game
  function renderNewGame() {
    setCurrentWord(getRandomWord().split(""));
    setGuessedLetters([]);
  }
  //Render Game status
  function renderGameStatus() {
    if (isGameWon) {
      return (
        <div className=" game-status game-won">
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </div>
      );
    } else if (isGameOver) {
      return (
        <div className="game-status game-lost">
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </div>
      );
    } else if (
      guessedLetters[guessedLetters.length - 1] &&
      !currentWord.includes(guessedLetters[guessedLetters.length - 1])
    ) {
      return (
        <div className="game-status farewell-section">
          {getFarewellText(languages[wrongGuessCount - 1].name)}
        </div>
      );
    }
  }

  return (
    <>
      <header>
        {isGameWon && (
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        )}
        <h1>Assembly: Endgame</h1>
        {isGameOver ? null : (
          <p>
            {`Guess the word in under ${languages.length - wrongGuessCount - 1}
          attempts to keep the programming world from Assembly!`}
          </p>
        )}
      </header>

      <div className="game-status">{renderGameStatus()}</div>
      <div className="languages-section">{languageElements}</div>
      <div className="current-word">{displayCurrentWord}</div>
      <div className="keyboard">{keyboard}</div>
      <div className="new-game">
        {(isGameWon && (
          <button className="new-game-btn" onClick={renderNewGame}>
            New Game
          </button>
        )) ||
          (isGameOver && (
            <button className="new-game-btn" onClick={renderNewGame}>
              New Game
            </button>
          ))}
      </div>
    </>
  );
}

export default App;
