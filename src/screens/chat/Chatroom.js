import React, { Component } from 'react';
import { Form, Input, Button } from 'reactstrap';

import { getChatMessages, addMessageToChatroom } from '../../config/firebase';

import ChatMessage from '../../components/ChatMessage';

const headerStyle = {
  flex: '1',
  backgroundColor: '#474FF6',
  textAlign: 'center',
  paddingTop: '10px',
  color: 'white'
};

const messageDivStyle = {
  flex: '11',
  padding: '15px',
  overflowY: 'auto'
};

const mainDiv = {
  display: 'flex',
  flexDirection: 'column',
  border: 'medium solid #474FF6',
  height: '600px',
  backgroundColor: '#D3D5DC'
};

class Chatroom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    }
  }

  componentDidMount() {
    const { chatRoomId } = this.props;
    getChatMessages(chatRoomId, (querySnapshot) => this.onMessageUpdate(querySnapshot));
  }

  onMessageUpdate = (querySnapshot) => {
    var messages = [];
    querySnapshot.forEach(function (doc) {
      messages.push(doc.data());
    });
    this.setState({ messages });
  }

  sendMessage = (event) => {
    event.preventDefault();
    this.sendMessageToFirebase();
  }

  sendMessageToFirebase = async () => {
    const { message } = this.state;
    const { loggedInUserId, chatRoomId } = this.props;
    addMessageToChatroom(chatRoomId, loggedInUserId, message);
    this.setState({ message: "" });
  }

  render() {
    const { messages, message } = this.state;
    const { loggedInUserId } = this.props;

    return <div>
      <div style={mainDiv}>
        <div style={headerStyle}>
          <h4>Chats</h4>
        </div>
        <div style={messageDivStyle}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {messages.map(message =>
              <ChatMessage key={message.createdAt} message={message} loggedInUserId={loggedInUserId}></ChatMessage>
            )}
          </div>
        </div>
        <div style={{ flex: '1' }}>
          <Form style={{ padding: '5px' }} inline onSubmit={this.sendMessage}>
            <Input style={{ flex: '8' }} value={message} placeholder="Type a message..." onChange={(e) => this.setState({ message: e.target.value })} />
            <Button style={{ flex: '1', marginRight: '16px', marginLeft: '8px' }} color="primary">Send</Button>
          </Form>
        </div>
      </div>
    </div>
  }
}

export default Chatroom;