import React, {
  useState,
  useEffect,
  useContext
} from 'react';
import {
  QuizStateCtx,
  QuestionCtx,
  ScoreCtx
} from '../ctx/Context';
import { QuizSettings } from '../utils/QuizSettings';
import {
  shuffle,
  calculateScore
} from '../utils/Utils';
import { fetchQuiz } from '../api/Api';

export const Question = () => {
  const {
    setScore,
    round,
    setRound,
    correctAnswers,
    setCorrectAnswers,
    continualCorrectAnswers,
    setContinualCorrectAnswers,
    continualBonus,
    setContinualBonus,
    totalScore,
    setTotalScore,
    difficultyMultiplier
  } = useContext(ScoreCtx) || {};
  const { setChangeQuizState, setError } =
    useContext(QuizStateCtx) || {};
  const [loading, setLoading] =
    useState<boolean>(true);
  const [answers, setAnswers] = useState<any>([]);
  const { category, difficulty } =
    useContext(QuestionCtx) || {};
  const [question, setQuestion] =
    useState<any>(null);
  const [threeSec, setThreeSec] =
    useState<number>(3);
  const [thirtySec, setThirtySec] =
    useState<number>(
      QuizSettings.timePerQuestion
    );
  const [threeSecActivate, setThreeSecActivate] =
    useState<boolean>(true);
  const [
    thirtySecActivate,
    setThirtySecActivate
  ] = useState<boolean>(false);
  const difficultyArray = [1, 3, 5];
  const { setDifficultyMultiplier } =
    useContext(ScoreCtx) || {};

  const handleAnswer = (e: any) => {
    setRound(round + 1);
    setThirtySecActivate(false);

    if (e === question.correctAnswer) {
      setCorrectAnswers(correctAnswers + 1);
      setChangeQuizState('selectCategory');
      setContinualCorrectAnswers(
        continualCorrectAnswers + 1
      );
      setTotalScore(
        Math.floor(totalScore + thirtySec)
      );
      if (difficulty === 'random') {
        setDifficultyMultiplier(
          difficultyArray[
            Math.floor(Math.random() * 3)
          ]
        );
      }
    } else {
      setContinualCorrectAnswers(0);
      setLoading(true);
      setThreeSec(3);
      setThreeSecActivate(true);
      if (difficulty === 'random') {
        setDifficultyMultiplier(
          difficultyArray[
            Math.floor(Math.random() * 3)
          ]
        );
      }
      if (threeSec === 0) {
        const fetchQuestion =
          async (): Promise<void> => {
            try {
              const response = await fetchQuiz(
                category,
                difficulty
              );
              setThirtySec(33);
              setThirtySecActivate(true);
              setQuestion(response.pop());
              if (response.statusText >= 400) {
                throw new Error(
                  'Bad response from server'
                );
              }
            } catch (error: any) {
              setError('Error');
            }
          };
        fetchQuestion();
        if (difficulty === 'random') {
          setDifficultyMultiplier(
            difficultyArray[
              Math.floor(Math.random() * 3)
            ]
          );
        }
      }
    }
  };

  useEffect(() => {
    if (
      continualCorrectAnswers >= 3 &&
      continualCorrectAnswers >= continualBonus
    ) {
      setContinualBonus(continualCorrectAnswers);
    }
  }, [
    continualCorrectAnswers,
    setContinualBonus,
    continualBonus
  ]);
  useEffect(() => {
    const fetchQuestion =
      async (): Promise<void> => {
        try {
          const response = await fetchQuiz(
            category,
            difficulty
          );
          setQuestion(response.pop());
          if (response.statusText >= 400) {
            throw new Error(
              'Bad response from server'
            );
          }
        } catch (error: any) {
          setError('Error');
        }
      };
    fetchQuestion();
  }, [category, difficulty, setError]);

  useEffect(() => {
    if (question) {
      setAnswers(
        shuffle(
          question.incorrectAnswers,
          question.correctAnswer
        )
      );
    }
  }, [question]);

  useEffect(() => {
    let intervalThree: NodeJS.Timeout | null =
      null;
    let intervalThirty: NodeJS.Timeout | null =
      null;

    if (threeSecActivate) {
      intervalThree = setInterval(() => {
        setThreeSec(
          (prevThreeSec) => prevThreeSec - 1
        );
      }, 1000);
    }

    if (threeSec <= 0 && threeSecActivate) {
      setThreeSecActivate(false);
      setLoading(false);
      setThirtySecActivate(true);
    }

    if (thirtySecActivate) {
      intervalThirty = setInterval(() => {
        setThirtySec(
          (prevThirtySec) => prevThirtySec - 1
        );
      }, 1000);
    }

    if (!thirtySecActivate && intervalThirty) {
      clearInterval(intervalThirty);
    }

    // Reset the thirtySec state when a new question is fetched
    if (!threeSecActivate && !thirtySecActivate) {
      setThirtySec(QuizSettings.timePerQuestion);
    }

    return () => {
      if (intervalThree)
        clearInterval(intervalThree);
      if (intervalThirty)
        clearInterval(intervalThirty);
    };
  }, [
    threeSecActivate,
    threeSec,
    thirtySecActivate
  ]);

  if (threeSecActivate && threeSec <= 0) {
    setThreeSecActivate(false);
    setLoading(false);
    setThirtySecActivate(true);
  }
  if (thirtySecActivate && thirtySec <= 0) {
    setThirtySecActivate(false);
    const fetchQuestion =
      async (): Promise<void> => {
        try {
          const response = await fetchQuiz(
            category,
            difficulty
          );
          setThirtySecActivate(true);
          setQuestion(response.pop());
          if (response.statusText >= 400) {
            throw new Error(
              'Bad response from server'
            );
          }
        } catch (error: any) {
          setError('Error');
        }
      };
    fetchQuestion();
    setContinualCorrectAnswers(0);
    setRound(round + 1);
  }
  if (round > QuizSettings.questionsPerRound) {
    setScore(
      calculateScore(
        totalScore,
        difficultyMultiplier,
        QuizSettings.increaseDifficultyMultiplier,
        correctAnswers,
        continualBonus
      )
    );
    setChangeQuizState('result');
  }
  return (
    <>
      {loading ? (
        <div>{threeSec}</div>
      ) : (
        <>
          <div id="questions">
            <p>{question.question}</p>
          </div>

          <div>
            {question &&
              answers.map(
                (answer: string, i: number) => (
                  <button
                    className={'answerButton'}
                    key={i}
                    value={answer}
                    onClick={(e) =>
                      handleAnswer(
                        e.currentTarget.value
                      )
                    }
                  >
                    {answer}
                  </button>
                )
              )}
          </div>
          <div>
            <p>{thirtySec}</p>
          </div>
        </>
      )}
    </>
  );
};
