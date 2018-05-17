import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { createSelector } from 'reselect';
import Quiz from './quiz.js';
import {
  toggleQuiz,
  toggleSavingAlert,
} from '../actions/ui.js';
import {
  updateCards,
} from '../actions/api.js';
import { needsReview, filterCards } from '../utils.js';

const UPDATE_BATCH_SIZE = 100;

const getShuffledCards = createSelector(
  [state => state.get('cards'), state => state.get('filteredTags'), state => state.get('quizType')],
  (cardMap, filteredTags, quizType) => {
    const filteredCardMap = filterCards(cardMap, filteredTags);
    return filteredCardMap
      .entrySeq()
      .map(entry => {
        return {
          cardId: entry[0],
          card: entry[1].toJS(),
        }
      })
      .filter(
        record => {
          return needsReview(record.card, quizType);
        })
      .sortBy(Math.random)
      .toJS();
  }
)

const mapStateToProps = state => {
  return {
    cards: getShuffledCards(state),
    quizType: state.get('quizType'),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    stopQuiz: (cards) => {
      if (cards.length > 0) {
        dispatch(toggleSavingAlert(true));

        // Batch update requests so we don't send a request that's too large.
        const updatePromises = [];
        let batch = [];
        for (let i = 0 ; i < cards.length; i++) {
          batch.push(cards[i]);
          if (batch.length == UPDATE_BATCH_SIZE) {
            const cardMap = Map(batch.map(record => [ record.cardId, fromJS(record.card) ] ));
            updatePromises.push(dispatch(updateCards(cardMap)));
            batch = [];
          }
        }
        if (batch.length > 0) {
          const cardMap = Map(batch.map(record => [ record.cardId, fromJS(record.card) ] ));
          updatePromises.push(dispatch(updateCards(cardMap)));
        }

        Promise.all(updatePromises).then(() => dispatch(toggleSavingAlert(false)));
      }
      dispatch(toggleQuiz());
    },
  };
};

const QuizContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Quiz);

export default QuizContainer;
