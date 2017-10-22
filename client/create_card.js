import React from 'react';
import ReactDOM from 'react-dom';
import {
  Button,
  Col,
  Container,
  Row,
} from 'reactstrap';
import EditCardModal from './edit_card.js';

export default class CreateCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    return (
      <Row className='justify-content-center'>
        <Col xs='10' md='6'>
          <Button
            color='primary'
            size='lg'
            block
            onClick={this.toggle}>
            Create card
          </Button>
        </Col>
        <EditCardModal
          initialCard={{}}
          modal={this.state.modal}
          close={this.toggle}
          saveCard={this.props.addNewCard}
        />
      </Row>
    );
  }
}

