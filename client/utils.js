
const DAY_IN_MILLIS = 86400000;
const MASTERED = 3;
const SUPER_MASTERED = 5;

export function isMastered(card, quizType) {
  if (card.successes && card.successes[quizType] && card.successes[quizType] > MASTERED) {
    return true;
  }
  return false;
}

export function needsReview(card, quizType) {
  if (!isMastered(card, quizType)) {
    return true;
  }

  const successes = card.successes[quizType];
  const lastQuizAttemptMillis = card.lastAttempts && card.lastAttempts[quizType] ? card.lastAttempts[quizType] : 0;
  const millisSinceLastAttempt = new Date() - lastQuizAttemptMillis;

  if (successes <= SUPER_MASTERED && millisSinceLastAttempt > DAY_IN_MILLIS) {
    return true;
  }
  const threshold = (successes - SUPER_MASTERED + 1) * DAY_IN_MILLIS;
  if (successes > SUPER_MASTERED && millisSinceLastAttempt > threshold) {
    return true;
  }
  return false;
}

export function successes(card, quizType) {
  if (card.successes && card.successes[quizType] && card.successes[quizType]) {
    return card.successes[quizType];
  }
  return 0;
}

export function filterCards(cards, filteredTags) {
  return cards.filter(value => {
    return filteredTags.isEmpty() || !filteredTags.intersect(value.get('tags')).isEmpty();
  });
}
