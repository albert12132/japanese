import React from 'react';
import {
  Button,
  Col,
  Container,
  Input,
  InputGroup,
  Label,
  Form,
  FormGroup,
  Row,
} from 'reactstrap';
import {
  ProgressBar,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import cardPropType from '../cardSchema.js';
import QuizTemplate from './quizTemplate.js';
import QuizReveal from './quizReveal.js';
import QuizProgressBar from './progressBar.js';

export default class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardIndex: 0,
      updates: [],
      disableGuess: false,
    };
  }

  onSuccess() {
    const record = this.props.cards[this.state.cardIndex];
    const newRecord = Object.assign({}, record);
    newRecord.card.successes = Object.assign(
      {},
      {
        [this.props.quizType]: 0,
      },
      newRecord.card.successes);
    newRecord.card.lastAttempts = Object.assign(
      {},
      newRecord.card.lastAttempts,
      {
        [this.props.quizType]: Date.now(),
      });
    newRecord.card.successes[this.props.quizType] += 1;
    this.setState(prevState => {
      return {
        updates: [...prevState.updates, newRecord],
        disableGuess: true,
      };
    });
  }

  onFail() {
    const record = this.props.cards[this.state.cardIndex];
    const newRecord = Object.assign({}, record);
    newRecord.card.successes = Object.assign(
      {},
      newRecord.successes,
      {
        [this.props.quizType]: 0,
      });
    newRecord.card.lastAttempts = Object.assign(
      {},
      newRecord.lastAttempts,
      {
        [this.props.quizType]: Date.now(),
      });
    this.setState(prevState => {
      return {
        updates: [...prevState.updates, newRecord],
        disableGuess: true,
      };
    });
  }

  onNext() {
    const nextIndex = this.state.cardIndex + 1;
    this.setState({
      cardIndex: nextIndex,
      disableGuess: false,
    });
  }

  render() {
    let promptField;
    let guessFields;
    switch (this.props.quizType) {
      case 'reading':
        promptField = 'kanji';
        guessFields = ['hiragana', 'meaning'];
        break;
      case 'translating':
        promptField = 'meaning';
        guessFields = ['kanji'];
        break;
      case 'listening':
        promptField = 'hiragana';
        guessFields = ['meaning'];
        break;
    }

    let quiz;
    if (this.props.cards.length <= this.state.cardIndex) {
      quiz = (
        <Row className='justify-content-center'>
          <div>
            <h1>Done!</h1>
          </div>
        </Row>
      );
    } else if (!this.state.disableGuess) {
      quiz = (
          <QuizTemplate
            promptField={promptField}
            guessFields={guessFields}
            card={this.props.cards[this.state.cardIndex].card}
            onSuccess={() => this.onSuccess()}
            onFail={() => this.onFail()}
          />
      );
    } else {
      quiz = (
          <QuizReveal
            promptField={promptField}
            guessFields={guessFields}
            card={this.props.cards[this.state.cardIndex].card}
            onNext={() => this.onNext()}
          />
      );
    }

    return (
      <div>
        <div className='large-section app-header'>
          <Container>
            <Row className='justify-content-center align-items-center'>
              <Col xs='6' md='6'>
                <Button
                  className='red'
                  size='lg'
                  block
                  onClick={() => this.props.stopQuiz(this.state.updates)} >
                  Stop quiz
                </Button>
              </Col>
            </Row>
          </Container>
        </div>

        <Container>
          {quiz}
          <QuizProgressBar
            complete={this.state.cardIndex}
            total={this.props.cards.length}
          />
        </Container>
      </div>
    );
  }
}

Quiz.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      cardId: PropTypes.string.isRequired,
      card: cardPropType.isRequired,
    })
  ),
  quizType: PropTypes.string.isRequired,
  stopQuiz: PropTypes.func.isRequired,
};
