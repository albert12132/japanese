import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  FormControl,
  InputGroup,
  Input,
  Row,
} from 'reactstrap';
import AppClient from './client.js';

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phrase: '',
      verificationFailed: false,
    };

    this.client = new AppClient();

    this.onLoginSubmit = this.onLoginSubmit.bind(this);
    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.onLoginFail = this.onLoginFail.bind(this);
  }

  onPhraseChange(text) {
    this.setState({
      phrase: text,
      verificationFailed: false,
    });
  }

  onLoginSubmit(event) {
    event.preventDefault();
    $.post('/auth/login', {
      token: this.state.phrase,
    })
    .done(this.onLoginSuccess)
    .fail(this.onLoginFail);
  }

  onLoginSuccess() {
    window.location.replace('/');
  }

  onLoginFail() {
    this.setState({
      verificationFailed: true,
    });
  }

  render() {
    let color;
    if (this.state.verificationFailed) {
      color = 'red';
    } else {
      color = 'green';
    }
    return (
      <div className='large-section'>
        <Container>
          <Row className='justify-content-center'>
            <Col md='6'>
              <Form onSubmit={this.onLoginSubmit}>
                <FormGroup>
                  <InputGroup>
                    <Input
                      autoFocus
                      type='password'
                      className={color}
                      placeholder='password'
                      value={this.state.phrase}
                      onChange={(event) => this.onPhraseChange(event.target.value)} />
                    <Button
                      type='submit'
                      className={color}
                    >Login</Button>
                  </InputGroup>

                </FormGroup>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

ReactDOM.render(
  <LoginPage />,
  document.getElementById('root')
);

