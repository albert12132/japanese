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

export default function ReviewHeader(props) {
  return (
    <div className='app-header large-section'>
      <Container>
        <Row className='justify-content-center align-items-center'>
          <Col md='4'>
            <Button
              className='green'
              size='lg'
              block
              onClick={props.startQuiz} >
              Start quiz
            </Button>
          </Col>
          <Col xs='5' md='4'>
            <CreateCard
              addNewCard={props.addNewCard}
              tags={props.tags}
            />
          </Col>
        </Row>

        <hr/>

        <CardFilter
          updateQuizType={props.updateQuizType}
          quizType={props.quizType}
          tags={props.tags}
          tagsToFilter={props.tagsToFilter}
          updateTagsToFilter={props.updateTagsToFilter}
        />
      </Container>
    </div>
  );
}

