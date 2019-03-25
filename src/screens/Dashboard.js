import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';

import AdsList from './ad/AdsList';
import AdFilters from './ad/AdFilters';
import InsertAds from './ad/InsertAds';

import { updateAdList } from '../store/actions/adAction';
import { getAds } from '../config/firebase';

class Dashboard extends Component {
  DEFAULT_AD_LIMIT = 10;

  constructor(props) {
    super(props);

    this.state = {
      adsLimit: this.DEFAULT_AD_LIMIT,
      showAlertMessage: false,
      loadingState: false
    };
  }

  componentDidMount() {
    this.loadAds();

    this.refs.iScroll.addEventListener("scroll", () => {
      const { scrollTop, clientHeight, scrollHeight } = this.refs.iScroll;

      if (scrollTop + clientHeight >= scrollHeight) {
        this.loadAds();
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.ifFilterCriteriaChanged(prevProps.filterParams, this.props.filterParams)) {
      this.setState({ adsLimit: this.DEFAULT_AD_LIMIT, loadingState: false });
      this.loadAds();
    }
  }

  onDismiss() {
    this.setState({
      showAlertMessage: false
    });
  }

  async loadAds() {
    const { loadingState, adsLimit } = this.state;
    const { filterParams } = this.props;

    if (loadingState) {
      return;
    }
    this.setState({ loadingState: true });

    const ads = await getAds(filterParams, adsLimit);
    this.props.updateAdList(ads);

    this.setState({ adsLimit: adsLimit + this.DEFAULT_AD_LIMIT, loadingState: false });
  }

  ifFilterCriteriaChanged(prevFilterParams, newFilterParams) {
    const {
      title: prevTitle,
      category: prevCategory,
      location: prevLocation,
      maxPrice: prevMaxPrice,
      minPrice: prevMinPrice,
      sortByValue: prevSortByValue
    } = prevFilterParams;
    const {
      title,
      category,
      location,
      maxPrice,
      minPrice,
      sortByValue
    } = newFilterParams;

    if (prevTitle === title &&
      prevCategory === category &&
      prevLocation === location &&
      prevMaxPrice === maxPrice &&
      prevMinPrice === minPrice &&
      sortByValue === prevSortByValue) {
      return false;
    }
    return true;
  }

  render() {
    const { statusMessage, showAlertMessage } = this.state;
    return (
      <div>
        <Alert color="primary" isOpen={showAlertMessage} toggle={() => this.onDismiss()}>
          {statusMessage}
        </Alert>
        {this.props.user && this.props.firebaseUserId && <InsertAds></InsertAds>}
        <AdFilters></AdFilters>
        <div ref="iScroll" style={{ height: "500px", overflowY: "auto", overflowX: 'hidden' }}>
          <AdsList></AdsList>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    filterParams: state.adReducer.filterParams,
    user: state.userReducer.user,
    firebaseUserId: state.userReducer.firebaseUserId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateAdList: (ads) => dispatch(updateAdList(ads))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)