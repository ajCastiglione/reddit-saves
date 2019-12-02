import React, { Component } from "react";
import { CLIENTID, REDIRECTURL } from "../config/config";

export default class Login extends Component {
  componentDidMount() {
    this.receivedToken();
  }

  receivedToken = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("code");
    if (token) return token;
  };

  render() {
    const link = `https://www.reddit.com/api/v1/authorize?client_id=${CLIENTID}&response_type=code&state=RANDOM_STRING&redirect_uri=${REDIRECTURL}&duration=permanent&scope=identity history save`;

    return (
      <section className="login">
        <h1 className="component-title">Please sign in with Reddit:</h1>
        <a className="App-link" href={link} rel="noopener noreferrer">
          login
        </a>
      </section>
    );
  }
}
