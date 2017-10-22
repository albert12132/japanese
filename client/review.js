import React from 'react';
import ReactDOM from 'react-dom';
import {
  Button,
  Col,
  Container,
  Row,
} from 'reactstrap';

import CreateCard from './create_card.js';
import ListCards from './list_cards.js';

export default function Review(props) {
  return (
    <Container>
      <Row className='justify-content-center'>
        <Col xs='10' md='6'>
          <Button
            color='success'
            size='lg'
            block
            onClick={() => props.setQuizEnabled(true)} >
            Start quiz
          </Button>
        </Col>
      </Row>
      <CreateCard addNewCard={props.addNewCard} />
      <ListCards
        cards={props.cards}
        updateCard={props.updateCard}
        deleteCard={props.deleteCard}
      />
    </Container>
  );
}
