import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { GoogleLogin } from 'react-google-login';
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
      verificationFailed: false,
    };

    this.onLogin = this.onLogin.bind(this);
    this.onVerificationFailed = this.onVerificationFailed.bind(this);
  }

  onVerificationFailed() {
    this.setState({
      verificationFailed: true,
    });
  }

  onLogin(response) {
    this.props.verify(response.tokenId, this.onVerificationFailed);
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
            <GoogleLogin
              clientId="758984664053-vfv9uik68cssqfn0s7m6sc60t8u0fon0.apps.googleusercontent.com"
              className='btn btn-primary btn-block btn-lg'
              buttonText="Login"
              onSuccess={this.onLogin}
              onFailure={this.onVerificationFailed}
            />
          </Col>
        </Row>
        {failBanner}
      </Container>
    );
  }
}
