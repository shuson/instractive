import React, { Component } from "react";
import {
    View,
    Image,
    Dimensions 
} from 'react-native';
import PropTypes from "prop-types";

const { width, height } = Dimensions.get("window");

class Container extends Component {
    static propTypes = {
        file: PropTypes.string
    };

    render() {
        const { navigation: { state: { params: { file } } } } = this.props;
        return (<View style={{alignItems: 'center', flex: 1}}>
            <Image
                source={{ uri: file }}
                style={{ width, height: 400}}
            />
        </View>
        );
    }
}

export default Container;