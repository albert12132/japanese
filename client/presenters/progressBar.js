import React from 'react';
import {
  Col,
  Container,
  Row,
} from 'reactstrap';
import {
  ProgressBar,
} from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function QuizProgressBar(props) {
  return (
    <div className='large-section'>
      <Row className='justify-content-center'>
        <Col md='6'>
          <ProgressBar
            now={props.complete}
            max={props.total} />
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <Col md='6' className='progress-bar-text'>
          {`${props.complete} out of ${props.total}`}
        </Col>
      </Row>
    </div>
  );
}

QuizProgressBar.propTypes = {
  complete: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};
