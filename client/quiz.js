import React from 'react';
import ReactDOM from 'react-dom';

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
    const buttonType = this.state.incorrectHiragana || this.state.incorrectMeaning ? 'btn-danger' : 'btn-primary';
    return (
      <div className='container'>
        <div className='row justify-content-center'>
          <div>
            <h1>{this.props.cards[this.state.cardIndex].kanji}</h1>
          </div>
        </div>
        <div className='form-group'>
          <div className={this.state.incorrectHiragana ? 'has-danger' : ''}>
            <div className='row justify-content-center'>
              <label className='col-md-1 col-form-label'>Hiragana</label>
              <div className='col-md-6'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='hiragana'
                  value={this.state.hiragana}
                  onChange={(event) => this.onTextChange('hiragana', event.target.value)} />
              </div>
            </div>
          </div>
          <div className={this.state.incorrectMeaning ? 'has-danger' : ''}>
            <div className='row justify-content-center'>
              <label className='col-md-1 col-form-label'>Meaning</label>
              <div className='col-md-6'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='meaning'
                  value={this.state.meaning}
                  onChange={(event) => this.onTextChange('meaning', event.target.value)} />
              </div>
            </div>
          </div>
        </div>
        <GuessButtonGroup
          guess={() => this.guess()}
          reveal={() => this.reveal()}
          guessButtonType={buttonType}
          nextCard={() => this.nextCard()}
          stopQuiz={this.props.stopQuiz}
          disableGuess={this.state.disableGuess}
        />
      </div>
    );
  }
}

function GuessButtonGroup(props) {
  if (props.disableGuess) {
    return (
      <div>
        <div className='row justify-content-center'>
          <button
            key='next-card'
            className='col-md-6 btn btn-lg btn-success'
            onClick={props.nextCard}>
            Next card
          </button>
        </div>
        <div className='row justify-content-center'>
          <button
            className='col-md-6 btn btn-lg btn-danger'
            onClick={props.stopQuiz}>
            Stop quiz
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className='row justify-content-center'>
          <button
            className={'col-md-2 col-10 btn btn-lg ' + props.guessButtonType}
            onClick={props.guess}>
            Guess
          </button>
          <button
            className='col-md-2 col-5 btn btn-lg btn-secondary'
            onClick={props.reveal}>
            Reveal
          </button>
          <button
            key='next-card'
            className='col-md-2 col-5 btn btn-lg btn-secondary'
            onClick={props.nextCard}>
            Next card
          </button>
        </div>
        <div className='row justify-content-center'>
          <button
            className='col-md-6 col-10 btn btn-lg btn-danger'
            onClick={props.stopQuiz}>
            Stop quiz
          </button>
        </div>
      </div>
    );
  }
}


