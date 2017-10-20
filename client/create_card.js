import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

export default class CreateCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      kanji: "",
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
      <div className='form-inline'>
        <input
          type='text'
          className='form-control'
          placeholder='kanji'
          value={this.state.kanji}
          onChange={(event) => this.onTextChange('kanji', event.target.value)} />
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
            this.props.addNewCard(this.state.kanji, this.state.hiragana, this.state.meaning)
          } >Create card</button>
      </div>
    );
  }
}

