// Imports

import { API_URL, FB_APP_ID } from "../../constants";
import { AsyncStorage } from "react-native";
import { Permissions, Notifications, Facebook } from "expo";
import {Auth } from 'aws-amplify'

// Actions

const LOG_IN = "LOG_IN";
const LOG_IN_FAIL = "LOG_IN_FAIL"
const LOG_OUT = "LOG_OUT";
const SET_AUTH = "SET_AUTH";
const SET_PROFILE = "SET_PROFILE"
const SET_NOTIFICATIONS = "SET_NOTIFICATIONS";
const SET_SEARCH = "SET_SEARCH"

// Action Creators

function setLogIn(token) {
  //console.log('Yahaha token ', token)
  return {
    type: LOG_IN,
    token
  };
}
function setLogInFail(error) {
  return {
    type: LOG_IN_FAIL,
    error
  };
}

function setAuth(auth) {
  return {
    type: SET_AUTH,
    auth
  };
}

function setProfile(profile) {
  return {
    type: SET_PROFILE,
    profile
  };
}

function logOut() {
  return { type: LOG_OUT };
}

function setNotifications(notifications) {
  return {
    type: SET_NOTIFICATIONS,
    notifications
  };
}

function setSearch(search) {
  return {
    type: "SET_SEARCH",
    search
  }
}

// API Actions
function login(username, password) {
  return dispatch => {
    return Auth.signIn(username, password)
      .then(auth => {
        if (auth) {
          Auth.currentSession().then(session => {
            dispatch(setLogIn(session.idToken.jwtToken))
            dispatch(getOwnProfile())
          })

          return true;
        } else {
          return false;
        }
      }).catch(err => {
        dispatch(setLogInFail(err.message))
        console.log("login failed ", err)
        return false
      });
  };
}

function postSignup(username, email) {
  return (dispatch) => {
    fetch(`https://lehesr3ekg.execute-api.ap-southeast-1.amazonaws.com/dev1/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        email: email
      })
    })
      .then(response => {
        if(response.status == 200)
          return true
        else 
          return false
      }).catch(e => {
        console.log(e)
      });
  };
}

function facebookLogin() {
  return async dispatch => {
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(
      FB_APP_ID,
      {
        permissions: ["public_profile", "email"]
      }
    );
    if (type === "success") {
      return fetch(`${API_URL}/users/login/facebook/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          access_token: token
        })
      })
        .then(response => response.json())
        .then(json => {
          if (json.user && json.token) {
            dispatch(setLogIn(json.token));
            dispatch(setAuth(json.user));
            return true;
          } else {
            return false;
          }
        });
    }
  };
}

function getNotifications() {
  return (dispatch, getState) => {
    const { user: { token } } = getState();
    fetch(`${API_URL}/notifications/`, {
      headers: {
        Authorization: `JWT ${token}`
      }
    })
      .then(response => {
        if (response.status === 401) {
          dispatch(logOut());
        } else {
          return response.json();
        }
      })
      .then(json => dispatch(setNotifications(json)));
  };
}

function getOwnProfile() {
  return (dispatch, getState) => {
    const { user: { token } } = getState();
    fetch(`${API_URL}/me/`, {
      method: "GET",
      headers: {
        Authorization: `${token}`
      }
    })
      .then(response => {
        if (response.status === 401) {
          dispatch(logOut());
        } else {
          return response.json();
        }
      })
      .then(json => {
        dispatch(setProfile(json))
      }).catch(e => {
        console.log(e)
      });
  };
}

function getProfile(username) {
  return (dispatch, getState) => {
    const { user: { token } } = getState();
    return fetch(`${API_URL}/users/${username}/`, {
      headers: {
        Authorization: `${token}`
      }
    })
      .then(response => {
        if (response.status === 401) {
          dispatch(logOut());
        } else {
          return response.json();
        }
      })
      .then(json => {
        return json
      }).catch(e => {
        console.log(e)
      });
  };
}

function getSearch(text) {
  return (dispatch, getState) => {
    const { user: { token } } = getState();
    
    fetch(`${API_URL}/users/search/${text}`, {
      method: "GET",
      headers: {
        Authorization: `${token}`,
        'Content-type': 'application/json'
      }
    })
      .then(response => {
        if (response.status === 401) {
          dispatch(logOut());
        } else {
          return response.json();
        }
      })
      .then(json => {
        dispatch(setSearch(json))
      }).catch(error => console.log(error));
  };
}

function clearSearch() {
  return (dispatch, getState) => {
    const {user: { search}} = getState()

    dispatch(setSearch([]))
  }
}

function followUser(username) {
  return (dispatch, getState) => {
    const { user: { token } } = getState();
    return fetch(`${API_URL}/users/${username}/follow/`, {
      method: "POST",
      headers: {
        Authorization: `${token}`
      }
    }).then(response => {
      if (response.status === 401) {
        dispatch(logOut());
      } else if (response.ok) {
        dispatch(getProfile(username))
        return true;
      } else if (!response.ok) {
        return false;
      }
    }).catch(err => console.log(err));;
  };
}

function unfollowUser(username) {
  return (dispatch, getState) => {
    const { user: { token } } = getState();
    return fetch(`${API_URL}/users/${username}/unfollow/`, {
      method: "POST",
      headers: {
        Authorization: `${token}`
      }
    }).then(response => {
      if (response.status === 401) {
        dispatch(logOut());
      } else if (response.ok) {
        dispatch(getProfile(username))
        return true;
      } else if (!response.ok) {
        return false;
      }
    }).catch(err => console.log(err));
  };
}

function registerForPush() {
  return async (dispatch, getState) => {
    const { user: { token } } = getState();
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus === "denied") {
      return;
    }

    let pushToken = await Notifications.getExpoPushTokenAsync();

    return fetch(`${API_URL}/users/push/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`
      },
      body: JSON.stringify({
        token: pushToken
      })
    });
  };
}

// Initial State

const initialState = {
  isLoggedIn: false
};

// Reducer

function reducer(state = initialState, action) {
  switch (action.type) {
    case LOG_IN:
      return applyLogIn(state, action);
    case LOG_IN_FAIL:
      return applyLogInFail(state, action);
    case LOG_OUT:
      return applyLogOut(state, action);
    case SET_AUTH:
      return applySetAuth(state, action);
    case SET_PROFILE:
      return applySetProfile(state, action)
    case SET_SEARCH:
      return applySetSearch(state, action)
    case SET_NOTIFICATIONS:
      return applySetNotifications(state, action);
    default:
      return state;
  }
}

// Reducer Functions

function applyLogIn(state, action) {
  const { token } = action;
  console.log(" token ", token)
  return {
    ...state,
    isLoggedIn: true,
    token
  };
}

function applyLogInFail(state, action) {
  const { error } = action;
  return {
    ...state,
    isLoggedIn: false,
    error
  };
} 

function applyLogOut(state, action) {
  AsyncStorage.clear();
  return {
    ...state,
    isLoggedIn: false,
    token: "",
    auth: {},
    profile: {},
    search: []
    
  };
}

function applySetAuth(state, action) {
  const { auth } = action;
  return {
    ...state,
    auth
  };
}

function applySetProfile(state, action) {
  const { profile } = action
  return {
    ...state,
    profile
  }
}

function applySetSearch(state, action) {
  const { search } = action
  return {
    ...state,
    search
  }
}

function applySetNotifications(state, action) {
  const { notifications } = action;
  return {
    ...state,
    notifications
  };
}

// Exports

const actionCreators = {
  login,
  postSignup,
  facebookLogin,
  logOut,
  getNotifications,
  getOwnProfile,
  followUser,
  unfollowUser,
  getProfile,
  registerForPush,
  getSearch,
  clearSearch
};

export { actionCreators };
// Default Reducer Export

export default reducer;
