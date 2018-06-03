import { connect } from "react-redux";
import Container from "./container";
import { actionCreators as userActions } from "../../redux/modules/user";

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    postSignup: (username, email) => {
      return dispatch(userActions.postSignup(username, email));
    }
  };
};

export default connect(null, mapDispatchToProps)(Container);
