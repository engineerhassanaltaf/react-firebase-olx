import React, { Component } from 'react';
import AdImages from '../../components/AdImages';

class AdDetails extends Component {
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
    const { images, title, description, price, category, createdAt, postedByUserName } = this.props.adDetails;

    return <div>
      {images && <AdImages imageHeight='300px' images={images}></AdImages>}
      {title && <h2 style={{ marginTop: '20px' }}>{title}</h2>}
      {description && <h4 style={{ marginTop: '10px' }}>{description}</h4>}
      {price && <h5 style={{ marginTop: '10px' }}>{`${price} PKR`}</h5>}
      {category && <h5 style={{ marginTop: '10px' }}>{`Category: ${category}`}</h5>}
      {createdAt && <h6 style={{ marginTop: '10px' }}>{`Posted at: ${this.convertTime(createdAt)}`}</h6>}
      {postedByUserName && <h6 style={{ marginTop: '10px' }}>{`Posted by: ${postedByUserName}`}</h6>}
    </div>
  }
}

export default AdDetails;