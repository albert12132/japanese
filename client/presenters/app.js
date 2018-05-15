import React from 'react';
import { connect } from 'react-redux';
import EditCardModalContainer from './editCardModalContainer.js';
import CardListContainer from './cardListContainer.js';
import ReviewActions from './reviewActions.js';
import QuizContainer from './quizContainer.js';
import FiltersContainer from './filtersContainer.js';

let App = (props) => {
  if (props.quizEnabled) {
    return (
      <QuizContainer />
    );
  } else {
    return (
      <div>
        <ReviewActions/>
        <FiltersContainer/>
        <CardListContainer/>
        <EditCardModalContainer/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    quizEnabled: state.get('quizEnabled'),
  };
}

App = connect(
  mapStateToProps,
)(App);

export default App;
