import { StackNavigator } from "react-navigation";
import LogInScreen from "../screens/LogInScreen";
import SignUpScreen from "../screens/SignUpScreen";

const LoggedOutNavigation = StackNavigator({
  LogIn: {
    screen: LogInScreen,
    navigationOptions: {
      header: null
    }
  },
  SignUp: {
    screen: SignUpScreen,
    navigationOptions: {
      header: null
    }
  }
});

export default LoggedOutNavigation;
