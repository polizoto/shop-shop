import React, { useEffect } from "react";
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from "../../utils/actions";
import { idbPromise } from "../../utils/helpers";
import CartItem from '../CartItem';
import Auth from '../../utils/auth';
import './style.css';
// You'll use the custom useStoreContext Hook to establish a state variable and the dispatch() function to update the state.
import { useStoreContext } from '../../utils/GlobalState';
import { QUERY_CHECKOUT } from '../../utils/queries';
import { loadStripe } from '@stripe/stripe-js';
import { useLazyQuery } from '@apollo/client';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const Cart = () => {
// Remember, useLazyQuery is a Hook, so the data it returned would trigger a component update.
  const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);

  const [state, dispatch] = useStoreContext();

  useEffect(() => {
    if (data) {
      stripePromise.then((res) => {
        res.redirectToCheckout({ sessionId: data.checkout.session });
      });
    }
  }, [data]);

  useEffect(() => {

    // With this function in place, we're checking to see if state.cart.length is 0, then executing getCart() to retrieve the items from the cart object store and save it to the global state object. We dispatch the ADD_MULTIPLE_TO_CART action here because we have an array of items returning from IndexedDB, even if it's just one product saved. This way we can just dump all of the products into the global state object at once instead of doing it one by one.
    
        async function getCart() {
          const cart = await idbPromise('cart', 'get');
          dispatch({ type: ADD_MULTIPLE_TO_CART, products: [...cart] });
        };
    
        if (!state.cart.length) {
          getCart();
        }
        }, [state.cart.length, dispatch]);

  // This handler will toggle the cartOpen value whenever the [close] text is clicked, but nothing visual will happen yet.
  function toggleCart() {
  dispatch({ type: TOGGLE_CART });
}

// This function will add up the prices of everything saved in state.cart, which can then be displayed in the JSX.
function calculateTotal() {
  let sum = 0;
  state.cart.forEach(item => {
    sum += item.price * item.purchaseQuantity;
  });
  return sum.toFixed(2);
}

// When the user clicks Checkout, this function will loop over the items saved in state.cart and add their IDs to a new productIds array. This productIds array is what the QUERY_CHECKOUT query would need to generate the Stripe session.
function submitCheckout() {
  const productIds = [];
  
  state.cart.forEach((item) => {
    for (let i = 0; i < item.purchaseQuantity; i++) {
      productIds.push(item._id);
    }
  });

  getCheckout({
    variables: { products: productIds }
  });
  
}

// If cartOpen is false, the component will return a much smaller <div>. Clicking this <div>, however, will set cartOpen to true and return the expanded shopping cart.
if (!state.cartOpen) {
  return (
    <div className="cart-closed" onClick={toggleCart}>
      <span
        role="img"
        aria-label="trash">🛒</span>
    </div>
  );
}

  return (
<div className="cart">
  <div className="close" onClick={toggleCart}>[close]</div>
  <h2>Shopping Cart</h2>
  {state.cart.length ? (
    <div>
      {state.cart.map(item => (
        <CartItem key={item._id} item={item} />
      ))}
      <div className="flex-row space-between">
        <strong>Total: ${calculateTotal()}</strong>
        {
          Auth.loggedIn() ?
          <button onClick={submitCheckout}>
          Checkout
          </button>
            :
            <span>(log in to check out)</span>
        }
      </div>
    </div>
  ) : (
    <h3>
      <span role="img" aria-label="shocked">
        😱
      </span>
      You haven't added anything to your cart yet!
    </h3>
  )}
</div>
  );
};

export default Cart;