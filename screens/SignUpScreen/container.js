import React, { Component } from "react";
import PropTypes from "prop-types";
import { Alert } from "react-native";
import SignUpScreen from "./presenter";

class Container extends Component {
  state = {
    username: "",
    password: "",
    isSubmitting: false
  };
  static propTypes = {
    postSignup: PropTypes.func.isRequired
  };
  render() {
    return (
      <SignUpScreen
        {...this.props}
        {...this.state}
        changeUsername={this._changeUsername}
        changePassword={this._changePassword}
      />
    );
  }
  _changeUsername = text => {
    this.setState({ username: text });
  };
  _changePassword = text => {
    this.setState({ password: text });
  };
}

export default Container;
