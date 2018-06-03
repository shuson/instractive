import React from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { withNavigation } from "react-navigation";
import {Auth } from 'aws-amplify'

const { width, height } = Dimensions.get("window");

class SignUpScreen extends React.Component {
  state = {
    username: '',
    password: '',
    email: '',
    confirmationCode: '',
    isStep2: false
  }
  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }
  signUp() {
    Auth.signUp({
      username: this.state.username,
      password: this.state.password,
      attributes: {
        email: this.state.email
      }
    })
    .then(() => {
      this.setState({
        ...this.state,
        isStep2: true
      })
      console.log('successful sign up!')
    })
    .catch(err => console.log('error signing up!: ', err))
  }

  confirmSignUp() {
    const {username, email} = this.state
    Auth.confirmSignUp(this.state.username, this.state.confirmationCode)
    .then(() => {
      console.log('successful confirm sign up!')
      this.props.postSignup(username, email)
      this.props.navigation.goBack()
    })
    .catch(err => console.log('error confirming signing up!: ', err))
  }
  render() {
    const {isStep2 } = this.state
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Registration</Text>
        </View>
        <View style={styles.content}>
          <TextInput
            onChangeText={value => this.onChangeText('username', value)}
            style={styles.input}
            placeholder='username'
            autoCapitalize='none'
          />
          <TextInput
            onChangeText={value => this.onChangeText('password', value)}
            style={styles.input}
            secureTextEntry={true}
            placeholder='password'
          />
          <TextInput
            onChangeText={value => this.onChangeText('email', value)}
            style={styles.input}
            placeholder='email'
            autoCapitalize='none'
          />
          <Button pointerEvent={isStep2? 'none' : 'auto'} title="Sign Up" onPress={this.signUp.bind(this)} />
          <View style={{display: isStep2? 'flex' : 'none'}} >
            <Text> Please find the verification code from Email </Text>
            <TextInput
              onChangeText={value => this.onChangeText('confirmationCode', value)}
              style={styles.input}
              placeholder='confirmation Code'
            />
            <Button title="Confirm Sign Up" onPress={this.confirmSignUp.bind(this)} />
          </View>
          <Button title="Cancel" onPress={() => this.props.navigation.goBack()} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    backgroundColor: "#E6D5B4",
    alignItems: "center",
    width
  },
  title: {
    marginTop: 100,
    fontSize: 20,
    color: "#2196F3",
    fontFamily: 'Cochin'
  },
  input: {
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
    margin: 10
  },
  content: {
    flex: 4,
    backgroundColor: "white",
    paddingTop: 50,
    justifyContent: "flex-start"
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});

export default withNavigation(SignUpScreen);
