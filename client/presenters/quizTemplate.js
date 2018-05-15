import React from 'react';
import {
  Button,
  Col,
  Container,
  Input,
  InputGroup,
  Label,
  Form,
  FormGroup,
  Row,
} from 'reactstrap';
import PropTypes from 'prop-types';
import cardPropType from '../cardSchema.js';

export default class QuizTemplate extends React.Component {
  constructor(props) {
    super(props);
    const state = { correct: {} };
    for (const field of this.props.guessFields) {
      state[field] = '';
      state.correct[field] = true;
    }
    this.state = state;
  }

  onTextChange(field, text) {
    this.setState(prevState => {
      return {
        [field]: text,
        correct: Object.assign({}, prevState.correct, { [field]: true }),
      };
    });
  }

  guess() {
    const correct = {};
    let allCorrect = true;
    for (let field of this.props.guessFields) {
      if (this.state[field] !== this.props.card[field]) {
        allCorrect = false;
        correct[field] = false;
      }
    }
    if (allCorrect) {
      this.props.onSuccess();
    } else {
      this.setState(prevState => {
        return {
          correct: Object.assign({}, prevState.correct, correct),
        };
      });
    }
  }

  render() {
    let correct = true;

    const inputs = this.props.guessFields.map((field, i) => {
      correct = correct && this.state.correct[field];
      const color = this.state.correct[field] ? 'green': 'red';
      return (
          <FormGroup key={field}>
            <InputGroup>
              <Label xs='3' md='2' className={color}>{field}</Label>
              <Input
                xs='9'
                md='10'
                autoFocus={i === 0}
                value={this.state[field]}
                className={color}
                onChange={(event) => this.onTextChange(field, event.target.value)} />
            </InputGroup>
          </FormGroup>
      );
    });

    const buttonType = correct ? 'green' : 'red';

    return (
      <Container>
        <Row className='justify-content-center'>
          <div>
            <h1>{this.props.card[this.props.promptField]}</h1>
          </div>
        </Row>

        <Row className='justify-content-center'>
          <Col md='8'>
            <Form onSubmit={(event) => {
              event.preventDefault();
              this.guess();
            }}>
              {inputs}

              <div>
                <Row className='justify-content-center'>
                  <Button
                    type='submit'
                    className={buttonType}
                    size='lg'>
                    Guess
                  </Button>
                  <Button
                    size='lg'
                    onClick={this.props.onFail}>
                    Reveal
                  </Button>
                </Row>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

QuizTemplate.propTypes = {
  card: cardPropType,
  promptField: PropTypes.string.isRequired,
  guessFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSuccess: PropTypes.func.isRequired,
  onFail: PropTypes.func.isRequired,
};
