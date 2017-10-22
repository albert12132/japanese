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
      addFailed: false,
    };
  }

  onTextChange(field, text) {
    const state = {
      addFailed: false,
    };
    state[field] = text;
    this.setState(state);
  }

  addNewCard() {
    if (this.state.kanji === ''
      || this.state.hiragana === ''
      || this.state.meaning === '') {
      this.setState({
        addFailed: true,
      });
    } else {
      this.props.addNewCard(this.state.kanji, this.state.hiragana, this.state.meaning)
      this.setState({
        kanji: "",
        hiragana: "",
        meaning: "",
        addFailed: false,
      });
    }
  }

  validate(field) {
    if (this.state.addFailed && field === '') {
      return ' has-danger'
    } else {
      return '';
    }
  }

  render() {
    const buttonType = this.state.addFailed ? 'btn-danger' : 'btn-primary';
    return (
      <div className='form-group'>
        <div className={this.validate(this.state.kanji)}>
          <div className='row'>
            <label className='col-md-2 col-form-label'>Kanji</label>
            <div className='col-md-10'>
              <input
                type='text'
                className='form-control'
                placeholder='kanji'
                value={this.state.kanji}
                onChange={(event) => this.onTextChange('kanji', event.target.value)} />
            </div>
          </div>
        </div>
        <div className={this.validate(this.state.hiragana)}>
          <div className='row'>
            <label className='col-md-2 col-form-label'>Hiragana</label>
            <div className='col-md-10'>
              <input
                type='text'
                className='form-control'
                placeholder='hiragana'
                value={this.state.hiragana}
                onChange={(event) => this.onTextChange('hiragana', event.target.value)} />
            </div>
          </div>
        </div>
        <div className={this.validate(this.state.meaning)}>
          <div className='row form-group'>
            <label className='col-md-2 col-form-label'>Meaning</label>
            <div className='col-md-10'>
              <input
                type='text'
                className='form-control'
                placeholder='meaning'
                value={this.state.meaning}
                onChange={(event) => this.onTextChange('meaning', event.target.value)} />
            </div>
          </div>
        </div>
        <div className='row justify-content-center'>
          <button
            className={'col-10 col-md-6 btn btn-block btn-lg ' + buttonType}
            onClick={() => this.addNewCard()} >Create card</button>
        </div>
      </div>
    );
  }
}

