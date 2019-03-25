import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

import { getLocationDetails } from '../../config/firebase';

const MyMapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={props.location.zoom}
    defaultCenter={{ lat: props.location.latitude, lng: props.location.longitude }}
    center={{ lat: props.location.latitude, lng: props.location.longitude }}
  >
    {props.isMarkerShown && <Marker position={{ lat: props.location.latitude, lng: props.location.longitude }} />}
  </GoogleMap>
))

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationDetails: null
    }
  }
  componentDidMount() {
    this.getLocaionDetails(this.props.location)
  }

  async getLocaionDetails(location) {
    const locationDetails = await getLocationDetails(location);
    this.setState({ locationDetails });
  }

  render() {
    const { locationDetails } = this.state;
    return <div>
      {locationDetails && <MyMapComponent
        location={locationDetails}
        isMarkerShown
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: '400px', width: '100%' }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />}
    </div>
  }
}

export default Map;