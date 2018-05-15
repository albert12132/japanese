import React from 'react';
import {
  Col,
  Container,
  InputGroup,
  FormGroup,
} from 'reactstrap';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import PropTypes from 'prop-types';
import QUIZ_TYPES from '../quizTypes.js';

export default function Filters(props) {
  return (
    <div>
      <Container>

        <FormGroup className='align-items-center'>
          <InputGroup className='justify-content-center'>
            <Col xs='3' md='2'>
              Practice
            </Col>
            {' '}

            <Col xs='9' md='9'>
              <Select
                clearable={false}
                value={props.quizType}
                options={QUIZ_TYPES.map(type => {
                  return {
                    value: type,
                    label: type,
                  };
                })}
                onChange={(newType) => {
                  props.updateQuizType(newType.value);
                }}
              />
            </Col>
          </InputGroup>
        </FormGroup>

        <FormGroup className='align-items-center'>
          <InputGroup className='justify-content-center'>
            <Col xs='3' md='2'>
              with tags
            </Col>
            {' '}

            <Col xs='9' md='9'>
              <Select
                multi={true}
                value={props.filteredTags}
                options={props.allTags.map(tag => {
                  return {
                    value: tag,
                    label: tag,
                  }
                })}
                placeholder='no tag filter'
                onChange={newTags => {
                  props.updateFilteredTags(newTags.map(tag => tag.value));
                }}
              />
            </Col>
          </InputGroup>
        </FormGroup>

      </Container>
    </div>
  );
}

Filters.propTypes = {
  quizType: PropTypes.string.isRequired,
  updateQuizType: PropTypes.func.isRequired,
  filteredTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  allTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  updateFilteredTags: PropTypes.func.isRequired,
};
