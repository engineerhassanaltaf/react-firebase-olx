import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Container } from 'reactstrap';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Register from './screens/user/Register';
import Login from './screens/user/Login';
import Dashboard from './screens/Dashboard';
import Profile from './screens/user/Profile';
import Header from './screens/Header';
import AdLayout from './screens/ad/AdLayout';

import { store, persistor } from './store/store';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Router>
            <div>
              <Header></Header>
              <Container>
                <Route path="/" exact component={Dashboard} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/profile" component={Profile} />
                <Route path="/ad/:adId" component={AdLayout} />
              </Container>
            </div>
          </Router>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;