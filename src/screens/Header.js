import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { setUser } from '../store/actions/userAction'
import { changePassword, logOutUser } from '../config/firebase'

import {
  Button, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Form, FormGroup, Input, Label, Col, Modal, ModalHeader, ModalBody
} from 'reactstrap';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      showModal: false
    };
  }

  async changePassword() {
    const { newPassword } = this.state
    try {
      document.getElementById("loader").removeAttribute("hidden");
      await changePassword(newPassword);
      document.getElementById("loader").style.display = "none";
    }
    catch (err) {
      console.log(err);
    }
  }

  modalFormSubmit = (e) => {
    e.preventDefault();
    this.changePassword()
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  toggleModal() {
    this.setState(prevState => ({
      showModal: !prevState.showModal
    }));
  }

  renderActionButtons() {
    return (
      <div>
        <Button color="success" onClick={() => this.props.history.push('/login')}>Sign In</Button>
        <Button color="info" style={{ marginLeft: '10px' }} onClick={() => this.props.history.push('/register')}>Sign Up</Button>
      </div>
    );
  }

  renderUserDropdown() {
    return (
      <UncontrolledDropdown nav inNavbar>
        <DropdownToggle nav caret>
          {this.props.userName}
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem onClick={() => this.props.history.push('/profile')}>
            Edit Profile
          </DropdownItem>
          <DropdownItem onClick={() => this.toggleModal()}>
            Change Password
          </DropdownItem>
          <DropdownItem>
            Delete Profile
          </DropdownItem>
          <DropdownItem onClick={() => {
            logOutUser();
            this.props.logout();
            this.props.history.push('/');
          }}>
            Logout
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    )
  }

  render() {
    const { showModal } = this.state;

    return (
      <div>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand style={{ color: 'white', cursor: 'pointer' }} onClick={() => this.props.history.push('/')}>Ads Lounge</NavbarBrand>
          <NavbarToggler onClick={() => this.toggle()} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {this.props.userName && this.props.firebaseUserId ? this.renderUserDropdown() : this.renderActionButtons()}
            </Nav>
          </Collapse>
        </Navbar>

        <Modal isOpen={showModal} toggle={() => this.toggleModal()} >
          <ModalHeader toggle={() => this.toggleModal()}>Change Password</ModalHeader>
          <ModalBody>
            <div>
              <Row>
                <Col>
                  <Form onSubmit={this.modalFormSubmit}>
                    <FormGroup>
                      <Label>New Password</Label>
                      <Input type="password" onChange={(e) => this.setState({ newPassword: e.target.value })} required />
                    </FormGroup>
                    <FormGroup>
                      <Button color="primary">
                        <div style={{ float: 'left', marginRight: '5px' }}>
                          <span hidden className="spinner-border spinner-border-sm" id="loader" role="status" aria-hidden="true"></span>
                        </div>
                        Change Password</Button>
                    </FormGroup>
                  </Form>
                </Col>
              </Row>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userName: state.userReducer.user ? state.userReducer.user.name : null,
    firebaseUserId: state.userReducer.firebaseUserId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(setUser(null))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));