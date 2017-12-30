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
  InputGroup,
  Label,
  Form,
  FormGroup,
  Row,
} from 'reactstrap';
import QUIZ_TYPES from './quiz_types.js';

export default class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quizType: QUIZ_TYPES[0].value,
      cardIndex: 0,
      card: this.props.cards.get(0),
    };

    this.updateQuizType = this.updateQuizType.bind(this);
    this.setNextCard = this.setNextCard.bind(this);
  }

  nextCard(index) {
    if (this.props.cards.isEmpty()) {
      return null;
    }

    if (index === undefined) {
      index = this.state.cardIndex;
    }

    return this.props.cards.get(index);
  }

  setNextCard() {
    const nextIndex = this.state.cardIndex + 1;
    this.setState({
      cardIndex: nextIndex,
      card: this.nextCard(nextIndex),
    });
  }

  updateQuizType(newType) {
    this.setState({
      quizType: newType.value,
    });
  }

  render() {
    let quiz;
    switch (this.state.quizType) {
      case 'reading':
        quiz = (
          <ReadingQuiz
            card={this.state.card}
            nextCard={this.setNextCard}
            quizType={this.state.quizType}
          />
        );
        break;
      case 'translating':
        quiz = (
          <TranslatingQuiz
            card={this.state.card}
            nextCard={this.setNextCard}
            quizType={this.state.quizType}
          />
        );
        break;
      case 'listening':
        quiz = (
          <ListeningQuiz
            card={this.state.card}
            nextCard={this.setNextCard}
            quizType={this.state.quizType}
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
    const buttonType = wrong ? 'red' : 'green';

    const inputs = this.props.guessField.map((field, i) => {
      const color = this.state['incorrect' + field] ? 'red' : 'green';
      return (
          <FormGroup key={field}>
            <InputGroup>
              <Label md='2' className={color}>{field}</Label>
              <Input
                md='10'
                autoFocus={i === 0}
                value={this.state[field]}
                className={color}
                onChange={(event) => this.onTextChange(field, event.target.value)} />
            </InputGroup>
          </FormGroup>
      );
    });
    return (
      <Container>
        <Row className='justify-content-center'>
          <div>
            <h1>{this.props.card ? this.props.card[this.props.promptField] : 'Done'}</h1>
          </div>
        </Row>

        <Row className='justify-content-center'>
          <Col md='8'>
            <Form onSubmit={(event) => {
              event.preventDefault();
              if (this.state.disableGuess) {
                this.nextCard();
              } else {
                this.guess();
              }
            }}>
              {inputs}

              <GuessButtonGroup
                guess={() => this.guess()}
                reveal={() => this.reveal()}
                guessButtonType={buttonType}
                nextCard={() => this.nextCard()}
                disableGuess={this.state.disableGuess}
              />
            </Form>
          </Col>
        </Row>
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
            type='submit'
            className='green'
            size='lg'>
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
            type='submit'
            className={props.guessButtonType}
            size='lg'>
            Guess
          </Button>
          <Button
            size='lg'
            onClick={props.reveal}>
            Reveal
          </Button>
          <Button
            size='lg'
            onClick={props.nextCard}>
            Next card
          </Button>
        </Row>
      </div>
    );
  }
}


