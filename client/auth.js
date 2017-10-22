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
    let failBanner = null;
    if (this.state.verificationFailed) {
      failBanner = (
        <div className='row justify-content-center'>
          <div className='col-md-6'>
            <div className='alert alert-danger'>
              <strong>Failed to verify!</strong> Try again.
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className='auth'>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-md-6'>
              <div className='input-group input-group-lg'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='phrase'
                  value={this.state.phrase}
                  onChange={(event) => this.onPhraseChange(event.target.value)} />
                <span className='input-group-btn'>
                  <button
                    className={'btn ' + buttonType}
                    onClick={() =>
                        this.props.verify(this.state.phrase, () => {
                          this.onVerificationFailed();
                        })
                    } >Verify</button>
                </span>
              </div>
            </div>
          </div>
          {failBanner}
        </div>
      </div>
    );
  }
}
