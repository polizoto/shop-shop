import { useReducer } from 'react';

import {
    UPDATE_PRODUCTS,
    UPDATE_CATEGORIES,
    UPDATE_CURRENT_CATEGORY
  } from "./actions";

  export const reducer = (state, action) => {
    switch (action.type) {
      // if action type value is the value of `UPDATE_PRODUCTS`, return a new state object with an updated products array
      case UPDATE_PRODUCTS:
        return {
          ...state,
          products: [...action.products]
        };
      // if action type value is the value of `UPDATE_CATEGORIES`, return a new state object with an updated categories array
      case UPDATE_CATEGORIES:
        return {
          ...state,
          categories: [...action.categories]
        };

    case UPDATE_CURRENT_CATEGORY:
        return {
            ...state,
            currentCategory: action.currentCategory
        };
  
      default:
        return state;
    }
  };

//   This function, useProductReducer(), will be used to help initialize our global state object and then provide us with the functionality for updating that state by automatically running it through our custom reducer() function. Think of this as a more in-depth way of using the useState() Hook we've used so much.
// The useReducer() Hook is meant specifically for managing a greater level of state, like we're doing now. We're going to put it to use next, when we learn more about how all of this comes together.
  export function useProductReducer(initialState) {
    return useReducer(reducer, initialState);
  }