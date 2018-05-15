import { connect } from 'react-redux';
import { Set } from 'immutable';
import Filters from './filters.js';
import {
  updateQuizType,
  setFilteredTags,
} from '../actions/ui.js';


const mapStateToProps = state => {
  return {
    quizType: state.get('quizType'),
    filteredTags: state.get('filteredTags').toJS(),
    allTags: state.get('tags').toJS(),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateQuizType: quizType => {
      dispatch(updateQuizType(quizType));
    },
    updateFilteredTags: filteredTags => {
      dispatch(setFilteredTags(Set(filteredTags)));
    },
  };
};

const FiltersContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Filters);

export default FiltersContainer;
