import React, { Component } from 'react';
import { Button } from 'reactstrap';

import { getChatRoomId, createChatRoom } from '../../config/firebase';

import ChatList from './ChatList';
import Chatroom from './Chatroom';

class ChatManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatRoomId: null
    }
  }

  componentDidMount() {
    const { adId, loggedInUserId } = this.props;
    this.getChatRoomId(adId, loggedInUserId);
  }

  async getChatRoomId(adId, loggedInUserId) {
    const chatRoomId = await getChatRoomId(adId, loggedInUserId);
    this.setState({ chatRoomId });
  }

  async createChatRoom() {
    const { adId, loggedInUserId } = this.props;
    const chatRoomId = await createChatRoom(adId, loggedInUserId);
    this.setState({ chatRoomId });
  }

  renderChatList(adId) {
    return <div>
      <ChatList updateChatroomId={(roomId) => this.updateChatroomId(roomId)} adId={adId}></ChatList>
    </div>
  }

  renderBackToChatlistButton() {
    return <Button onClick={() => this.setState({ chatRoomId: null })}>Go back to Chatlist</Button>
  }

  updateChatroomId(roomId) {
    this.setState({ chatRoomId: roomId });
  }

  render() {
    const { adId, adPostedByUserId, loggedInUserId } = this.props;
    const { chatRoomId } = this.state;
    return (
      // <div>
      //   {/* if the user who posted the ad is logged in and see his own ad and he has selected any chatroom */}
      //   {adPostedByUserId === loggedInUserId && chatRoomId && <Button onClick={() => this.setState({ chatRoomId: null })}>Go back to Chatlist</Button>}
      //   {/* if the user who posted the ad is logged in and see his own ad and he has not selected any chatroom */}
      //   {adPostedByUserId === loggedInUserId && !chatRoomId ?
      //     this.renderChatList(adId) :
      //     chatRoomId ?
      //       <Chatroom chatRoomId={chatRoomId} loggedInUserId={loggedInUserId}></Chatroom> :
      //       <Button onClick={() => this.createChatRoom()}>Start chatting</Button>}
      // </div>



      <div>
        {adPostedByUserId === loggedInUserId && chatRoomId && this.renderBackToChatlistButton()}
        {adPostedByUserId === loggedInUserId && !chatRoomId && this.renderChatList(adId)}
        {adPostedByUserId !== loggedInUserId && chatRoomId && <Chatroom chatRoomId={chatRoomId} loggedInUserId={loggedInUserId}></Chatroom>}
        {adPostedByUserId !== loggedInUserId && !chatRoomId && <Button onClick={() => this.createChatRoom()}>Chat with Seller</Button>}
      </div>
    )
  }
}

export default ChatManager;