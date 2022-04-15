import { useReducer } from 'react';

import {
  UPDATE_PRODUCTS,
  UPDATE_CATEGORIES,
  UPDATE_CURRENT_CATEGORY,
  ADD_TO_CART,
  ADD_MULTIPLE_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  CLEAR_CART,
  TOGGLE_CART
} from './actions';

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

    // Let's not forget to include the ...state operator to preserve everything else on state. Then we can update the cart property to add action.product to the end of the array. We'll also set cartOpen to true so that users can immediately view the cart with the newly added item, if it's not already open. 

    case ADD_TO_CART:
          return {
            ...state,
            cartOpen: true,
                // What is the value of product? Where does that data come from?
                // See line 69 of Reducers test
                //       product: { purchaseQuantity: 1 }
            cart: [...state.cart, action.product]
          };
    
    case ADD_MULTIPLE_TO_CART:
      return {
        ...state,
        cart: [...state.cart, ...action.products],
      };

      case REMOVE_FROM_CART:
      let newState = state.cart.filter(product => {
        return product._id !== action._id;
      });

      return {
        ...state,
        cartOpen: newState.length > 0,
        // this is an interesting use
        cart: newState
      };

      case UPDATE_CART_QUANTITY:
      return {
      ...state,
      cartOpen: true,
      cart: state.cart.map(product => {
        if (action._id === product._id) {
          product.purchaseQuantity = action.purchaseQuantity;
        }
      // Why did we need to use the map() method to create a new array instead of updating state.cart directly?
      // The original state should be treated as immutable.
        return product;
      })
      };

      case CLEAR_CART:
      return {
      ...state,
      cartOpen: false,
      cart: []
      };

      // This test expects cartOpen to be the opposite of its previous value each time the action is called.
      case TOGGLE_CART:
      return {
      ...state,
      cartOpen: !state.cartOpen
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