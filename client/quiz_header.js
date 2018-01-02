import React from 'react';
import ReactDOM from 'react-dom';
import { OrderedMap, Set } from 'immutable';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import {
  Button,
  Col,
  Container,
  Row,
} from 'reactstrap';
import CreateCard from './create_card.js';
import CardFilter from './card_filter.js';

import QUIZ_TYPES from './quiz_types.js';

export default function QuizHeader(props) {
  return (
    <div className='app-header large-section'>
      <Container>
        <Row className='justify-content-center align-items-center'>
          <Col xs='5' md='6'>
            <Button
              className='red'
              size='lg'
              block
              onClick={props.stopQuiz} >
              Stop quiz
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

