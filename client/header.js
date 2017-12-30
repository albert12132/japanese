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
} from 'reactstrap';
import CreateCard from './create_card.js';

export default function Header(props) {
  return (
    <div className='app-header large-section'>
      <Container>
        <Row className='justify-content-center align-items-center'>
          <Col xs='5' md='3'>
            <Button
              className={props.quizEnabled ? 'red' : 'green'}
              size='lg'
              block
              onClick={props.toggleQuizEnabled} >
              {props.quizEnabled ? 'Stop quiz' : 'Start quiz'}
            </Button>
          </Col>
          <Col xs='5' md='3'>
            <CreateCard
              addNewCard={props.addNewCard}
              tags={props.tags}
            />
          </Col>
          <Col xs='10' md='6'>
            <Select
              multi={true}
              value={props.tagsToFilter.toArray()}
              options={props.tags.toArray().map(tag => {
                return {
                  value: tag,
                  label: tag,
                }
              })}
              placeholder='Filter by tags...'
              onChange={(newTags) => {
                const newTagsSet = new Set(newTags).map(tag => tag.value);
                props.updateTagFilter(newTagsSet);
              }}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

