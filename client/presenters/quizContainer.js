import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import Quiz from './quiz.js';
import {
  toggleQuiz,
} from '../actions/ui.js';
import {
  updateCards,
} from '../actions/api.js';
import { needsReview, filterCards } from '../utils.js';

function getShuffledCards(filteredCardMap, quizType) {
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

const mapStateToProps = state => {
  const cards = getShuffledCards(
    filterCards(state.get('cards'), state.get('filteredTags')),
    state.get('quizType'));
  return {
    cards: cards,
    quizType: state.get('quizType'),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    stopQuiz: (cards) => {
      if (cards.length > 0) {
        const cardMap = Map(cards.map(record => [ record.cardId, fromJS(record.card) ] ));
        dispatch(updateCards(cardMap));
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
