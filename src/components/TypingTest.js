import React, { useState, useEffect } from "react";
import data from "../libs/example_tests.json";
import { COLORS } from "../libs/colors";
import "../App.scss";

let allTypedEntries = 0;
let uncorrectedErrors = 0;
let currentWordIndex = 0;

export default function TypingTest() {
  const [userInput, setUserInput] = useState("");
  const [typingTest, setTypingTest] = useState("");
  const [correctedWords, setCorrectedWords] = useState([]);

  let typingTestWithWords = getTextToArray(typingTest).withWords,
    userInputWithWords = getTextToArray(userInput).withWords,
    userInputWithLetters = getTextToArray(userInput).withLetters;

  // listens to user input
  const userInputHandler = (e) => {
    setUserInput(e.target.value.trim());
  };

  // CHANGE the typing test and RESET all
  const changeTestHandler = () => {
    let min = 1;
    let max = 4;
    let random_num = Math.floor(Math.random() * (max - min + 1) + min);
    setTypingTest(data[random_num]);
    setUserInput("");
    currentWordIndex = 0;
  };

  // set initial typing test
  useEffect(() => {
    changeTestHandler();
  }, []);

  // listen to key codes
  const keyDownHandler = (e) => {
    let keyCodes = {
      SPACE: 32,
      BACKSPACE: 8,
      ENTER: 13,
    };

    if (e.keyCode == keyCodes.BACKSPACE) uncorrectedErrors++;
    else if (e.keyCode != keyCodes.BACKSPACE) allTypedEntries++;

    if (e.keyCode == keyCodes.SPACE) {
      setUserInput(""); // empty the input field

      // if current word is correct
      if (typingTestWithWords[currentWordIndex] == userInputWithWords) {
        let word = userInputWithWords[0];
        setCorrectedWords([...correctedWords, word]);
        currentWordIndex++; // move to the next word
      }
    }
  };

  return (
    <>
      <div className="screen">
        <div className="title">[ typing4u ]</div>
        <div className="body">
          <div className="typing_test">
            {typingTestWithWords.map((word, wordIndex) => {
              return (
                <span
                  className="word"
                  key={wordIndex}
                  style={{
                    textDecoration: `${
                      correctedWords.includes(word) &&
                      wordIndex < currentWordIndex
                        ? `${COLORS.UNDERLINE_CORRECT} underline`
                        : COLORS.NORMAL_COLOR
                    }`,
                  }}
                >
                  {word.split("").map((char, charIndex) => {
                    return (
                      <span
                        className="char"
                        key={`${wordIndex}_${charIndex}`}
                        style={{
                          color: `${
                            word[charIndex] ==
                              userInputWithLetters[charIndex] &&
                            wordIndex == currentWordIndex
                              ? COLORS.CORRECT_COLOR
                              : word[charIndex] !=
                                  userInputWithLetters[charIndex] &&
                                wordIndex == currentWordIndex &&
                                charIndex < userInputWithLetters.length
                              ? COLORS.WRONG_COLOR
                              : COLORS.NORMAL_COLOR
                          }`,
                        }}
                      >
                        {char}
                      </span>
                    );
                  })}
                  <span
                    style={{
                      textDecoration: `${COLORS.UNDERLINE_SPACEBAR} underline`,
                    }}
                  >
                    &nbsp;
                  </span>
                </span>
              );
            })}
          </div>

          <input
            type="text"
            onChange={userInputHandler}
            onKeyDown={keyDownHandler}
            value={userInput}
          />

          <div className="next_btn" onClick={changeTestHandler}>
            NEXT
          </div>
        </div>
      </div>
    </>
  );
}

const getTextToArray = (text) => {
  return {
    withLetters: text.split(""),
    withWords: text.split(" "),
  };
};

const net_WPM = (allTypedEntries, uncorrectedErrors, time) => {
  let gross_WPM = allTypedEntries / 5;
  return (gross_WPM - uncorrectedErrors) / time;
};
