import { useEffect, useState } from 'react';
import { Question } from './Question';
import { Categories } from './Categories';
import {
  QuizStateCtx,
  QuestionCtx,
  ScoreCtx
} from '../ctx/Context';
import { QuizSettings } from '../utils/QuizSettings';

export enum QuizState {
  LOADING,
  SELECT_CATEGORY,
  PLAYING,
  RESULT
}

export const Quiz = () => {
  const [changeQuizState, setChangeQuizState] =
    useState<string>('');
  const [quizState, setQuizState] =
    useState<QuizState>(
      QuizState.SELECT_CATEGORY
    );
  const [score, setScore] = useState<number>(0);
  const [round, setRound] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] =
    useState<number>(0);
  const [
    continualCorrectAnswers,
    setContinualCorrectAnswers
  ] = useState<number>(0);
  const [continualBonus, setContinualBonus] =
    useState<number>(1);
  const [totalScore, setTotalScore] =
    useState<number>(0);
  const [
    difficultyMultiplier,
    setDifficultyMultiplier
  ] = useState<number>(1);
  const [difficulty, setDifficulty] =
    useState<string>('easy');

  const [category, setCategory] =
    useState<string>('');
  const [Name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleQuizStateChange = () => {
      switch (changeQuizState) {
        case 'playing':
          setQuizState(QuizState.PLAYING);
          break;
        case 'result':
          setQuizState(QuizState.RESULT);
          break;

        case 'selectNewCategory':
          setQuizState(QuizState.SELECT_CATEGORY);
          break;
        case 'selectCategory':
        default:
          setQuizState(QuizState.SELECT_CATEGORY);
          break;
      }
    };

    handleQuizStateChange();
  }, [changeQuizState]);

  useEffect(() => {
    if (error) {
      setQuizState(QuizState.SELECT_CATEGORY);
    }
  }, [error]);
  return (
    <QuizStateCtx.Provider
      value={{
        changeQuizState,
        setChangeQuizState,
        setError
      }}
    >
      <QuestionCtx.Provider
        value={{
          category,
          setCategory,
          difficulty,
          setDifficulty
        }}
      >
        <ScoreCtx.Provider
          value={{
            score,
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
            difficultyMultiplier,
            setDifficultyMultiplier,
            Name,
            setName
          }}
        >
          <>
            <div>
              Round:
              {round <=
              QuizSettings.questionsPerRound ? (
                <span>
                  {round} /{' '}
                  {QuizSettings.questionsPerRound}
                </span>
              ) : (
                <span>Quiz Over</span>
              )}
            </div>
            <div>
              Correct Answers:{' '}
              <span>{correctAnswers}</span>
            </div>
            <div>
              {error && <div>{error}</div>}
              {quizState === QuizState.LOADING &&
                !error && <div>loading</div>}
              {quizState ===
                QuizState.SELECT_CATEGORY &&
                !error && <Categories />}
              {quizState === QuizState.PLAYING &&
                !error && (
                  <div>
                    <Question />
                  </div>
                )}
              {quizState === QuizState.RESULT && (
                <div>Score: {totalScore} </div>
              )}
            </div>
            <a href={'/'}>
              <button>Restart</button>
            </a>
          </>
        </ScoreCtx.Provider>
      </QuestionCtx.Provider>
    </QuizStateCtx.Provider>
  );
};
