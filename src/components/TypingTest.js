import React, { useState, useEffect } from "react";
import data from "../libs/example_tests.json";
import { COLORS } from "../libs/colors";
import "../App.scss";
import { QuoteGenerator } from "./QuoteGenerator";

let allTypedEntries = 0;
let uncorrectedErrors = 0;
let currentWordIndex = 0;
let timeSpan = 0;

export default function TypingTest() {
  const [userInput, setUserInput] = useState("");
  const [correctedWords, setCorrectedWords] = useState([]);
  const [typingTest, setTypingTest] = useState("");
  const [request, setRequest] = useState(false); // use for fetching new request
  const [isTyping, setIsTyping] = useState(false);
  const [timeStart, setTimeStart] = useState();
  const [netWPM, setNetWPM] = useState(0);

  // get another typing test
  const items = QuoteGenerator(request);

  let typingTestWithWords = getTextToArray(typingTest).withWords,
    userInputWithWords = getTextToArray(userInput).withWords,
    userInputWithLetters = getTextToArray(userInput).withLetters;

  // set time start whenever user is typing
  useEffect(() => setTimeStart(Date.now()), [isTyping]);

  // listens to user input
  const userInputHandler = (e) => {
    setUserInput(e.target.value.trim());
    if (e) setIsTyping(true);

    timeSpan = Math.floor((Date.now() - timeStart) / 1000);
    setNetWPM(calNetWPM(allTypedEntries, uncorrectedErrors, timeSpan));
  };

  // CHANGE the typing test and RESET all
  const changeTest = () => {
    setUserInput("");
    setIsTyping(false);
    currentWordIndex = 0;
    setNetWPM(0);

    // make new API call
    setRequest(!request);
    if (items) setTypingTest(items.content);
  };

  // set initial typing test
  useEffect(() => {
    fetch("https://api.quotable.io/random")
      .then((res) => res.json())
      .then((json) => {
        setTypingTest(json.content);
      });
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

  // if user finishes the test
  if (
    typingTestWithWords[currentWordIndex] ==
    typingTestWithWords[typingTest.length - 1]
  ) {
    changeTest();
  }

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

          <div className="next_btn" onClick={changeTest}>
            NEXT
          </div>

          <h1 style={{ color: "black" }}>{netWPM}</h1>
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

const calNetWPM = (allTypedEntries, uncorrectedErrors, seconds) => {
  let gross_WPM = allTypedEntries / 5;
  let result = (gross_WPM - uncorrectedErrors) / (seconds / 60);
  if (result == Infinity) return 0;
  else return result;
};
