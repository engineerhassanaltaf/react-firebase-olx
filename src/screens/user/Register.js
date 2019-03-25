import React, { Component } from 'react';

import { Row, Form, FormGroup, Input, Label, Col, Button } from 'reactstrap';

import { register } from '../../config/firebase'

class Register extends Component {
  constructor() {
    super();

    this.state = {
      email: '',
      password: '',
      name: '',
      age: ''
    }
  }

  register = (e) => {
    e.preventDefault();
    this.registerUser()
  }

  async registerUser() {
    const { email, password, name, age } = this.state;
    try {
      await register(email, password, name, age);
      // alert("Registered Successfully!");
      this.props.history.push('/login');
    }
    catch (err) {
      console.log(err)
    }
  }

  render() {
    return (
      <div>
        <Row className="justify-content-center">
          <Col className="col-5" style={{ textAlign: 'center' }}>
            <h1 className="display-4">Please Register</h1>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col className="col-5">
            <Form onSubmit={this.register}>
              <FormGroup>
                <Label>Email</Label>
                <Input type="email" onChange={(e) => this.setState({ email: e.target.value })} required />
              </FormGroup>
              <FormGroup>
                <Label>Password</Label>
                <Input type="password" onChange={(e) => this.setState({ password: e.target.value })} required />
              </FormGroup>
              <FormGroup>
                <Label>Name</Label>
                <Input onChange={(e) => this.setState({ name: e.target.value })} required />
              </FormGroup>
              <FormGroup>
                <Label>Age</Label>
                <Input onChange={(e) => this.setState({ age: e.target.value })} required />
              </FormGroup>
              <FormGroup>
                <Button color="primary">Register</Button>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Register