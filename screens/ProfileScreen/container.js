import React, { Component } from "react";
import PropTypes from "prop-types";
import Profile from "../../components/Profile";

class Container extends Component {
  static propTypes = {
    auth: PropTypes.object,
    profile: PropTypes.object.isRequired,
    getOwnProfile: PropTypes.func.isRequired
  };

  componentDidMount = () => {
    const {getOwnProfile } = this.props
    getOwnProfile()
  }

  render() {
    const { auth, profile, getOwnProfile } = this.props;
    return <Profile profileObject={profile} refresh={getOwnProfile} />;
  }
}

export default Container;
