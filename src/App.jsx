import { useState } from "react";
import { clsx } from "clsx";
import "./App.css";
import { languages } from "../languages";

function App() {
  const [currentWord, setCurrentWord] = useState("react".split(""));
  const [guessedLetters, setGuessedLetters] = useState([]);
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

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

  //Convert the currentWord string to an array and map over
  const displayCurrentWord = currentWord.map((word, index) => {
    return (
      <div className="letters" style={{ color: "red" }} key={index}>
        {word.toLocaleUpperCase()}
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
        onClick={() => addGuessedLetter(letter)}
      >
        {letter.toLocaleUpperCase()}
      </button>
    );
  });

  //Map over the languages objs
  const languageElements = languages.map((language) => {
    return (
      <div
        className="language"
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

  return (
    <>
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word in under 8 attempts to keep the programming world from
          Assembly!
        </p>
      </header>
      <div className="game-status">
        <h2>You win!</h2>
        <p>Well done! 🎉</p>
      </div>
      <div className="languages-section">{languageElements}</div>
      <div className="current-word">{displayCurrentWord}</div>
      <div className="keyboard">{keyboard}</div>
      <div className="new-game">
        <button className="new-game-btn">New Game</button>
      </div>
    </>
  );
}

export default App;
