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
import QuizHeader from './quiz_header.js';
import {
  ProgressBar,
} from 'react-bootstrap';

export default class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardIndex: 0,
      card: this.props.cards.get(0),
      updatedCards: new Set(),
    };

    this.setNextCard = this.setNextCard.bind(this);
    this.stopQuiz = this.stopQuiz.bind(this);
    this.addUpdatedCard = this.addUpdatedCard.bind(this);
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

  stopQuiz() {
    this.props.onStopQuiz();
    for (let card of this.state.updatedCards.toArray()) {
      this.props.updateCard(card);
    }
  }

  addUpdatedCard(card) {
    this.setState((prevState) => {
      return {
        updatedCards: prevState.updatedCards.add(card),
      };
    });
  }

  render() {
    let quiz;
    switch (this.props.quizType) {
      case 'reading':
        quiz = (
          <ReadingQuiz
            card={this.state.card}
            nextCard={this.setNextCard}
            quizType={this.props.quizType}
            updateCard={this.addUpdatedCard}
          />
        );
        break;
      case 'translating':
        quiz = (
          <TranslatingQuiz
            card={this.state.card}
            nextCard={this.setNextCard}
            quizType={this.props.quizType}
            updateCard={this.addUpdatedCard}
          />
        );
        break;
      case 'listening':
        quiz = (
          <ListeningQuiz
            card={this.state.card}
            nextCard={this.setNextCard}
            quizType={this.props.quizType}
            updateCard={this.addUpdatedCard}
          />
        );
        break;
    }
    return (
      <div>
        <QuizHeader
          stopQuiz={this.stopQuiz}
        />
        <Container>
          {quiz}

          <div className='large-section'>
            <Row className='justify-content-center'>
              <Col md='6'>
                <ProgressBar
                  now={this.state.cardIndex + 1}
                  max={this.props.cards.size} />
              </Col>
            </Row>
            <Row className='justify-content-center'>
              <Col md='6' className='progress-bar-text'>
                {(this.state.cardIndex + 1) + ' out of ' + this.props.cards.size}
              </Col>
            </Row>
          </div>

        </Container>
      </div>
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
      updateCard={props.updateCard}
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
      updateCard={props.updateCard}
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
      updateCard={props.updateCard}
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
        }, () => {
          this.props.updateCard(this.updateSuccess(true))
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
      this.setState(state, () => {
        this.props.updateCard(this.updateSuccess(false));
      });
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

  updateSuccess(success) {
    const newCard = {
      card_id: this.props.card.card_id,
      kanji: this.props.card.kanji,
      hiragana: this.props.card.hiragana,
      meaning: this.props.card.meaning,
    }
    if (this.props.card.tags) {
      newCard.tags = this.props.card.tags;
    }

    if (!this.props.card.successes) {
      this.props.card.successes = {};
    }
    if (!this.props.card.successes[this.props.quizType]) {
      this.props.card.successes[this.props.quizType] = 0;
    }
    if (success) {
      this.props.card.successes[this.props.quizType] += 1;
    } else {
      this.props.card.successes[this.props.quizType] = 0;
    }

    if (!this.props.card.last_attempts) {
      this.props.card.last_attempts = {};
    }
    this.props.card.last_attempts[this.props.quizType] =
        new Date().getTime();

    newCard.successes = this.props.card.successes;
    newCard.last_attempts = this.props.card.last_attempts;
    return newCard;
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


