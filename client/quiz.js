import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import { Set } from 'immutable';
import 'react-select/dist/react-select.css';
import {
  Button,
  Col,
  Container,
  Input,
  Label,
  FormGroup,
  Row,
} from 'reactstrap';
import QUIZ_TYPES from './quiz_types.js';

export default class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quizType: QUIZ_TYPES[0].value,
      card: this.nextCard(QUIZ_TYPES[0].value),
    };

    this.updateQuizType = this.updateQuizType.bind(this);
    this.setNextCard = this.setNextCard.bind(this);
  }

  nextCard(quizType) {
    if (this.props.cards.isEmpty()) {
      return null;
    }

    return this.props.quizClient.pickCard(
        this.props.cards, quizType || this.state.quizType);
  }

  setNextCard() {
    this.setState({
      card: this.nextCard(),
    });
  }

  updateQuizType(newType) {
    this.setState({
      quizType: newType.value,
    });
  }

  render() {
    const buttonType = this.state.incorrectHiragana || this.state.incorrectMeaning ? 'danger' : 'primary';
    let quiz;
    switch (this.state.quizType) {
      case 'reading':
        quiz = (
          <ReadingQuiz
            card={this.state.card}
            nextCard={this.setNextCard}
            quizType={this.state.quizType}
            quizClient={this.props.quizClient}
          />
        );
        break;
      case 'translating':
        quiz = (
          <TranslatingQuiz
            card={this.state.card}
            nextCard={this.setNextCard}
            quizType={this.state.quizType}
            quizClient={this.props.quizClient}
          />
        );
        break;
      case 'listening':
        quiz = (
          <ListeningQuiz
            card={this.state.card}
            nextCard={this.setNextCard}
            quizType={this.state.quizType}
            quizClient={this.props.quizClient}
          />
        );
        break;
    }
    return (
      <Container>
        <Row className='justify-content-center'>
          <Col md='7'>
            <Select
              clearable={false}
              value={this.state.quizType}
              options={QUIZ_TYPES}
              placeholder='Quiz type...'
              onChange={this.updateQuizType}
            />
          </Col>
        </Row>

        <hr/>

        {quiz}

      </Container>
    );
  }
}

function ReadingQuiz(props) {
  return (
    <QuizTemplate
      promptField='kanji'
      guessField={['hiragana', 'meaning']}
      card={props.card}
      nextCard={props.nextCard}
      quizType={props.quizType}
      quizClient={props.quizClient}
    />
  );
}

function TranslatingQuiz(props) {
  return (
    <QuizTemplate
      promptField='meaning'
      guessField={['kanji']}
      card={props.card}
      nextCard={props.nextCard}
      quizType={props.quizType}
      quizClient={props.quizClient}
    />
  );
}

function ListeningQuiz(props) {
  return (
    <QuizTemplate
      promptField='hiragana'
      guessField={['meaning']}
      card={props.card}
      nextCard={props.nextCard}
      quizType={props.quizType}
      quizClient={props.quizClient}
    />
  );
}

class QuizTemplate extends React.Component {
  constructor(props) {
    super(props);
    const state = {
      disableGuess: false,
    };
    for (const field of this.props.guessField) {
      state[field] = '';
      state['incorrect' + field] = false;
    }
    this.state = state;
  }

  onTextChange(field, text) {
    const state = {}
    state['incorrect' + field] = false
    state[field] = text;
    this.setState(state);
  }

  guess() {
    if (this.props.card) {
      let wrong = false;
      const state = {};
      for (const field of this.props.guessField) {
        if (this.state[field] !== this.props.card[field]) {
          state['incorrect' + field] = true;
          wrong = true;
        }
      }
      if (wrong) {
        this.setState(state);
      } else {
        this.props.quizClient.successfulGuess(this.props.card.card_id, this.props.quizType);
        this.setState({
          disableGuess: true,
        });
      }
    }
  }

  reveal() {
    if (this.props.card) {
      const state = {
        disableGuess: true,
      };
      for (const field of this.props.guessField) {
        state[field] = this.props.card[field];
        state['incorrect' + field] = false;
      }
      this.setState(state);
    }
  }

  nextCard() {
    this.props.nextCard();
    const state = {
      disableGuess: false,
    };
    for (const field of this.props.guessField) {
      state[field] = '';
      state['incorrect' + field] = false;
    }
    this.setState(state);
  }

  render() {
    let wrong = false;
    for (const field of this.props.guessField) {
      if (this.state['incorrect' + field]) {
        wrong = true;
        break;
      }
    }
    const buttonType = wrong ? 'danger' : 'primary';

    const inputs = this.props.guessField.map((field) => {
      return (
          <div key={field} className={this.state['incorrect' + field] ? 'has-danger' : ''}>
            <Row className='justify-content-center'>
              <Label md='1'>{field}</Label>
              <Col md='6'>
                <Input
                  value={this.state[field]}
                  onChange={(event) => this.onTextChange(field, event.target.value)} />
              </Col>
            </Row>
          </div>
      );
    });
    return (
      <Container>
        <Row className='justify-content-center'>
          <div>
            <h1>{this.props.card ? this.props.card[this.props.promptField] : 'No results'}</h1>
          </div>
        </Row>

        <FormGroup>
          {inputs}
        </FormGroup>

        <GuessButtonGroup
          guess={() => this.guess()}
          reveal={() => this.reveal()}
          guessButtonType={buttonType}
          nextCard={() => this.nextCard()}
          disableGuess={this.state.disableGuess}
        />
      </Container>
    );
  }
}

function GuessButtonGroup(props) {
  if (props.disableGuess) {
    return (
      <div>
        <Row className='justify-content-center'>
          <Button
            key='top-middle-btn'
            className='col-md-6 col-10'
            size='lg'
            color='success'
            onClick={props.nextCard}>
            Next card
          </Button>
        </Row>
      </div>
    );
  } else {
    return (
      <div>
        <Row className='justify-content-center'>
          <Button
            className='col-md-2 col-10'
            size='lg'
            color={props.guessButtonType}
            onClick={props.guess}>
            Guess
          </Button>
          <Button
            key='top-middle-btn'
            className='col-md-2 col-5'
            size='lg'
            color='secondary'
            onClick={props.reveal}>
            Reveal
          </Button>
          <Button
            className='col-md-2 col-5'
            size='lg'
            color='secondary'
            onClick={props.nextCard}>
            Next card
          </Button>
        </Row>
      </div>
    );
  }
}


