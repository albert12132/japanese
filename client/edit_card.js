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
    return (
      <Modal isOpen={this.props.modal} toggle={this.close}>
        <ModalHeader toggle={this.close}>Edit card</ModalHeader>

        <ModalBody>
          <FormGroup row className={this.validate(this.state.kanji)}>
            <Label md='2'>Kanji</Label>
            <Col md='10'>
              <Input
                placeholder='kanji'
                value={this.state.kanji}
                onChange={(event) => this.onTextChange('kanji', event.target.value)} />
            </Col>
          </FormGroup>
          <FormGroup row className={this.validate(this.state.hiragana)}>
            <Label md='2'>Hiragana</Label>
            <Col md='10'>
              <Input
                placeholder='hiragana'
                value={this.state.hiragana}
                onChange={(event) => this.onTextChange('hiragana', event.target.value)} />
            </Col>
          </FormGroup>
          <FormGroup row className={this.validate(this.state.meaning)}>
            <Label md='2'>Meaning</Label>
            <Col md='10'>
              <Input
                placeholder='meaning'
                value={this.state.meaning}
                onChange={(event) => this.onTextChange('meaning', event.target.value)} />
            </Col>
          </FormGroup>
          <Row>
            <Col>
              Tags
              <Select.Creatable
                multi={true}
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
        </ModalFooter>
      </Modal>
    );
  }
}
