import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';

import { getChatRoomDetails } from '../../config/firebase';

class ChatList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatrooms: []
    }
  }

  convertTime = (UNIX_timestamp) => {
    var a = new Date(UNIX_timestamp);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = `${date} ${month} ${year} ${hour}:${min}:${sec}`;
    return time;
  }

  componentDidMount() {
    this.getChatroomDetails();
  }

  async getChatroomDetails() {
    const { adId } = this.props;
    try {
      const chatrooms = await getChatRoomDetails(adId);
      this.setState({ chatrooms: chatrooms });
    } catch (err) {
      console.log(err)
    }
  }

  goToChatRoom(chatroomId) {
    this.props.updateChatroomId(chatroomId);
  }

  render() {
    const { chatrooms } = this.state;
    return <div>
      <div style={{ position: 'relative', border: 'medium solid #474FF6', overflowY: 'auto', height: '600px', backgroundColor: '#D3D5DC' }}>
        <div style={{ height: '50px', backgroundColor: '#474FF6', textAlign: 'center', paddingTop: '10px' }}>
          <h4 style={{ color: 'white' }}>Chat List</h4>
        </div>
        <div>
          <ListGroup>
            {chatrooms.map((chatroom, index) => {
              return <div onClick={() => this.goToChatRoom(chatroom.id)} key={index} style={{ cursor: 'pointer' }}>
                <ListGroupItem action>
                  <div>
                    <h4>{chatroom.viewerUserName}</h4>
                    <h6>{chatroom.lastMessage}</h6>
                    <h6>{this.convertTime(chatroom.lastMessageSentAt)}</h6>
                  </div>
                </ListGroupItem>
              </div>
            })}
          </ListGroup>
        </div>
      </div>
    </div>
  }
}

export default ChatList;