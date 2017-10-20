import React from 'react';
import ReactDOM from 'react-dom';

export default class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardIndex: 0,
      incorrectAttempts: 0,
    }
  }

  setRandomCard() {
    this.setState((prevState) => {
      const nextIndex = prevState.cardIndex + 1;
      return {
        cardIndex: nextIndex,
        incorrectAttempts: 0,
      };
    });
  }

  guess(hiragana, meaning) {
    if (hiragana === this.props.cards[this.state.cardIndex].hiragana
        && meaning === this.props.cards[this.state.cardIndex].meaning) {
      this.setRandomCard();
    } else {
      this.setState((prevState) => {
        return {
          incorrectAttempts: prevState.incorrectAttempts + 1,
        };
      });
    }
  }

  render() {
    if (this.state.cardIndex >= this.props.cards.length) {
      return null;
    }
    return (
      <div>
        <CurrentWord
          kanji={this.props.cards[this.state.cardIndex].kanji}
          guess={(hiragana, meaning) => this.guess(hiragana, meaning)}
          incorrectAttempts={this.state.incorrectAttempts}
        />
        <div className='row justify-content-center'>
          <button
            className='btn btn-secondary'
            onClick={() => this.setRandomCard()}>
            Next card
          </button>
        </div>
      </div>
    );
  }
}

class CurrentWord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hiragana: "",
      meaning: "",
    };
  }

  onTextChange(field, text) {
    const state = {};
    state[field] = text;
    this.setState(state);
  }

  render() {
    return (
      <div>
        <div className='row form-inline'>
          <span>{this.props.kanji}</span>
          <input
            type='text'
            className='form-control'
            placeholder='hiragana'
            value={this.state.hiragana}
            onChange={(event) => this.onTextChange('hiragana', event.target.value)} />
          <input
            type='text'
            className='form-control'
            placeholder='meaning'
            value={this.state.meaning}
            onChange={(event) => this.onTextChange('meaning', event.target.value)} />
          <button
            className='btn btn-primary'
            onClick={() =>
              this.props.guess(this.state.hiragana, this.state.meaning)
            } >Guess</button>
        </div>
        <div className='row justify-content-center'>
          Incorrect attempts: {this.props.incorrectAttempts}
        </div>
      </div>
    );
  }
}


