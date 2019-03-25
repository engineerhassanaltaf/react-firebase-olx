import React, { Component } from 'react';

import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
import AdImages from './AdImages';

class Ad extends Component {
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
    const { adId, category, createdAt, description, images, price, title } = this.props;
    return (
      <div style={{ cursor: 'pointer' }} onClick={() => { window.location = `/ad/${adId}` }}>
        <Card>
          <AdImages imageHeight='325px' images={images}></AdImages>
          <CardBody>
            <CardTitle style={{ fontSize: '25px' }} >{title}</CardTitle>
            <CardText>{description || 'No Description'}</CardText>
            <CardText>{`Category: ${category || 'No Category'}`}</CardText>
            <CardText className="text-right">{`${price} PKR`}</CardText>
            <CardText>
              <small className="text-muted">{`Posted at: ${this.convertTime(createdAt)}`}</small>
            </CardText>
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default Ad