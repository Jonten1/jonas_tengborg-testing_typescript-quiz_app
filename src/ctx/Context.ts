import { createContext } from 'react'

type QuizStateCtxType = {
  changeQuizState: string
  setChangeQuizState: (changeQuizState: string) => void
  error?: string
  setError: (error: string) => void
}

type QuestionCtxType = {
  category: string
  setCategory: (category: string) => void
  difficulty: string
  setDifficulty: (difficulty: string) => void
}
type ScoreCtxType = {
  score: number
  setScore: (score: number) => void
  round: number
  setRound: (round: number) => void
  correctAnswers: number
  setCorrectAnswers: (correctAnswers: number) => void
  continualCorrectAnswers: number
  setContinualCorrectAnswers: (continualCorrectAnswers: number) => void
  continualBonus: number
  setContinualBonus: (continualBonus: number) => void
  totalScore: number
  setTotalScore: (totalScore: number) => void
  difficultyMultiplier: number
  setDifficultyMultiplier: (difficultyMultiplier: number) => void
  Name: string
  setName: (Name: string) => void
}
export const QuizStateCtx = createContext(null as unknown as QuizStateCtxType)

export const QuestionCtx = createContext(null as unknown as QuestionCtxType)

export const ScoreCtx = createContext(null as unknown as ScoreCtxType)
