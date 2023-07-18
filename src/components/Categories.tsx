import React, {
  useContext,
  useEffect,
  useState
} from 'react';
import {
  QuizStateCtx,
  QuestionCtx,
  ScoreCtx
} from '../ctx/Context';
import { shuffle } from '../utils/Utils';
import { fetchCategories } from '../api/Api';

export const Categories = () => {
  const [categories, setCategories] = useState<
    string[]
  >([]);

  const {
    round,
    setRound,
    setDifficultyMultiplier,
    setName
  } = useContext(ScoreCtx);
  const {
    category,
    setCategory,
    difficulty,
    setDifficulty
  } = useContext(QuestionCtx);
  const { setChangeQuizState, setError } =
    useContext(QuizStateCtx);
  const handleCategory = (event: string) => {
    setCategory(event);
    setChangeQuizState('playing');
  };
  const handleDifficulty = (e: string) => {
    const difficultyArray = [1, 3, 5];
    switch (e) {
      case 'easy':
        setDifficultyMultiplier(1);
        break;
      case 'medium':
        setDifficultyMultiplier(3);
        break;
      case 'hard':
        setDifficultyMultiplier(5);
        break;
      case 'random':
        setDifficultyMultiplier(
          difficultyArray[
            Math.floor(Math.random() * 3)
          ]
        );
    }
    setDifficulty(e);
  };

  const handleStart = () => {
    setRound(round + 1);
  };
  const handleName = (e: string) => {
    setName(e);
  };

  useEffect(() => {
    const fetchAllCategories =
      async (): Promise<void> => {
        try {
          const response =
            await fetchCategories();
          const strings =
            Object.values(response).flat();
          setCategories(strings as string[]);
          if (response.statusText >= 400) {
            throw new Error(
              'Bad response from server'
            );
          }
        } catch (error: any) {
          setError('Api down');
        }
      };
    fetchAllCategories();
  }, [setError]);

  return (
    <QuestionCtx.Provider
      value={{
        category,
        setCategory,
        difficulty,
        setDifficulty
      }}
    >
      {round < 1 && (
        <div>
          <input
            onChange={(e) =>
              handleName(e.currentTarget.value)
            }
            type="text"
            className="nameInput"
            placeholder="Name"
          />
          <div>
            <select
              className={'difficultyMenu'}
              defaultValue={'easy'}
              required
              onChange={(e) => {
                handleDifficulty(
                  e.currentTarget.value
                );
              }}
            >
              <option value="easy">Easy</option>
              <option value="medium">
                Medium
              </option>
              <option value="hard">Hard</option>
              <option value="random">
                Random
              </option>
            </select>
          </div>

          <button onClick={() => handleStart()}>
            Start
          </button>
        </div>
      )}
      {round > 0 && (
        <div>
          <p>Category</p>
          {categories &&
            shuffle(categories)
              .slice(0, 3)
              .map((cat: any) => (
                <button
                  className="buttonCat"
                  key={cat}
                  value={cat}
                  onClick={(event) =>
                    handleCategory(
                      event.currentTarget.value
                    )
                  }
                >
                  {cat}
                </button>
              ))}
        </div>
      )}
    </QuestionCtx.Provider>
  );
};
