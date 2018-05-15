import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import {
  Button,
  Col,
  Input,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from 'reactstrap';
import PropTypes from 'prop-types';
import cardPropTypes from '../cardSchema.js';

export default class EditCardModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      kanji: this.props.initialCard ? this.props.initialCard.kanji : '',
      hiragana: this.props.initialCard ? this.props.initialCard.hiragana : '',
      meaning: this.props.initialCard ? this.props.initialCard.meaning : '',
      tags: this.props.initialCard ? this.props.initialCard.tags : [],
      saveFailed: false,
    };

    this.saveCard = this.saveCard.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      kanji: nextProps.initialCard ? nextProps.initialCard.kanji : '',
      hiragana: nextProps.initialCard ? nextProps.initialCard.hiragana : '',
      meaning: nextProps.initialCard ? nextProps.initialCard.meaning : '',
      tags: nextProps.initialCard ? nextProps.initialCard.tags : [],
      saveFailed: false,
    });
  }

  onTextChange(field, text) {
    this.setState({
      saveFailed: false,
      [field]: text,
    });
  }

  saveCard() {
    if (this.state.kanji === ''
      || this.state.hiragana === ''
      || this.state.meaning === '') {
      this.setState({
        saveFailed: true,
      });
    } else {
      const newCard = Object.assign(
        {
          successes: {},
        },
        this.props.initialCard,
        {
          kanji: this.state.kanji,
          hiragana: this.state.hiragana,
          meaning: this.state.meaning,
          tags: this.state.tags,
        });
      this.props.onSave(newCard, this.props.cardId);
      this.props.onClose();
    }
  }

  validate(field) {
    if (this.state.saveFailed && field === '') {
      return 'has-danger';
    } else {
      return '';
    }
  }

  render() {
    const buttonType = this.state.saveFailed ? 'red' : 'green';
    let deleteCardButton = null;
    if (this.props.cardId) {
      deleteCardButton = (
        <Button
          className='red'
          onClick={() => {
            this.props.onDelete(this.props.cardId);
            this.props.onClose();
          }}>
          Delete
        </Button>
      );
    }
    return (
      <Modal isOpen={this.props.visible} toggle={this.props.onClose}>
        <ModalHeader toggle={this.onClose}>Edit card</ModalHeader>

        <ModalBody>
          <Form onSubmit={(event) => {
            event.preventDefault();
            this.saveCard();
          }}>
          <FormGroup row className={this.validate(this.state.kanji)}>
            <Col md='12'>
              <Input
                autoFocus
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

          <FormGroup>
            <Col>
              <Select.Creatable
                multi={true}
                placeholder='Tags'
                value={this.state.tags}
                options={this.state.tags.concat(this.props.tags)
                    .map(tag => {
                      return {
                        value: tag,
                        label: tag,
                      }
                    })}
                    onChange={(newTags) => {
                      this.setState({
                        tags: newTags.map(select => select.value),
                      });
                    }}
                  />
                </Col>
              </FormGroup>

              <Row className='justify-content-center'>
                <Button
                  type='submit'
                  className={buttonType}
                >
                  Save
                </Button>
                <Button
                  onClick={this.props.onClose}>
                  Cancel
                </Button>
                {deleteCardButton}
              </Row>
            </Form>
          </ModalBody>
        </Modal>
    );
  }
}

EditCardModal.propTypes = {
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  initialCard: cardPropTypes,
}
