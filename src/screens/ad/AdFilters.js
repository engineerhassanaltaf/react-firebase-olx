import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Form, FormGroup, Input, Label, Col, Button } from 'reactstrap';

import { getCategories, getLocations } from '../../config/firebase'
import { setAdFilters } from '../../store/actions/adAction'

class AdFilters extends Component {
  constructor() {
    super();
    this.state = {
      minPrice: '',
      maxPrice: '',
      title: '',
      sortByValue: '',
      categoryValue: '',
      locationValue: '',
      categories: [],
      locations: []
    }
  }

  async getCategories() {
    try {
      const response = await getCategories();
      response.unshift('All Categories');
      this.setState({
        categoryValue: response[0],
        categories: response
      });
    } catch (e) {
      this.setState({
        statusMessage: e,
        showAlertMessage: true
      });
    }
  }

  async getLocations() {
    try {
      const response = await getLocations();
      this.setState({
        locationValue: response[0].name,
        locations: response
      });
    } catch (e) {
      this.setState({
        statusMessage: e,
        showAlertMessage: true
      });
    }
  }

  search = (e) => {
    const { sortByValue, locationValue, categoryValue, title, minPrice, maxPrice } = this.state;
    e.preventDefault();
    this.props.setAdFilters({ sortByValue, location: locationValue, category: categoryValue, title, minPrice, maxPrice });
  }

  componentDidMount() {
    this.getCategories();
    this.getLocations();

    this.setState({
      sortByValue: this.props.sortByValues[0]
    })
  }

  render() {
    const { categories, locations } = this.state;
    const { sortByValues } = this.props;
    return (
      <div>
        <Row>
          <Col>
            <Form onSubmit={this.search}>
              <FormGroup>
                <Row style={{ marginTop: "20px" }}>
                  <Col className="col-md-3">
                    <Label>Browse by Location</Label>
                    <Input type="select" onChange={(e) => this.setState({ locationValue: e.target.value })}>
                      {
                        locations.map((item, index) => {
                          return <option key={index}>{item.name}</option>
                        })
                      }
                    </Input>
                  </Col>
                  <Col className="col-md-3">
                    <Label>Browse by Category</Label>
                    <Input type="select" onChange={(e) => this.setState({ categoryValue: e.target.value })}>
                      {
                        categories.map((category, index) => {
                          return <option key={index}>{category}</option>
                        })
                      }
                    </Input>
                  </Col>
                  <Col className="col-md-3">
                    <Label>Price</Label>
                    <Row>
                      <Col className="col-md-6">
                        <Input type="number" placeholder="Min" onChange={(e) => this.setState({ minPrice: e.target.value })} />
                      </Col>
                      <Col className="col-md-6">
                        <Input type="number" placeholder="Max" onChange={(e) => this.setState({ maxPrice: e.target.value })} />
                      </Col>
                    </Row>
                  </Col>
                  <Col className="col-md-3">
                    <Label>Sort by</Label>
                    <Input type="select" onChange={(e) => this.setState({ sortByValue: e.target.value })}>
                      {
                        sortByValues.map((item, index) => {
                          return <option key={index}>{item}</option>
                        })
                      }
                    </Input>
                  </Col>
                </Row>
                <Row style={{ marginTop: "15px" }}>
                  <Col className="col-md-11">
                    <Input placeholder="Search by Title..." onChange={(e) => this.setState({ title: e.target.value })} />
                  </Col>
                  <Col className="col-md-1">
                    <FormGroup>
                      <Button color="primary">
                        Search</Button>
                    </FormGroup>
                  </Col>
                </Row>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </div >
    )
  }
}

const mapStateToProps = (state) => {
  return {
    sortByValues: state.adReducer.sortByValues
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setAdFilters: (params) => dispatch(setAdFilters(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdFilters);