/**
 * Anti-Repetition Randomization Engine — MCQ Module
 *
 * Weighted recency exclusion to reduce seeing the same questions
 * across consecutive exams. Weights:
 *   - Seen in last 2 attempts:  weight = 0.1  (strong penalty)
 *   - Seen in last 5 attempts:  weight = 0.4  (moderate penalty)
 *   - Seen in last 10 attempts: weight = 0.7  (mild penalty)
 *   - Never / older:            weight = 1.0  (full eligibility)
 */

export interface QuestionWithWeight {
  id: string;
  weight: number;
}

/**
 * Compute per-question selection weights based on recent exam exposure.
 *
 * @param allQuestionIds - All active question IDs for the subject
 * @param recentAttemptQuestions - Arrays of question IDs from recent attempts,
 *        ordered most-recent-first. e.g. [[q1, q2], [q3, q4, q1], ...]
 */
export function computeWeights(
  allQuestionIds: string[],
  recentAttemptQuestions: string[][]
): QuestionWithWeight[] {
  return allQuestionIds.map((id) => {
    let weight = 1.0;

    for (let attemptIndex = 0; attemptIndex < recentAttemptQuestions.length; attemptIndex++) {
      const attemptQs = recentAttemptQuestions[attemptIndex];
      if (attemptQs.includes(id)) {
        if (attemptIndex < 2) {
          weight = Math.min(weight, 0.1); // last 2 exams — strong penalty
        } else if (attemptIndex < 5) {
          weight = Math.min(weight, 0.4); // last 3–5 exams — moderate penalty
        } else {
          weight = Math.min(weight, 0.7); // last 6–10 exams — mild penalty
        }
      }
    }

    return { id, weight };
  });
}

/**
 * Weighted random sample — select N questions from a weighted pool.
 * Falls back to lowest-weight items if the pool is insufficient.
 *
 * @param pool - Questions with weights
 * @param count - How many to select
 */
export function weightedSample(pool: QuestionWithWeight[], count: number): string[] {
  if (pool.length <= count) {
    // Not enough questions — return all available
    return pool.map((q) => q.id);
  }

  const selected: string[] = [];
  const remaining = [...pool];

  for (let i = 0; i < count; i++) {
    const totalWeight = remaining.reduce((sum, q) => sum + q.weight, 0);
    let random = Math.random() * totalWeight;

    let chosenIndex = 0;
    for (let j = 0; j < remaining.length; j++) {
      random -= remaining[j].weight;
      if (random <= 0) {
        chosenIndex = j;
        break;
      }
    }

    selected.push(remaining[chosenIndex].id);
    remaining.splice(chosenIndex, 1);
  }

  return selected;
}

/**
 * Shuffle an array in place (Fisher-Yates).
 */
export function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Shuffle the options of a question and return the new correct_option mapping.
 * Returns: shuffled options (A-D), updated correct_option, and shuffle_map.
 *
 * shuffle_map: { original_option: shuffled_position }
 * e.g. { A: "C", B: "A", C: "B", D: "D" } means original A is now shown as C
 */
export function shuffleOptions(
  options: { A: string; B: string; C: string; D: string },
  correctOption: string
): {
  shuffled: { A: string; B: string; C: string; D: string };
  newCorrectOption: string;
  shuffleMap: Record<string, string>;
} {
  const keys = ["A", "B", "C", "D"] as const;
  const values = keys.map((k) => ({ key: k, text: options[k] }));

  // Shuffle the values array
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }

  // Build shuffled options object and map original → new position
  const shuffled: Record<string, string> = {};
  const shuffleMap: Record<string, string> = {};

  values.forEach((item, index) => {
    const newKey = keys[index];
    shuffled[newKey] = item.text;
    shuffleMap[item.key] = newKey; // original key → new position
  });

  const newCorrectOption = shuffleMap[correctOption];

  return {
    shuffled: shuffled as { A: string; B: string; C: string; D: string },
    newCorrectOption,
    shuffleMap,
  };
}
