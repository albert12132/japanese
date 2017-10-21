import React from 'react';
import ReactDOM from 'react-dom';

export default class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phrase: '',
      verificationFailed: false,
    };
  }

  onPhraseChange(text) {
    this.setState({
      phrase: text,
      verificationFailed: false,
    });
  }

  onVerificationFailed() {
    this.setState({
      verificationFailed: true,
    });
  }

  render() {
    const buttonType = this.state.verificationFailed ? 'btn-danger' : 'btn-primary';
    return (
      <div>
        <input
          type='text'
          className='form-control'
          placeholder='phrase'
          value={this.state.phrase}
          onChange={(event) => this.onPhraseChange(event.target.value)} />
        <button
          className={'btn ' + buttonType}
          onClick={() =>
              this.props.verify(this.state.phrase, () => {
                this.onVerificationFailed();
              })
          } >Verify</button>
        {this.state.verificationFailed
            ? <span>Verification failed</span>
            : null}
      </div>
    );
  }
}
