import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import EditCardModal from './editCardModal.js';
import {
  createCard,
  updateCards,
  deleteCard,
} from '../actions/api.js';
import { hideModal } from '../actions/ui.js';


const getCard = (cardId, cardMap) => {
  if (!cardId) {
    return null;
  }
  return cardMap.get(cardId).toJS();
}

const mapStateToProps = state => {
  return {
    visible: state.get('showModal'),
    tags: state.get('tags').toArray(),
    cardId: state.get('modalCardId'),
    initialCard: getCard(state.get('modalCardId'), state.get('cards')),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSave: (card, cardId) => {
      card = fromJS(card);
      if (cardId) {
        const map = Map().set(cardId, card);
        dispatch(updateCards(map));
      } else {
        dispatch(createCard(card));
      }
    },
    onClose: () => {
      dispatch(hideModal());
    },
    onDelete: cardId => {
      dispatch(deleteCard(cardId));
    },
  };
};

const EditCardModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditCardModal);

export default EditCardModalContainer;
