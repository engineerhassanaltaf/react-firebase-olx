import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Row, Form, FormGroup, Input, Label, Col, Button } from 'reactstrap';

import { updateCurrentUser } from '../../config/firebase';
import { setUser } from '../../store/actions/userAction';

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: null
    }
  }

  update = (e) => {
    e.preventDefault();
    this.updateProfile();
  }

  async updateProfile() {
    const { email, name, age } = this.state.user;
    try {
      const user = await updateCurrentUser(email, name, age);
      this.props.updateUser(user);
    }
    catch (err) {
      console.log(err)
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.user) {
      return {
        user: props.user
      }
    }
    return null;
  }

  updateName(name) {
    const { user } = this.state;
    this.setState({
      user: {
        ...user,
        name
      }
    })
  }

  updateAge(age) {
    const { user } = this.state;
    this.setState({
      user: {
        ...user,
        age
      }
    })
  }

  render() {
    const { email, name, age } = this.state.user;
    return (
      <div>
        <Row className="justify-content-center">
          <Col className="col-5" style={{ textAlign: 'center' }}>
            <h1 className="display-4">Your Profile</h1>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col className="col-5">
            <Form onSubmit={this.update}>
              <FormGroup>
                <Label>Email</Label>
                <Input value={email} readOnly />
              </FormGroup>
              <FormGroup>
                <Label>Name</Label>
                <Input value={name} onChange={(e) => this.updateName(e.target.value)} required />
              </FormGroup>
              <FormGroup>
                <Label>Age</Label>
                <Input value={age} onChange={(e) => this.updateAge(e.target.value)} required />
              </FormGroup>
              <FormGroup>
                <Button color="primary">Update</Button>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.userReducer.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (user) => dispatch(setUser(user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)