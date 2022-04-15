import React from 'react';
import { idbPromise } from "../../utils/helpers";
import { useStoreContext } from '../../utils/GlobalState';
import { REMOVE_FROM_CART, UPDATE_CART_QUANTITY } from '../../utils/actions';

const CartItem = ({ item }) => {

  // Note that we only destructured the dispatch() function from the useStoreContext Hook, because the CartItem component has no need to read state
  // why the comma?
const [, dispatch] = useStoreContext();

const removeFromCart = item => {
  dispatch({
    type: REMOVE_FROM_CART,
    _id: item._id
  });
  idbPromise('cart', 'delete', { ...item });
};

// Anytime an <input> element's value changes, an onChange event will occur. We can capture that event and send the element's new value to the reducer.

const onChange = (e) => {
  const value = e.target.value;
// ither remove an item or update an item's quantity from the cart object store, as well as global state. 
  if (value === '0') {
    dispatch({
      type: REMOVE_FROM_CART,
      _id: item._id
    });
  } else {
    // automatically update the total dollar amount, because the parent Cart component re-renders whenever the global state is updated.
    dispatch({
      type: UPDATE_CART_QUANTITY,
      _id: item._id,
      purchaseQuantity: parseInt(value)
    });
  
    idbPromise('cart', 'put', { ...item, purchaseQuantity: parseInt(value) });
  }
};

  return (
    <div className="flex-row">
      <div>
        <img
          src={`/images/${item.image}`}
          alt=""
        />
      </div>
      <div>
        <div>{item.name}, ${item.price}</div>
        <div>
          <span>Qty:</span>
            <input
            type="number"
            placeholder="1"
            value={item.purchaseQuantity}
            onChange={onChange}
            />
          <span
          role="img"
          aria-label="trash"
          onClick={() => removeFromCart(item)}
          >
          🗑️
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartItem;