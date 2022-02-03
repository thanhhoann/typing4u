import React, { useEffect } from "react";
import data from "./libs/example_tests.json";
import "./App.scss";

let all_typed_entries = 0;
let uncorrected_errors = 0;

let correctedWord_index = 0;
let normal_color = "#313552";
let right_color = "#03C4A1";
let wrong_color = "#C62A88";
let underline_color = "#49FF00";

export default function App() {
  const [userInput, setUserInput] = React.useState("");
  const [typingTest, setTypingTest] = React.useState("");
  const [correctedWords, setCorrectedWords] = React.useState([]);

  let typingTest_A_with_words = text_to_arr(typingTest).with_words,
    userInput_A_with_words = text_to_arr(userInput).with_words,
    userInput_A_with_letters = text_to_arr(userInput).with_letters;

  const userInput_handler = (e) => {
    setUserInput(e.target.value.trim());
  };

  const changeTest_handler = () => {
    let min = 1;
    let max = 4;
    let random_num = Math.floor(Math.random() * (max - min + 1) + min);
    setTypingTest(data[random_num]);
    setUserInput("");
    correctedWord_index = 0;
  };

  useEffect(() => {
    changeTest_handler();
  }, []);

  const keyDown_handler = (e) => {
    let keyCodes = {
      SPACE: 32,
      BACKSPACE: 8,
      ENTER: 13,
    };

    if (e.keyCode == keyCodes.BACKSPACE) uncorrected_errors++;
    else if (e.keyCode != keyCodes.BACKSPACE) all_typed_entries++;

    if (e.keyCode == keyCodes.SPACE) {
      setUserInput("");

      if (
        typingTest_A_with_words[correctedWord_index] == userInput_A_with_words
      ) {
        let word = userInput_A_with_words[0];
        setCorrectedWords([...correctedWords, word]);
        correctedWord_index++;
      }
    }
  };

  return (
    <>
      <div className="screen">
        <div className="title">[ typing4u ]</div>
        <div className="body">
          <div className="typing_test">
            {typingTest_A_with_words.map((word, word_index) => {
              return (
                <span
                  className="word"
                  key={word_index}
                  style={{
                    textDecoration: `${
                      correctedWords.includes(word) &&
                      word_index < correctedWord_index
                        ? `${underline_color} underline`
                        : normal_color
                    }`,
                  }}
                >
                  {word.split("").map((char, char_index) => {
                    return (
                      <span
                        className="char"
                        key={`${word_index}_${char_index}`}
                        style={{
                          color: `${
                            word[char_index] ==
                              userInput_A_with_letters[char_index] &&
                            word_index == correctedWord_index
                              ? right_color
                              : word[char_index] !=
                                  userInput_A_with_letters[char_index] &&
                                word_index == correctedWord_index &&
                                char_index < userInput_A_with_letters.length
                              ? wrong_color
                              : normal_color
                          }`,
                        }}
                      >
                        {char}
                      </span>
                    );
                  })}
                  <span style={{ textDecoration: "#EEE6CE underline" }}>
                    &nbsp;
                  </span>
                </span>
              );
            })}
          </div>

          <input
            type="text"
            onChange={userInput_handler}
            onKeyDown={keyDown_handler}
            value={userInput}
          />

          <div className="next_btn" onClick={changeTest_handler}>
            NEXT
          </div>
        </div>
      </div>
    </>
  );
}

const text_to_arr = (text) => {
  return {
    with_letters: text.split(""),
    with_words: text.split(" "),
  };
};

const net_WPM = (all_typed_entries, uncorrected_errors, time) => {
  let gross_WPM = all_typed_entries / 5;
  return (gross_WPM - uncorrected_errors) / time;
};
