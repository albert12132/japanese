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

export default function QuizReveal(props) {
  const inputs = props.guessFields.map((field, i) => {
    return (
        <FormGroup key={field}>
          <InputGroup>
            <Label xs='3' md='2'>{field}</Label>
            <Input
              xs='9'
              md='10'
              autoFocus={i === 0}
              readOnly
              value={props.card[field]} />
          </InputGroup>
        </FormGroup>
    );
  });

  return (
    <Container>
      <Row className='justify-content-center'>
        <div>
          <h1>{props.card[props.promptField]}</h1>
        </div>
      </Row>

      <Row className='justify-content-center'>
        <Col md='8'>
          <Form onSubmit={(event) => {
            event.preventDefault();
            props.onNext();
          }}>
            {inputs}

            <Row className='justify-content-center'>
              <Button
                type='submit'
                className='green'
                size='lg'>
                Next card
              </Button>
            </Row>

          </Form>
        </Col>
      </Row>
    </Container>
  );
}

QuizReveal.propTypes = {
  card: cardPropType,
  promptField: PropTypes.string.isRequired,
  guessFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  onNext: PropTypes.func.isRequired,
};
