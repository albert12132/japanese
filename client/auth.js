import React from 'react';
import ReactDOM from 'react-dom';
import {
  Button,
  Col,
  Container,
  Row,
} from 'reactstrap';

export default class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phrase: '',
      verificationFailed: false,
    };

    this.responseGoogle = this.responseGoogle.bind(this);
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

  responseGoogle(response) {
    console.log(response);
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
      <Container>
        <Row className='justify-content-center'>
          <Col md='6'>
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
          </Col>
        </Row>
        {failBanner}
      </Container>
    );
  }
}
