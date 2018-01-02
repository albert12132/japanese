import React from 'react';
import ReactDOM from 'react-dom';
import { OrderedMap, Set } from 'immutable';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import {
  Button,
  Col,
  Container,
  Row,
  Label,
  FormGroup,
  InputGroup,
} from 'reactstrap';

import QUIZ_TYPES from './quiz_types.js';

export default class CardFilter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tagsToFilter: new Set(),
    }
  }

  render() {
    return (
      <div className='white-text'>

        <FormGroup className='align-items-center'>
          <InputGroup className='justify-content-center'>
            <Col md='2'>
              Any tags in
            </Col>
            {' '}

            <Col md='9'>
              <Select
                multi={true}
                value={this.props.tagsToFilter.toArray()}
                options={this.props.tags.toArray().map(tag => {
                  return {
                    value: tag,
                    label: tag,
                  }
                })}
                placeholder='no tag filter'
                onChange={(newTags) => {
                  const newTagSet = new Set(newTags).map(tag => tag.value);
                  this.props.updateTagsToFilter(newTagSet);
                }}
              />
            </Col>
          </InputGroup>
        </FormGroup>

        <FormGroup className='align-items-center'>
          <InputGroup className='justify-content-center'>
            <Col md='2'>
              Quiz type
            </Col>
            {' '}

            <Col md='9'>
              <Select
                clearable={false}
                value={this.props.quizType}
                options={QUIZ_TYPES}
                onChange={(newType) => {
                  this.props.updateQuizType(newType.value);
                }}
              />
            </Col>
          </InputGroup>
        </FormGroup>
      </div>
    );
  }
}

