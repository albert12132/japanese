import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { OrderedSet } from 'immutable';
import {
  Button,
  Col,
  Container,
  Input,
  Label,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from 'reactstrap';

export default class EditCardModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      card_id: this.props.initialCard.card_id || null,
      kanji: this.props.initialCard.kanji || '',
      hiragana: this.props.initialCard.hiragana || '',
      meaning: this.props.initialCard.meaning || '',
      tags: this.props.initialCard.tags || [],
      saveFailed: false,
    };

    this.saveCard = this.saveCard.bind(this);
    this.close = this.close.bind(this);
  }

  onTextChange(field, text) {
    const state = {
      saveFailed: false,
    }
    state[field] = text;
    this.setState(state);
  }

  saveCard() {
    if (this.state.kanji === ''
        || this.state.hiragana === ''
        || this.state.meaning === '') {
      this.setState({
        saveFailed: true,
      });
    } else {
      this.props.saveCard({
        card_id: this.state.card_id,
        kanji: this.state.kanji,
        hiragana: this.state.hiragana,
        meaning: this.state.meaning,
        tags: this.state.tags.map((select) => select.value),
      });
      this.close();
    }
  }

  close() {
    this.setState({
      kanji: '',
      hiragana: '',
      meaning: '',
      saveFailed: false,
      tags: [],
    });
    this.props.close();
  }

  validate(field) {
    if (this.state.saveFailed && field === '') {
      return 'has-danger';
    } else {
      return '';
    }
  }

  render() {
    const buttonType = this.state.saveFailed ? 'danger' : 'primary';
    let deleteCardButton = null;
    if (this.props.deleteCard && this.state.card_id) {
      deleteCardButton = (
        <Button
          color='danger'
          onClick={() => {
            this.props.deleteCard(this.state.card_id);
            this.close();
          }}>
          Delete
        </Button>
      );
    }
    return (
      <Modal isOpen={this.props.modal} toggle={this.close}>
        <ModalHeader toggle={this.close}>Edit card</ModalHeader>

        <ModalBody>
          <FormGroup row className={this.validate(this.state.kanji)}>
            <Col md='12'>
              <Input
                placeholder='kanji'
                className='edit-card-input edit-card-input-kanji'
                value={this.state.kanji}
                onChange={(event) => this.onTextChange('kanji', event.target.value)} />
            </Col>
          </FormGroup>
          <FormGroup row className={this.validate(this.state.hiragana)}>
            <Col md='12'>
              <Input
                placeholder='hiragana'
                className='edit-card-input'
                value={this.state.hiragana}
                onChange={(event) => this.onTextChange('hiragana', event.target.value)} />
            </Col>
          </FormGroup>
          <FormGroup row className={this.validate(this.state.meaning)}>
            <Col md='12'>
              <Input
                placeholder='meaning'
                className='edit-card-input'
                value={this.state.meaning}
                onChange={(event) => this.onTextChange('meaning', event.target.value)} />
            </Col>
          </FormGroup>
          <Row>
            <Col>
              <Select.Creatable
                multi={true}
                placeholder='Tags'
                value={this.state.tags}
                options={this.props.tags.toArray().map(tag => {
                  return {
                    value: tag,
                    label: tag,
                  }
                })}
                onChange={(newTags) => {
                  this.setState({
                    tags: newTags,
                  });
                }}
              />
              </Col>
          </Row>
        </ModalBody>

        <ModalFooter>
          <Button
            color={buttonType}
            onClick={this.saveCard} >
            Save
          </Button>
          <Button
            color='secondary'
            onClick={this.close}>
            Cancel
          </Button>
          {deleteCardButton}
        </ModalFooter>
      </Modal>
    );
  }
}

