import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { connect } from 'react-redux';

import Ad from '../../components/Ad';

class AdsList extends Component {
  constructor() {
    super();
    this.state = {
      ads: []
    }
  }

  renderAdComponent = (ad) => {
    return (
      <Ad
        adId={ad.adId}
        category={ad.category}
        createdAt={ad.createdAt}
        description={ad.description}
        images={ad.images}
        price={ad.price}
        title={ad.title}>
      </Ad>
    )
  }

  renderAds = () => {
    let rows = []
    const { ads } = this.props;
    let rowCount = Math.floor(ads.length / 3);
    let adCount = 0;

    for (let i = 1; i <= rowCount; i++) {
      let cols = []
      for (let j = 1; j <= 3; j++) {
        cols.push(
          <Col key={i * j} style={{ marginBottom: '10px' }} className="col-4">
            {this.renderAdComponent(ads[adCount++])}
          </Col>)
      }
      rows.push(<Row key={i}>{cols}</Row>)
    }

    // if there are remaining ads
    if (adCount < ads.length) {
      let remainingCols = []
      while (adCount < ads.length) {
        remainingCols.push(
          <Col key={adCount * 506} style={{ marginBottom: '10px' }} className="col-4">
            {this.renderAdComponent(ads[adCount++])}
          </Col>
        )
      }
      rows.push(<Row key={505}>{remainingCols}</Row>)
    }

    return rows
  }

  render() {
    return (
      <div>
        {this.renderAds()}
      </div >
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ads: state.adReducer.ads
  }
}

export default connect(mapStateToProps)(AdsList);