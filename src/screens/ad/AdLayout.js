import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getAdDetails } from '../../config/firebase';

import AdDetails from './AdDetails';
import Map from '../map/Map';
import ChatManager from '../chat/ChatManager';

class AdLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adDetails: {}
    };
  }

  componentDidMount() {
    this.getAdDetails(this.props.match.params.adId)
  }

  async getAdDetails(adId) {
    const adDetails = await getAdDetails(adId);
    this.setState({ adDetails });
  }

  render() {
    const { adDetails } = this.state;
    const { location, adId, postedByUserId, postedByUserName } = adDetails;
    const { firebaseUserId } = this.props;
    return (
      <div>
        <Row style={{ marginTop: '15px' }}>
          <Col>
            <AdDetails adDetails={adDetails}></AdDetails>
          </Col>
          <Col>
            {adId && postedByUserId && firebaseUserId && <ChatManager adId={adId} adPostedByUserId={postedByUserId} loggedInUserId={firebaseUserId}></ChatManager>}
          </Col>
        </Row>
        <Row>
          <Col className="col-sm-12">
            {postedByUserName && <h5>{`Location of ${postedByUserName}`} </h5>}
            {location && <Map location={location}></Map>}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    firebaseUserId: state.userReducer.firebaseUserId
  }
}

export default withRouter(connect(mapStateToProps)(AdLayout));