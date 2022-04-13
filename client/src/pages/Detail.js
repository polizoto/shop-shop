import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useStoreContext } from "../utils/GlobalState";
import { UPDATE_PRODUCTS } from "../utils/actions";

import { QUERY_PRODUCTS } from '../utils/queries';
import spinner from '../assets/spinner.gif';

function Detail() {
  // Previous
  // const { id } = useParams();

  // const [currentProduct, setCurrentProduct] = useState({});

  // const { loading, data } = useQuery(QUERY_PRODUCTS);

  // const products = data?.products || [];

  // useEffect(() => {
  //   if (products.length) {
  //     setCurrentProduct(products.find((product) => product._id === id));
  //   }
  // }, [products, id]);
  const [state, dispatch] = useStoreContext();
  const { id } = useParams();
  
  // This is one of those cases where saving a single product to the global state object doesn't actually benefit us in any way, shape, or form. The single product's data will only be used in this specific component at this specific moment. This is the same reason why we don't worry about saving form entry data from the login or signup forms to global state; it only needs to exist when we're using those components!
  const [currentProduct, setCurrentProduct] = useState({})
  
  const { loading, data } = useQuery(QUERY_PRODUCTS);
  
  const { products } = state;
  
  useEffect(() => {
    if (products.length) {
      setCurrentProduct(products.find(product => product._id === id));
      // what happens if we don't have any products in our global state object? What happens if someone just sent you this product's URL and this is the first time you've loaded this application?
    } else if (data) {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products
      });
    }
    // If that's the case, then you wouldn't have any products saved in global state just yet. The useEffect() Hook is set up so that if we don't, we'll use the product data that we returned from the useQuery() Hook to set the product data to the global state object. When that's complete, we run through this all over again. But this time, there is data in the products array, and then we run setCurrentProduct() to display a single product's data. This is known as the dependency array.
  }, [products, data, dispatch, id]);

  return (
    <>
      {currentProduct ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{' '}
            <button>Add to Cart</button>
            <button>Remove from Cart</button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </>
  );
}

export default Detail;
