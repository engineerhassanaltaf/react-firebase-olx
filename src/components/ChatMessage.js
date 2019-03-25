import React, { Component } from 'react';

const defaultStyle = {
  padding: '3px',
  borderRadius: '15px',
  marginBottom: '20px',
  width: '350px'
};

const rightMessage = {
  textAlign: 'right',
  alignSelf: 'flex-end',
  paddingRight: '10px',
  color: 'white',
  backgroundColor: '#5260B1'
};

const leftMessage = {
  paddingLeft: '10px',
  color: 'black',
  backgroundColor: 'white'
};

class ChatMessage extends Component {
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

  render() {
    const { message, loggedInUserId } = this.props;
    const style = message.userId === loggedInUserId ? rightMessage : leftMessage;

    return <div style={{ ...defaultStyle, ...style }}>
      <h5>{message.text}</h5>
      <h6 style={{ fontSize: 'small' }}>{this.convertTime(message.createdAt)}</h6>
    </div>
  }
}

export default ChatMessage;