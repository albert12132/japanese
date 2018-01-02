import React from 'react';
import ReactDOM from 'react-dom';
import {
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Container,
  Row,
} from 'reactstrap';
import EditCardModal from './edit_card.js';
import { isMastered, successes } from './utils.js';

export default class CardList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModalWithCard: null,
    };
    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  showModal(card) {
    this.setState({
      showModalWithCard: card,
    });
  }

  closeModal() {
    this.setState({
      showModalWithCard: null,
    });
  }

  render() {
    const rows = this.props.cards.sortBy((card) => {
      return successes(card, this.props.quizType);
    }).toArray().map((card) => {
      return (
        <CardSummary
          key={card.card_id}
          card={card}
          deleteCard={this.props.deleteCard}
          editCard={this.showModal}
          quizType={this.props.quizType}
        />
      );
    });

    let modal = null;
    if (this.state.showModalWithCard !== null) {
      modal =
        <EditCardModal
          modal={true}
          initialCard={this.state.showModalWithCard}
          tags={this.props.tags}
          saveCard={this.props.updateCard}
          close={this.closeModal}
          deleteCard={this.props.deleteCard}
        />
    }

    return (
      <Container>
        <Row>
          <Col>
            {this.props.cards.size} card{this.props.cards.size === 1 ? '' : 's'}
          </Col>
        </Row>
        <Row>
          {rows}
        </Row>
        {modal}
      </Container>
    );
  }
}

function CardSummary(props) {
  let color = 'red';
  if (isMastered(props.card, props.quizType)) {
    color = 'green';
  }
  return (
    <Col>
      <Card className={color}>
      <button
        onClick={() => props.editCard(props.card)}>
        <CardBody className='text-nowrap'>
          <CardTitle>{props.card.kanji}</CardTitle>
          <CardSubtitle>{props.card.hiragana}</CardSubtitle>
          <CardText>{props.card.meaning}</CardText>
        </CardBody>
        </button>
      </Card>
    </Col>
  );
}
