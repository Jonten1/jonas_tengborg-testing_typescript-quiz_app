export const fetchCategories = (): any => {
  try {
    return fetch('https://the-trivia-api.com/api/categories')
      .then((res) => res.json())
      .then((json) => json)
  } catch (error) {
    console.error(error)
    return 'Error'
  }
}

export const fetchQuiz = async (category: string, difficulty?: string) => {
  try {
    const realDifficulty = difficulty === 'random' ? '' : difficulty

    return fetch(
      `https://the-trivia-api.com/api/questions?categories=${category}&limit=1${
        realDifficulty ? `&difficulty=${realDifficulty}` : ''
      }`
    )
      .then((res) => res.json())
      .then((json) => json)
  } catch (error) {
    console.error(error)
  }
}
