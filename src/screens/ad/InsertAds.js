import React, { Component } from 'react';

import { Row, Form, FormGroup, Input, Label, Col, Button, FormText, Modal, ModalHeader, ModalBody } from 'reactstrap';

import { addAdItem, uploadImagesToFirebase, getCategories, getLocations } from '../../config/firebase'

class InsertAds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      title: '',
      description: '',
      price: '',
      category: '',
      location: '',
      showModal: false,
      categories: [],
      locations: []
    };
  }

  toggle() {
    this.setState(prevState => ({
      showModal: !prevState.showModal
    }));
  }

  addItem = (e) => {
    e.preventDefault();
    this.addItemToFirebase();
  }

  async addItemToFirebase() {
    const { title, description, price, category, location, images } = this.state;
    try {
      const imageDownloadUrls = await uploadImagesToFirebase(images);
      await addAdItem(title, description, parseInt(price), category, location, imageDownloadUrls)
      this.setState({
        showModal: false,
        statusMessage: "Ad added Successfully!",
        showAlertMessage: true
      });
    }
    catch (err) {
      this.setState({
        statusMessage: err,
        showAlertMessage: true
      });
    }
  }

  async getCategories() {
    try {
      const response = await getCategories();
      this.setState({
        category: response[0],
        categories: response
      });
    } catch (e) {
      this.setState({
        statusMessage: e,
        showAlertMessage: true
      });
    }
  }
  
  async getLocations() {
    try {
      const response = await getLocations();
      this.setState({
        location: response[0].name,
        locations: response
      });
    } catch (e) {
      this.setState({
        statusMessage: e,
        showAlertMessage: true
      });
    }
  }

  componentDidMount() {
    this.getCategories();
    this.getLocations();
  }

  render() {
    const { showModal, categories, locations } = this.state;
    return (
      <div>
        <Button color="danger" onClick={() => this.toggle()}>Post Ad</Button>
        
        <Modal isOpen={showModal} toggle={() => this.toggle()} >
          <ModalHeader toggle={() => this.toggle()}>Ad Details</ModalHeader>
          <ModalBody>
            <div>
              <Row>
                <Col>
                  <Form onSubmit={this.addItem}>
                    <FormGroup>
                      <Label>Title</Label>
                      <Input onChange={(e) => this.setState({ title: e.target.value })} required />
                    </FormGroup>
                    <FormGroup>
                      <Label>Description</Label>
                      <Input onChange={(e) => this.setState({ description: e.target.value })} required />
                    </FormGroup>
                    <FormGroup>
                      <Label>Price</Label>
                      <Input type="number" onChange={(e) => this.setState({ price: e.target.value })} required />
                    </FormGroup>
                    <FormGroup>
                      <Label>Category</Label>
                      <Input type="select" onChange={(e) => this.setState({ category: e.target.value })}>
                        {
                          categories.map((category, index) => {
                            return <option key={index}>{category}</option>
                          })
                        }
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label>Location</Label>
                      <Input type="select" onChange={(e) => this.setState({ location: e.target.value })}>
                        {
                          locations.map((location, index) => {
                            return <option key={index}>{location.name}</option>
                          })
                        }
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label for="exampleFile">Images</Label>
                      <Input type="file" onChange={e => this.setState({ images: e.target.files })} multiple />
                      <FormText color="muted">
                        Please upload Image files
                      </FormText>
                    </FormGroup>
                    <FormGroup>
                      <Button color="primary">Add</Button>
                    </FormGroup>
                  </Form>
                </Col>
              </Row>
            </div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

export default InsertAds