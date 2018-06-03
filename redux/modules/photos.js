// Imports

import { API_URL } from "../../constants";
import { actionCreators as userActions } from "./user";
import uuidv1 from "uuid/v1";

import { RNS3 } from 'react-native-aws3';

const s3Options = {
  keyPrefix: '',
  bucket: 'photobook-cloud-ca',
  region: 'us-east-1',
  accessKey: 'AKIAJC5CESLM6MVHXTRA',
  secretKey: 'woeLyQ1IjGUxX+JHvMd9jHD8f8G/PDnlb+JadF1f',
  successActionStatus: 201
};

const DUMMY_API = "http://private-c70ca1-instractiveapp.apiary-mock.com"
const PHOTO_URL = "https://0unwlsyfig.execute-api.ap-southeast-1.amazonaws.com/dev1"
// Actions

const SET_FEED = "SET_FEED";
const SET_SEARCH = "SET_SEARCH";

// Action Creators

function setFeed(feed) {
  return {
    type: SET_FEED,
    feed
  };
}

function setSearch(search) {
  return { type: SET_SEARCH, search };
}

// API Actions

function getFeed() {
  return (dispatch, getState) => {
    const { user: { token, profile: {username } } } = getState();
    fetch(`${PHOTO_URL}/images/`, {
      headers: {
        "Authorization": `${token}`,
        "username": username
      }
    })
      .then(response => {
        if (response.status === 401) {
          dispatch(userActions.logOut());
        } else {
          return response.json();
        }
      })
      .then(json => {
        dispatch(setFeed(json))
      })
      .catch(err => console.log(err));
  };
}

function getSearch() {
  return (dispatch, getState) => {
    const { user: { token } } = getState();
    fetch(`${DUMMY_API}/images/search/`, {
      headers: {
        Authorization: `JWT ${token}`,
        "username": username
      }
    })
      .then(response => {
        if (response.status === 401) {
          dispatch(userActions.logOut());
        } else {
          return response.json();
        }
      })
      .then(json => dispatch(setSearch(json)));
  };
}

function searchByHashtag(hashtag) {
  return (dispatch, getState) => {
    const { user: { token } } = getState();
    fetch(`${DUMMY_API}/images/search/?hashtags=${hashtag}`, {
      headers: {
        Authorization: `JWT ${token}`
      }
    })
      .then(response => {
        if (response.status === 401) {
          dispatch(userActions.logOut());
        } else {
          return response.json();
        }
      })
      .then(json => dispatch(setSearch(json)));
  };
}

function likePhoto(photoId) {
  return (dispatch, getState) => {
    const { user: { token, profile: {username } } } = getState();
    return fetch(`${PHOTO_URL}/images/${photoId}/like/`, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "username": username
      }
    }).then(response => {
      if (response.status === 401) {
        dispatch(userActions.logOut());
      } else if (response.ok) {
        return true;
      } else {
        return false;
      }
    });
  };
}

function unlikePhoto(photoId) {
  return (dispatch, getState) => {
    const { user: { token, profile: {username } } } = getState();
    return fetch(`${PHOTO_URL}/images/${photoId}/dislike/`, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "username": username
      }
    }).then(response => {
      if (response.status === 401) {
        dispatch(userActions.logOut());
      } else if (response.ok) {
        return true;
      } else {
        return false;
      }
    });
  };
}

function uploadToS3(file, caption, location, tags) {
  const photo = {
    uri: file,
    name: `${uuidv1()}.jpg`,
    type: 'image/jpeg'
  };

  return (dispatch, getState) => {
    RNS3.put(photo, s3Options).then(async (response) => {

      if (response.status !== 201) {
        return false
      }
      const s3Resp = response.body.postResponse || {}
      console.log("*** s3 addr ***", s3Resp.location)

      const result = await dispatch(uploadPhoto(s3Resp.key, s3Resp.location, caption, location, tags))
      return result
    }).catch(err => console.log(err));
  }
}

function uploadPhoto(name, file, caption, location, tags) {
  const tagsArray = tags.split(",");
  const data = {
    caption: caption,
    location: location,
    tags: tags,
    file: {
      uri: file,
      type: "image/jpeg",
      name: name
    }
  }

  return (dispatch, getState) => {
    const { user: { token, profile: {username } } } = getState();

    return fetch(`${PHOTO_URL}/images/`, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
        "username": username
      },
      body: JSON.stringify(data)
    }).then(response => {
      if (response.status === 401) {
        dispatch(userActions.logOut());
      } else if (response.ok) {
        dispatch(getFeed());
        dispatch(userActions.getOwnProfile());
        return true;
      } else {
        return false;
      }
    }).catch(e => console.log(e));
  };
}

// Initial State

const initialState = {};

// Reducer

function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_FEED:
      return applySetFeed(state, action);
    case SET_SEARCH:
      return applySetSearch(state, action);
    default:
      return state;
  }
}

// Reducer Actions

function applySetFeed(state, action) {
  const { feed } = action;
  return {
    ...state,
    feed
  };
}

function applySetSearch(state, action) {
  const { search } = action;
  return {
    ...state,
    search
  };
}

// Exports

const actionCreators = {
  getFeed,
  getSearch,
  likePhoto,
  unlikePhoto,
  searchByHashtag,
  uploadPhoto,
  uploadToS3
};

export { actionCreators };

// Default Reducer Export

export default reducer;
