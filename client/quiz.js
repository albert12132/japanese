import React from 'react';
import ReactDOM from 'react-dom';
import {
  Button,
  Col,
  Container,
  Input,
  Label,
  FormGroup,
  Row,
} from 'reactstrap';

export default class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardIndex: 0,
      hiragana: "",
      meaning: "",
      incorrectHiragana: false,
      incorrectMeaning: false,
      disableGuess: false,
    };
  }

  nextCard() {
    this.setState((prevState) => {
      let nextIndex = Math.floor(Math.random() * this.props.cards.length)
      if (nextIndex === prevState.cardIndex) {
        nextIndex = (nextIndex + 1) % this.props.cards.length
      }
      return {
        cardIndex: nextIndex,
        hiragana: "",
        meaning: "",
        incorrectHiragana: false,
        incorrectMeaning: false,
        disableGuess: false,
      };
    });
  }

  onTextChange(field, text) {
    const state = {
      incorrectHiragana: false,
      incorrectMeaning: false,
    };
    state[field] = text;
    this.setState(state);
  }

  guess() {
    const card = this.props.cards[this.state.cardIndex];
    const incorrectHiragana = this.state.hiragana !== card.hiragana;
    const incorrectMeaning = this.state.meaning !== card.meaning;
    if (incorrectHiragana || incorrectMeaning) {
      this.setState((prevState) => {
        return {
          incorrectHiragana: incorrectHiragana,
          incorrectMeaning: incorrectMeaning,
        };
      });
    } else {
      this.setState({
        disableGuess: true,
      });
    }
  }

  reveal() {
    const card = this.props.cards[this.state.cardIndex];
    this.setState({
      hiragana: card.hiragana,
      meaning: card.meaning,
      incorrectHiragana: false,
      incorrectMeaning: false,
      disableGuess: true,
    });
  }

  render() {
    const buttonType = this.state.incorrectHiragana || this.state.incorrectMeaning ? 'danger' : 'primary';
    return (
      <Container>
        <Row className='justify-content-center'>
          <div>
            <h1>{this.props.cards[this.state.cardIndex].kanji}</h1>
          </div>
        </Row>
        <FormGroup>
          <div className={this.state.incorrectHiragana ? 'has-danger' : ''}>
            <Row className='justify-content-center'>
              <Label md='1'>Hiragana</Label>
              <Col md='6'>
                <Input
                  placeholder='hiragana'
                  value={this.state.hiragana}
                  onChange={(event) => this.onTextChange('hiragana', event.target.value)} />
              </Col>
            </Row>
          </div>
          <div className={this.state.incorrectMeaning ? 'has-danger' : ''}>
            <Row className='justify-content-center'>
              <Label md='1'>Meaning</Label>
              <Col md='6'>
                <Input
                  placeholder='meaning'
                  value={this.state.meaning}
                  onChange={(event) => this.onTextChange('meaning', event.target.value)} />
              </Col>
            </Row>
          </div>
        </FormGroup>
        <GuessButtonGroup
          guess={() => this.guess()}
          reveal={() => this.reveal()}
          guessButtonType={buttonType}
          nextCard={() => this.nextCard()}
          stopQuiz={this.props.stopQuiz}
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
        <Row className='justify-content-center'>
          <Button
            className='col-md-6 col-10'
            size='lg'
            color='danger'
            onClick={props.stopQuiz}>
            Stop quiz
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
        <Row className='justify-content-center'>
          <Button
            className='col-md-6 col-10'
            size='lg'
            color='danger'
            onClick={props.stopQuiz}>
            Stop quiz
          </Button>
        </Row>
      </div>
    );
  }
}


