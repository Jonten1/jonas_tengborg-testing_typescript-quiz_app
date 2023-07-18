export function shuffle<T>(array: T[], string?: T): T[] {
  const from = string ? [...array, string] : [...array]
  const to: T[] = []
  while (from.length) {
    const element = from.splice(Math.floor(Math.random() * from.length), 1)
    to.push(...element)
  }
  return to

}


export function calculateScore(
  totalScore: number,
  difficultyMultiplier: number,
  increaseDifficultyMultiplier: number,
  correctAnswers: number,
  continualBonus: number
) {
  return Math.floor(totalScore * (difficultyMultiplier + increaseDifficultyMultiplier) + correctAnswers) * continualBonus
}
