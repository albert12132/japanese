import React from 'react';
import {
  showModal,
  toggleQuiz,
} from '../actions/ui.js';
import { connect } from 'react-redux';

import {
  Button,
  Col,
  Container,
  Row,
} from 'reactstrap';

let ReviewActions = ({ dispatch }) => {
  return (
    <div className='large-section'>
      <Container>
        <Row className='justify-content-center align-items-center'>
          <Col xs='6' md='4'>
            <Button
              className='green'
              size='lg'
              block
              onClick={() => {
                dispatch(toggleQuiz());
              }} >
              Start quiz
            </Button>
          </Col>
          <Col xs='6' md='4'>
            <Button
              size='lg'
              block
              onClick={() => {
                dispatch(showModal());
              }}>
              Create card
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

ReviewActions = connect()(ReviewActions);

export default ReviewActions;
