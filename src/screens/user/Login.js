import React, { Component } from 'react';
import { connect } from 'react-redux';
import swal from 'sweetalert';

import { Row, Form, FormGroup, Input, Label, Col, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';

import { login, getUserData, forgotPassword, loginWithGoogle } from '../../config/firebase';
import { setUser } from '../../store/actions/userAction';

class Login extends Component {
  constructor() {
    super();

    this.state = {
      email: '',
      password: '',
      showModal: false
    }
  }

  login = (e) => {
    e.preventDefault();
    this.loginUser()
  }

  async loginUser() {
    const { email, password } = this.state
    try {
      document.getElementById("loader").removeAttribute("hidden");
      const userId = await login(email, password);
      const user = await getUserData(userId);

      this.props.setUser(user);
      this.props.history.push('/');
    }
    catch (err) {
      console.log(err);
    }
  }

  toggleModal() {
    this.setState(prevState => ({
      showModal: !prevState.showModal
    }));
  }

  onGoogleSignButtonClick() {
    loginWithGoogle();
  }

  async onForgotPasswordClick() {
    const { forgotPasswordEmailAddress } = this.state;
    try {
      await forgotPassword(forgotPasswordEmailAddress);
      swal(`Verification email has been sent to ${forgotPasswordEmailAddress}!`);
    } catch (err) {
      console.log(err);
    }
  }

  modalFormSubmit = (e) => {
    e.preventDefault();
    this.onForgotPasswordClick();
  }

  render() {
    const { showModal } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col className="col-5" style={{ textAlign: 'center' }}>
            <h1 className="display-4">Please Login</h1>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col className="col-5">
            <Form onSubmit={this.login}>
              <FormGroup>
                <Label>Email</Label>
                <Input type="email" onChange={(e) => this.setState({ email: e.target.value })} required />
              </FormGroup>
              <FormGroup>
                <Label>Password</Label>
                <Input type="password" onChange={(e) => this.setState({ password: e.target.value })} required />
              </FormGroup>
              <FormGroup>
                <Button color="primary">
                  <div style={{ float: 'left', marginRight: '5px' }}>
                    <span hidden className="spinner-border spinner-border-sm" id="loader" role="status" aria-hidden="true"></span>
                  </div>
                  Login</Button>
              </FormGroup>
            </Form>

            <Button onClick={() => this.toggleModal()}>Forgot my password</Button>
            {/* <Button onClick={() => this.onGoogleSignButtonClick()}>Login with Google</Button> */}
          </Col>
        </Row>

        <Modal isOpen={showModal} toggle={() => this.toggleModal()} >
          <ModalHeader toggle={() => this.toggleModal()}>Forgot password</ModalHeader>
          <ModalBody>
            <div>
              <Form onSubmit={this.modalFormSubmit}>
                <FormGroup>
                  <Label>Email address</Label>
                  <Input type="email" onChange={(e) => this.setState({ forgotPasswordEmailAddress: e.target.value })} required />
                </FormGroup>
                <FormGroup>
                  <Button color="primary">Change Password</Button>
                </FormGroup>
              </Form>
            </div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => dispatch(setUser(user))
  }
}

export default connect(null, mapDispatchToProps)(Login);