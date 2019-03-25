const INITIAL_STATE = {
  user: null,
  firebaseUserId: null
}

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_USER': {
      return {
        ...state,
        user: action.data
      };
    }
    case 'SET_FIREBASE_USER': {
      return {
        ...state,
        firebaseUserId: action.data
      };
    }
    default: {
      return state;
    }
  }
}

export default reducer;