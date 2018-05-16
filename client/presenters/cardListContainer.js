import { connect } from 'react-redux';
import CardList from './cardList.js';
import { showModal } from '../actions/ui.js';
import { successes, filterCards } from '../utils.js';

const getCardList = (filteredCardMap, quizType) => {
  const cardList = [];
  for (let entry of filteredCardMap.entries()) {
    cardList.push({
      cardId: entry[0],
      card: entry[1].toJS(),
    });
  }
  cardList.reverse();
  cardList.sort((record1, record2) => {
    return successes(record1.card, quizType) - successes(record2.card, quizType);
  });
  return cardList;
}

const mapStateToProps = state => {
  return {
    cards: getCardList(
      filterCards(state.get('cards'), state.get('filteredTags')), state.get('quizType')),
    quizType: state.get('quizType'),
    lastRefreshed: state.get('lastRefreshed'),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onCardClick: cardId => {
      dispatch(showModal(cardId));
    },
  };
};

const CardListContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CardList);

export default CardListContainer;
