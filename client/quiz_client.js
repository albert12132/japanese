import { Map } from 'immutable';

const CEILING = 5;

export default class QuizClient {
  constructor(client) {
    this.client = client;
    this.successRates = new Map();
  }

  loadSuccessRates(cards) {
    this.successRates = new Map(cards).map(card => card.successes);
  }

  pickCard(cards, quizType) {
    const tiers = [];
    for (let i = 0; i < CEILING + 1; i++) {
      tiers.push([]);
    }

    for (let cardId of cards.keys()) {
      if (!this.successRates.has(cardId)) {
        this.successRates = this.successRates.set(cardId, {});
      }
      if (this.successRates.get(cardId)[quizType] === undefined) {
        this.successRates.get(cardId)[quizType] = 0;
      }
      const tier = Math.min(this.successRates.get(cardId)[quizType], CEILING);
      tiers[tier].push(cardId);
    }

    const cummulative = [];
    this.fillCummulative(cummulative, tiers);

    const index = Math.min(
      Math.floor(Math.random() * cummulative.length),
      cummulative.length - 1);
    return cards.get(cummulative[index]);
  }

  fillCummulative(cummulative, tiers) {
    const baseSize = Math.max(tiers[CEILING].length, 1);
    for (let i = CEILING; i >= 0; i--) {
      if (tiers[i].length === 0) {
        continue;
      }

      let multiple = 1
      if (i != CEILING) {
        multiple = ((CEILING - i + 1) * baseSize / tiers[i].length)
        multiple = Math.ceil(multiple);
      }
      for (let cardId of tiers[i]) {
        for (let j = 0; j < multiple; j++) {
          cummulative.push(cardId);
        }
      }
    }
  }

  successfulGuess(cardId, quizType) {
    let successes = {};
    if (this.successRates.has(cardId)) {
      successes = this.successRates.get(cardId);
    } else {
      successes = {};
    }

    if (successes[quizType] === undefined) {
      successes[quizType] = 0;
    }
    successes[quizType] += 1;

    this.successRates = this.successRates.set(cardId, successes);
    this.client.updateCardSuccesses(cardId, successes);
  }
}
