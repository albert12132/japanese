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
      cards: this.props.cards.slice(),
      tagsToFilter: [],
    };

    this.updateTagFilter = this.updateTagFilter.bind(this);
  }

  nextCard() {
    this.setState((prevState) => {
      let nextIndex = 0;
      if (prevState.cards.length > 0) {
        let nextIndex = Math.floor(Math.random() * prevState.cards.length)
        if (nextIndex === prevState.cardIndex) {
          nextIndex = (nextIndex + 1) % prevState.cards.length
        }
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
    if (this.state.cards.length === 0) {
      return;
    }

    const card = this.state.cards[this.state.cardIndex];
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
    if (this.state.cards.length === 0) {
      return;
    }

    const card = this.state.cards[this.state.cardIndex];
    this.setState({
      hiragana: card.hiragana,
      meaning: card.meaning,
      incorrectHiragana: false,
      incorrectMeaning: false,
      disableGuess: true,
    });
  }

  updateTagFilter(newTags) {
    if (newTags.length > 0) {
      const newTagsSet = new Set(newTags).map(tag => tag.value);
      const newCards = this.props.cards.filter(card => newTagsSet.isSubset(card.tags));
      this.setState({
        tagsToFilter: newTags,
        cards: newCards,
      });
    } else {
      this.setState({
        tagsToFilter: newTags,
        cards: this.props.cards.slice(),
      });
    }
    // Skip to the next card.
    this.nextCard();
  }

  render() {
    const buttonType = this.state.incorrectHiragana || this.state.incorrectMeaning ? 'danger' : 'primary';
    return (
      <Container>
        <Row className='justify-content-center'>
          <Col md='7'>
            Filter tags
            <Select
              multi={true}
              value={this.state.tagsToFilter}
              options={this.props.tags.toArray().map(tag => {
                return {
                  value: tag,
                  label: tag,
                }
              })}
              onChange={this.updateTagFilter}
            />
            <hr/>
          </Col>
        </Row>

        <Row className='justify-content-center'>
          <div>
            <h1>{this.state.cardIndex >= this.state.cards.length
                ?  'No results'
                : this.state.cards[this.state.cardIndex].kanji}</h1>
          </div>
        </Row>

        <FormGroup>
          <div className={this.state.incorrectHiragana ? 'has-danger' : ''}>
            <Row className='justify-content-center'>
              <Label md='1'>Hiragana</Label>
              <Col md='6'>
                <Input
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


