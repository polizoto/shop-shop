import React, { useEffect } from 'react';
import { useStoreContext } from '../../utils/GlobalState';
import { UPDATE_PRODUCTS } from '../../utils/actions';
// We should set it up so that when we save product data from the useQuery() Hook's response to the global state object with the dispatch() method, we also save each file to the products object store in IndexedDB using the idbPromise() function.
import { idbPromise } from "../../utils/helpers";
import { useQuery } from '@apollo/client';

import ProductItem from '../ProductItem';
import { QUERY_PRODUCTS } from '../../utils/queries';
import spinner from '../../assets/spinner.gif';
// Previous
// function ProductList({ currentCategory }) {
  function ProductList() {
  // Previous Code
  // const { loading, data } = useQuery(QUERY_PRODUCTS);

  // const products = data?.products || [];

  // function filterProducts() {
  //   if (!currentCategory) {
  //     return products;
  //   }

  //   return products.filter(
  //     (product) => product.category._id === currentCategory
  //   );
  // }

  const [state, dispatch] = useStoreContext();

  const { currentCategory } = state;
  
  const { loading, data } = useQuery(QUERY_PRODUCTS);
  
  // We then implement the useEffect() Hook in order to wait for our useQuery() response to come in. Once the data object returned from useQuery() goes from undefined to having an actual value, we execute our dispatch() function, instructing our reducer function that it's the UPDATE_PRODUCTS action and it should save the array of product data to our global store. When that's done, useStoreContext() executes again, giving us the product data needed display products to the page.
  useEffect(() => {
    if(data) {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products
      });
  
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
      // add else if to check if `loading` is undefined in `useQuery()` Hook
    } else if (!loading) {
      // With that in mind, we've added in a check after the if (data) statement to see if we should lean on IndexedDB for the data instead. If so, we'll run idbPromise() to get all of the data from the products store and use the returning array of product data to update the global store.
      // since we're offline, get all of the data from the `products` store
      idbPromise('products', 'get').then((products) => {
        // use retrieved data to set global state for offline browsing
        dispatch({
          type: UPDATE_PRODUCTS,
          products: products
        });
      });
    }
  }, [data, loading, dispatch]);
  
  function filterProducts() {
    if (!currentCategory) {
      return state.products;
    }
  
    return state.products.filter(product => product.category._id === currentCategory);
  }
  
  return (
    <div className="my-2">
      <h2>Our Products:</h2>
  {/* Get the data from the state object */}
      {state.products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
