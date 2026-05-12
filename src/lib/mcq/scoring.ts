/**
 * Scoring Engine — MCQ Module
 * Calculates exam results from an array of locked answers.
 * No negative marking. Correct = +1, Wrong = 0, Unanswered = 0.
 */

export interface AnswerRecord {
  selected_option: string | null;
  correct_option: string;
  is_locked: boolean;
}

export interface ScoreResult {
  score: number;
  correct_count: number;
  wrong_count: number;
  unanswered_count: number;
  total_questions: number;
  percentage: number;
}

/**
 * Calculate the final score from a set of attempt answer records.
 */
export function calculateScore(answers: AnswerRecord[]): ScoreResult {
  const total_questions = answers.length;
  let correct_count = 0;
  let wrong_count = 0;
  let unanswered_count = 0;

  for (const answer of answers) {
    if (!answer.selected_option || !answer.is_locked) {
      unanswered_count++;
    } else if (answer.selected_option === answer.correct_option) {
      correct_count++;
    } else {
      wrong_count++;
    }
  }

  const score = correct_count;
  const percentage =
    total_questions > 0
      ? Math.round((correct_count / total_questions) * 10000) / 100
      : 0;

  return {
    score,
    correct_count,
    wrong_count,
    unanswered_count,
    total_questions,
    percentage,
  };
}

/**
 * Generate a human-readable performance summary for the result screen.
 */
export function generateSummary(
  result: ScoreResult,
  subjectName: string
): string {
  const { percentage, correct_count, total_questions, wrong_count } = result;

  if (percentage >= 90) {
    return `Excellent performance in ${subjectName}! You answered ${correct_count}/${total_questions} questions correctly. Outstanding accuracy.`;
  } else if (percentage >= 75) {
    return `Good performance in ${subjectName}. You answered ${correct_count}/${total_questions} correctly. Review the ${wrong_count} incorrect answers below.`;
  } else if (percentage >= 50) {
    return `Average performance in ${subjectName}. ${correct_count}/${total_questions} correct. Focus on the topics where you made errors.`;
  } else {
    return `Keep practicing ${subjectName}. You answered ${correct_count}/${total_questions} correctly. Review explanations carefully to improve.`;
  }
}
