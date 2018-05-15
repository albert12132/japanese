
const DAY_IN_MILLIS = 86400000;
const WEEK_IN_MILLIS = 7 * DAY_IN_MILLIS;
const MASTERED = 5;
const SUPER_MASTERED = 10;

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
  } else if (successes > SUPER_MASTERED && millisSinceLastAttempt > WEEK_IN_MILLIS) {
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
