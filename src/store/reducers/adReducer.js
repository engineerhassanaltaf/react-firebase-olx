import { SORT_BY_VALUE } from '../actions/adAction';

const INITIAL_STATE = {
  filterParams: {
    title: null,
    category: null,
    maxPrice: null,
    minPrice: null,
    sortBy: null,
    location: null
  },
  sortByValues: SORT_BY_VALUE,
  ads: []
}

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_AD_FILTERS': {
      return {
        ...state,
        filterParams: action.data
      }
    }
    case 'UPDATE_ADS': {
      return {
        ...state,
        ads: action.data
      }
    }
    default: {
      return state;
    }
  }
}

export default reducer;