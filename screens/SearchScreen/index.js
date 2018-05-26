import { connect } from "react-redux";
import Container from "./container";
import { actionCreators as userActions } from "../../redux/modules/user";

const mapStateToProps = (state, ownProps) => {
  const { user: { search } } = state;
  return {
    search
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getSearch: (text) => {
      dispatch(userActions.getSearch(text));
    },
    clearSearch: () => {
      dispatch(userActions.clearSearch())
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Container);
