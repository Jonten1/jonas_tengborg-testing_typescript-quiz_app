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
  } = useContext(ScoreCtx);
  const { setChangeQuizState, setError } =
    useContext(QuizStateCtx);
  const [loading, setLoading] =
    useState<boolean>(true);
  const [answers, setAnswers] = useState<any>([]);
  const { category, difficulty } =
    useContext(QuestionCtx);
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

  const handleAnswer = (e: any) => {
    setRound(round + 1);
    setThirtySecActivate(false);
    setChangeQuizState('selectCategory');

    if (e === question.correctAnswer) {
      setCorrectAnswers(correctAnswers + 1);
      setContinualCorrectAnswers(
        continualCorrectAnswers + 1
      );
      setTotalScore(
        Math.floor(totalScore + thirtySec)
      );
    } else {
      setContinualCorrectAnswers(0);
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
          (prevthreeSec) => prevthreeSec - 1
        );
      }, 1000);
    }
    if (thirtySecActivate) {
      intervalThirty = setInterval(() => {
        setThirtySec(
          (prevthirtySec) => prevthirtySec - 1
        );
      }, 1000);
    }
    if (!threeSecActivate && intervalThree) {
      clearInterval(intervalThree);
    }
    if (!thirtySecActivate && intervalThirty) {
      clearInterval(intervalThirty);
    }

    return () => {
      if (intervalThree)
        clearInterval(intervalThree);
    };
  }, [threeSecActivate, thirtySecActivate]);

  if (threeSecActivate && threeSec <= 0) {
    setThreeSecActivate(false);
    setLoading(false);
    setThirtySecActivate(true);
  }
  if (thirtySecActivate && thirtySec <= 0) {
    setThirtySecActivate(false);
    setChangeQuizState('selectCategory');
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
          <div>
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
