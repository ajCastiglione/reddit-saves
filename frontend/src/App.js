import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Switch, Route, Redirect } from "react-router-dom";

// Local Modules
import Login from "./components/Login";

class App extends Component {
  state = {
    token: localStorage.rsaves_token ? localStorage.rsaves_token : "",
    authenticated: localStorage.rsaves_token ? true : false
  };

  setToken = token => {
    this.setState({ token, authenticated: true });
  };

  isLoggedIn = () => {
    if (
      this.state.authenticated !== false &&
      !window.location.href.includes("/login")
    ) {
      return false;
    }
  };

  render() {
    return (
      <main className="App">
        {!this.isLoggedIn() ? <Redirect to="/login" /> : null}
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/">
              <h2>Will show saved content</h2>
            </Route>
          </Switch>
        </header>
      </main>
    );
  }
}

export default App;
