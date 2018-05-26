import React, { Component } from "react";
import PropTypes from "prop-types";
import { Alert } from "react-native";
import SearchScreen from "./presenter";
import SearchBar from "../../components/SearchBar";

class Container extends Component {
  constructor(props) {
    super(props)

    const { clearSearch } = props
    clearSearch()

    this.state = {
      searchingBy: "",
      isFetching: false
    };
  }

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      headerTitle: <SearchBar submit={text => params.submitSearch(text)} />
    };
  };
  static propTypes = {
    getSearch: PropTypes.func.isRequired,
    clearSearch: PropTypes.func,
    search: PropTypes.array
  };
  static defaultProps = {
    search: []
  };

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({
      submitSearch: this._submitSearch
    });
  }
  componentWillReceiveProps = nextProps => {
    if (nextProps.search) {
      this.setState({
        isFetching: false
      });
    }
  };

  render() {
    return (
      <SearchScreen {...this.state} {...this.props} refresh={this._refresh} />
    );
  }
  _submitSearch = text => {
    const { searchingBy } = this.state;
    const { getSearch, clearSearch } = this.props;
    this.setState({
      searchingBy: text,
      isFetching: true
    });
    if (text === "") {
      this.setState({ ...this.state, isSubmitting: false });
      Alert.alert("Key in some text, try again please");
      
      clearSearch()
    } else {
      getSearch(text);
    }
    
  };
  _refresh = () => {
    const { searchingBy } = this.state;
    const { getEmptySearch, searchHashtag } = this.props;
    if (searchingBy === "") {
      Alert.alert("Key in some text, try again please");
      this.setState({ ...this.state, isSubmitting: false });
    } else {
      getSearch(searchingBy);
    }
  };
}
export default Container;
