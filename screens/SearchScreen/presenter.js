import React from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Dimensions
} from "react-native";
import FadeIn from "react-native-fade-in-image";
import SquarePhoto from "../../components/SquarePhoto";

const { width, height } = Dimensions.get("window");

const SearchScreen = props => (
  <ScrollView
    refreshControl={
      <RefreshControl
        refreshing={props.isFetching}
        onRefresh={props.refresh}
        tintColor={"black"}
      />
    }
  >
    <View style={styles.container}>
      {props.search.length === 0 && props.searchingBy.length > 1 ? (
        <Text style={styles.notFound}>
          No Record found for {props.searchingBy}
        </Text>
      ) : (
        props.search.map(user => (
          <View style={styles.header} key={user.username}>
            <TouchableOpacity
                onPressOut={() =>
                  props.navigation.navigate("ProfileDetail", {
                    user
                  })
                }
              >
              <FadeIn>
                <Image
                  source={
                    user.profile_image
                      ? {
                          uri: user.profile_image
                        }
                      : require("../../assets/images/noPhoto.jpg")
                  }
                  style={styles.avatar}
                />
              </FadeIn>
              <View>
                <Text style={styles.author}>{user.username}</Text>
              </View>
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  notFound: {
    color: "#bbb",
    fontWeight: "600",
    alignSelf: "center",
    textAlign: "center",
    width,
    marginTop: 20
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignItems: "center",
    borderBottomColor: "#bbb",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flex: 1,
    width
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginRight: 10
  },
  author: {
    fontWeight: "600",
    marginBottom: 3,
    fontSize: 15
  },
});

SearchScreen.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  refresh: PropTypes.func.isRequired,
  search: PropTypes.array.isRequired
};

export default SearchScreen;
