import React from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';
import EditCardModalContainer from './editCardModalContainer.js';
import CardListContainer from './cardListContainer.js';
import ReviewActions from './reviewActions.js';
import QuizContainer from './quizContainer.js';
import FiltersContainer from './filtersContainer.js';

let Header = (props) => {
  const headerColor = props.isOnline ? 'green' : 'grey';
  return (
    <nav className={`navbar navbar-light bg-light ${headerColor}`}>
      <Container>
        <span className='navbar-brand'>Japanese flash cards</span>
      </Container>
    </nav>
  );
}

function mapStateToProps(state) {
  return {
    isOnline: state.get('isOnline'),
  };
}

Header = connect(
  mapStateToProps,
)(Header);

export default Header;
