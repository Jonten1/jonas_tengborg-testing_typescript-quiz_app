/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  useState,
  useEffect,
  useContext
} from 'react';
import { UsersContext } from './States/Contexts';
import { SubmitButton } from './components/buttons/submit/submitButton';
import { Username } from './components/Username';
import { UserProps } from './Interfaces/UserProps';
import { IButtonProps } from './Interfaces/IButtonProps';

console.log(
  process.env
    .REACT_APP_MY_ENVIRONMENT_VARIABLE_CALCULATION
);
const TimeKey = Number(
  process.env
    .REACT_APP_MY_ENVIRONMENT_VARIABLE_TIME
);

const AmountKey =
  process.env
    .REACT_APP_MY_ENVIRONMENT_VARIABLE_AMOUNT;

// const ScoreKey =
//   process.env
//     .REACT_APP_MY_ENVIRONMENT_VARIABLE_CALCULATION;
interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

const App: React.FC = () => {
  const [difficultyNumber, setDifficultyNumber] =
    useState(0);
  const [selectedCategory, setSelectedCategory] =
    useState('');
  const [
    selectedDifficulty,
    setSelectedDifficulty
  ] = useState('');
  const [questions, setQuestions] = useState<
    Question[]
  >([]);
  const [totalScore, setTotalScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] =
    useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [categories, setCategories] = useState<
    any[]
  >([]);
  const [hideUser, setHideUser] = useState(false);
  const [timeRemaining, setTimeRemaining] =
    useState(TimeKey);

  const defaultFormState: UserProps = {
    userName: ''
  };
  let formState = defaultFormState;
  const usersContext = useContext(UsersContext);
  const [userProps, updateUserProps] =
    useState<UserProps>({
      userName: ''
    });

  const SetUsernameState = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    usersContext.push(formState);
    updateUserProps(formState);
    console.log(
      usersContext[usersContext.length - 1]
    );
    setHideUser(true);
    formState = defaultFormState;
  };

  const OnNameChanged = (
    e: React.FormEvent<HTMLInputElement>
  ) => {
    formState.userName = e.currentTarget.value;
  };

  useEffect(() => {
    // Runs ONCE after initial rendering
    // and after every rendering ONLY IF `userProps` changes
  }, [userProps]);

  const buttonProps: IButtonProps = {
    border: '4px solid',
    color: '#89E8C0',
    radius: '5px',
    height: '50px',
    width: '200px',
    fontSize: '25px',
    onClick: SetUsernameState
  };

  const InputStyle = {
    border: buttonProps.border,
    borderRadius: buttonProps.radius,
    height: buttonProps.height,
    width: buttonProps.width,
    fontSize: buttonProps.fontSize
  };

  const difficulties = ['easy', 'medium', 'hard'];

  useEffect(() => {
    async function fetchCategories() {
      const response = await fetch(
        'https://opentdb.com/api_category.php'
      );
      const data = await response.json();
      setCategories(
        data.trivia_categories
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
      );
    }
    fetchCategories();
  }, []);
  const Start = () => {
    const url = `https://opentdb.com/api.php?amount=${AmountKey}&category=${selectedCategory}&difficulty=${selectedDifficulty}&type=multiple`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.results);
        setCurrentQuestion(data.results[0]);
      });
    setCurrentQuestion(questions[0]);
    if (selectedDifficulty === 'easy') {
      setDifficultyNumber(1);
    }
    if (selectedDifficulty === 'medium') {
      setDifficultyNumber(3);
    }
    if (selectedDifficulty === 'hard') {
      setDifficultyNumber(5);
    }
  };
  //Timer
  useEffect(() => {
    if (!currentQuestion) {
      return;
    }
    setTimeRemaining(TimeKey);

    const index = questions.findIndex(
      (question) => question === currentQuestion
    );
    const timer = setTimeout(() => {
      // move to next question after 30 seconds
      setCurrentQuestion(questions[index + 1]);
    }, 30000);
    const interval = setInterval(() => {
      setTimeRemaining((time) => time - 1);
    }, 1000);

    // clear the timeout when the component unmounts
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [currentQuestion, questions]);

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) {
      return;
    }

    // check if answer is correct and update score
    if (
      answer === currentQuestion.correct_answer
    ) {
      setScore(score + 1);
      setTotalScore(
        totalScore +
          timeRemaining * difficultyNumber +
          score
      );
    }

    // move on to next question
    const currentIndex = questions.findIndex(
      (q) => q === currentQuestion
    );
    if (currentIndex === questions.length - 1) {
      setCurrentQuestion(null);
    } else {
      setCurrentQuestion(
        questions[currentIndex + 1]
      );
    }
  };
  console.log(questions);

  return (
    <div>
      <h1>Quiz</h1>
      {!hideUser ? (
        <>
          <form>
            <label htmlFor="nameField">
              Name:
            </label>
            <input
              id="nameField"
              style={InputStyle}
              type="text"
              onChange={OnNameChanged}
            />
          </form>

          <SubmitButton {...buttonProps}>
            Add
          </SubmitButton>
        </>
      ) : null}
      <Username {...userProps} />
      <p>Score: {totalScore}</p>

      {currentQuestion ? (
        <>
          <p>
            Time remaining: {timeRemaining}{' '}
            seconds
          </p>
          <p>
            {questions.indexOf(currentQuestion) +
              1}
            /{questions.length}
          </p>
          <p>
            Category: {currentQuestion.category}
          </p>
          <p>
            Difficulty:
            {currentQuestion.difficulty}
          </p>
          <p data-cy="question">
            Question: {currentQuestion.question}
          </p>
          <button
            data-testid="answer-button"
            onClick={() =>
              handleAnswer(
                currentQuestion.correct_answer
              )
            }
          >
            {currentQuestion.correct_answer}
          </button>
          {currentQuestion.incorrect_answers.map(
            (answer) => (
              <button
                onClick={() =>
                  handleAnswer(answer)
                }
              >
                {answer}
              </button>
            )
          )}
        </>
      ) : (
        <>
          {hideUser && (
            <>
              <p>Select options to start quiz:</p>
              <form>
                <label>
                  Category:
                  <select
                    data-cy="cat-options"
                    onChange={(e) =>
                      setSelectedCategory(
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Random
                    </option>
                    {categories.map(
                      (category) => (
                        <option
                          value={category.id}
                        >
                          {category.name}
                        </option>
                      )
                    )}
                  </select>
                </label>
                <label>
                  Difficulty:
                  <select
                    data-cy="diff-options"
                    onChange={(e) =>
                      setSelectedDifficulty(
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Random
                    </option>
                    {difficulties.map(
                      (difficulty) => (
                        <option
                          value={difficulty}
                        >
                          {difficulty}
                        </option>
                      )
                    )}
                  </select>
                </label>
              </form>
              <button id="Start" onClick={Start}>
                Start
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default App;
